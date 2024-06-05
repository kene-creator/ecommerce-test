import { MongoClient } from 'mongodb';
import { Provider } from '@nestjs/common';

export const databaseProviders: Provider = {
  provide: 'DATABASE_CONNECTION',
  useFactory: async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(uri);
    await client.connect();
    return client.db('ecommerce');
  },
};
