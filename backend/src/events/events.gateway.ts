import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    const userId = client.handshake.query.userId as string | undefined;
    if (userId) {
      client.join(userId);
      this.logger.log(`Client ${client.id} joined room for user ${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Method to send events to a specific user
  emitToUser(userId: string, event: string, payload: any) {
    this.server.to(userId).emit(event, payload);
  }
}
