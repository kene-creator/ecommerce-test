import { Db } from 'mongodb';
declare class UpdateAccountDto {
    city?: string;
    state?: string;
}
export declare class AccountController {
    private readonly db;
    constructor(db: Db);
    updateAccount(req: any, updateData: UpdateAccountDto): Promise<{
        city: any;
        state: any;
    }>;
}
export {};
