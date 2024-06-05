"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const mongodb_1 = require("mongodb");
exports.databaseProviders = {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
        const client = new mongodb_1.MongoClient(uri);
        await client.connect();
        return client.db('ecommerce');
    },
};
//# sourceMappingURL=database.provider.js.map