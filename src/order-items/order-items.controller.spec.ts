import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { OrderItemsController } from './order-items.controller';
import { MongoClient, Db } from 'mongodb';
import { AuthGuard } from 'src/auth/guards/auth.guard';

describe('OrderItemsController', () => {
  let app: INestApplication;
  let db: Db;

  beforeAll(async () => {
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    db = client.db('ecommerce');

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemsController],
      providers: [
        AuthGuard,
        {
          provide: 'DATABASE_CONNECTION',
          useValue: db,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/GET order_items', () => {
    return request(app.getHttpServer())
      .get('/order_items')
      .set(
        'Authorization',
        'Basic ' +
          Buffer.from('seller_id:seller_zip_code_prefix').toString('base64'),
      )
      .expect(200);
  });

  it('/DELETE order_items/:id', () => {
    return request(app.getHttpServer())
      .delete('/order_items/some_id')
      .set(
        'Authorization',
        'Basic ' +
          Buffer.from('seller_id:seller_zip_code_prefix').toString('base64'),
      )
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
