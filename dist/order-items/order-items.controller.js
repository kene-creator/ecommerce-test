"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItemsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mongodb_1 = require("mongodb");
const auth_guard_1 = require("../auth/guards/auth.guard");
let OrderItemsController = class OrderItemsController {
    constructor(db) {
        this.db = db;
    }
    async getOrderItems(req, limit = 20, offset = 0, sort = 'shipping_limit_date') {
        const sellerId = req.seller.seller_id;
        const orderItems = await this.db
            .collection('order_items')
            .aggregate([
            { $match: { seller_id: sellerId } },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: 'product_id',
                    as: 'product',
                },
            },
            { $unwind: '$product' },
            { $sort: { [sort]: 1 } },
            { $skip: parseInt(offset.toString()) },
            { $limit: parseInt(limit.toString()) },
            {
                $project: {
                    id: '$order_item_id',
                    product_id: '$product_id',
                    product_category: '$product.product_category_name',
                    price: '$price',
                    date: '$shipping_limit_date',
                },
            },
        ])
            .toArray();
        const total = await this.db
            .collection('order_items')
            .countDocuments({ seller_id: sellerId });
        return {
            data: orderItems,
            total,
            limit: parseInt(limit.toString()),
            offset: parseInt(offset.toString()),
        };
    }
    async deleteOrderItem(req, id) {
        const sellerId = req.seller.seller_id;
        const result = await this.db
            .collection('order_items')
            .deleteOne({ order_item_id: id, seller_id: sellerId });
        if (result.deletedCount === 0) {
            throw new common_1.HttpException('Order item not found', common_1.HttpStatus.NOT_FOUND);
        }
        return { message: 'Order item deleted successfully' };
    }
};
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get order items' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Limit the number of results (default: 20, max: 100)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        required: false,
        type: Number,
        description: 'Offset for pagination (default: 0)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sort',
        required: false,
        type: String,
        description: 'Sort by price or shipping_limit_date (default: shipping_limit_date)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the list of order items' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], OrderItemsController.prototype, "getOrderItems", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an order item' }),
    (0, swagger_1.ApiParam)({ name: 'id', required: true, description: 'Order item ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order item deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order item not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrderItemsController.prototype, "deleteOrderItem", null);
OrderItemsController = __decorate([
    (0, swagger_1.ApiTags)('Order Items'),
    (0, swagger_1.ApiBasicAuth)(),
    (0, common_1.Controller)('order_items'),
    __param(0, (0, common_1.Inject)('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [mongodb_1.Db])
], OrderItemsController);
exports.OrderItemsController = OrderItemsController;
//# sourceMappingURL=order-items.controller.js.map