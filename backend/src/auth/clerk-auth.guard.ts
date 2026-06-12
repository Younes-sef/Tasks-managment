import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createClerkClient } from '@clerk/clerk-sdk-node';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/auth.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private clerk: any;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {
    this.clerk = createClerkClient({
      secretKey: this.configService.get<string>('CLERK_SECRET_KEY'),
      publishableKey: this.configService.get<string>('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'),
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.clerk.verifyToken(token, {
        secretKey: this.configService.get<string>('CLERK_SECRET_KEY'),
      });

      const clerkId = payload.sub;

      // Find user in MongoDB using clerkId
      let user = await this.userModel.findOne({ clerkId }).exec();

      if (!user) {
        // Just-in-time user synchronization
        const clerkUser = await this.clerk.users.getUser(clerkId);
        const email = clerkUser.emailAddresses[0]?.emailAddress || '';
        const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || 'User';
        
        // Attempt to find by email to link existing pre-Clerk accounts
        user = await this.userModel.findOneAndUpdate(
          { email },
          { $set: { clerkId, name, email } },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        ).exec();
      }

      // Attach user to request, converting MongoDB _id to string for existing logic
      request.user = {
        userId: (user as any)._id.toString(),
        clerkId: user.clerkId,
        email: user.email,
        role: user.role,
      };

      return true;
    } catch (err) {
      console.error('Clerk auth error:', err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
