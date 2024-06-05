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
exports.AccountController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mongodb_1 = require("mongodb");
const auth_guard_1 = require("../auth/guards/auth.guard");
class UpdateAccountDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateAccountDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UpdateAccountDto.prototype, "state", void 0);
let AccountController = class AccountController {
    constructor(db) {
        this.db = db;
    }
    async updateAccount(req, updateData) {
        const sellerId = req.seller.seller_id;
        const updateFields = {};
        if (updateData.city)
            updateFields.seller_city = updateData.city;
        if (updateData.state)
            updateFields.seller_state = updateData.state;
        await this.db
            .collection('sellers')
            .updateOne({ seller_id: sellerId }, { $set: updateFields });
        const updatedSeller = await this.db
            .collection('sellers')
            .findOne({ seller_id: sellerId });
        return {
            city: updatedSeller.seller_city,
            state: updatedSeller.seller_state,
        };
    }
};
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Patch)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update account information' }),
    (0, swagger_1.ApiBody)({
        type: UpdateAccountDto,
        description: 'Fields to update (city and/or state)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Account information updated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateAccountDto]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "updateAccount", null);
AccountController = __decorate([
    (0, swagger_1.ApiTags)('Account'),
    (0, swagger_1.ApiBasicAuth)(),
    (0, common_1.Controller)('account'),
    __param(0, (0, common_1.Inject)('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [mongodb_1.Db])
], AccountController);
exports.AccountController = AccountController;
//# sourceMappingURL=account.controller.js.map