import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Db } from 'mongodb';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject('DATABASE_CONNECTION') private readonly db: Db) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) return false;

    const [type, credentials] = authHeader.split(' ');

    if (type !== 'Basic' || !credentials) return false;

    const decodedCredentials = Buffer.from(credentials, 'base64').toString(
      'ascii',
    );
    const [sellerId, sellerZipCodePrefix] = decodedCredentials.split(':');

    const seller = await this.db.collection('sellers').findOne({
      seller_id: sellerId,
      seller_zip_code_prefix: sellerZipCodePrefix,
    });

    if (!seller) return false;

    request.seller = seller;
    return true;
  }
}
