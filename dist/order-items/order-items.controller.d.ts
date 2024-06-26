import { Db } from 'mongodb';
export declare class OrderItemsController {
    private readonly db;
    constructor(db: Db);
    getOrderItems(req: any, limit?: number, offset?: number, sort?: string): Promise<{
        data: import("bson").Document[];
        total: number;
        limit: number;
        offset: number;
    }>;
    getOrderItemById(req: any, id: string): Promise<import("bson").Document>;
    deleteOrderItem(req: any, id: string): Promise<{
        message: string;
    }>;
}
