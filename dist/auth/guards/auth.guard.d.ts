import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Db } from 'mongodb';
export declare class AuthGuard implements CanActivate {
    private readonly db;
    constructor(db: Db);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
