import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import { Webhook } from 'svix';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/auth.schema';
import { ConfigService } from '@nestjs/config';

@Controller('api/webhooks')
export class WebhooksController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  @Post('clerk')
  async handleClerkWebhook(@Req() req: any, @Res() res: any, @Headers() headers: any) {
    const WEBHOOK_SECRET = this.configService.get<string>('WEBHOOK_SECRET');

    if (!WEBHOOK_SECRET) {
      throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    const svix_id = headers['svix-id'];
    const svix_timestamp = headers['svix-timestamp'];
    const svix_signature = headers['svix-signature'];

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({ error: 'Missing svix headers' });
    }

    const payload = req.body;
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: any;

    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err.message);
      return res.status(400).json({ error: 'Error verifying webhook' });
    }

    const eventType = evt.type;

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const email = email_addresses?.[0]?.email_address;
      const name = [first_name, last_name].filter(Boolean).join(' ') || 'User';

      await this.userModel.findOneAndUpdate(
        { clerkId: id },
        { clerkId: id, email, name, role: 'user' },
        { upsert: true, new: true }
      );
    } else if (eventType === 'user.deleted') {
      const { id } = evt.data;
      await this.userModel.findOneAndDelete({ clerkId: id });
    }

    return res.status(200).json({ success: true });
  }
}
