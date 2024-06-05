import {
  Controller,
  Get,
  Query,
  Delete,
  Param,
  Req,
  UseGuards,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { Db } from 'mongodb';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('Order Items')
@ApiBasicAuth()
@Controller('order_items')
export class OrderItemsController {
  constructor(@Inject('DATABASE_CONNECTION') private readonly db: Db) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get order items' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit the number of results (default: 20, max: 100)',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Offset for pagination (default: 0)',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description:
      'Sort by price or shipping_limit_date (default: shipping_limit_date)',
  })
  @ApiResponse({ status: 200, description: 'Return the list of order items' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getOrderItems(
    @Req() req,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
    @Query('sort') sort = 'shipping_limit_date',
  ) {
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

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order item' })
  @ApiParam({ name: 'id', required: true, description: 'Order item ID' })
  @ApiResponse({ status: 200, description: 'Order item deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  async deleteOrderItem(@Req() req, @Param('id') id: string) {
    const sellerId = req.seller.seller_id;

    const result = await this.db
      .collection('order_items')
      .deleteOne({ order_item_id: id, seller_id: sellerId });

    if (result.deletedCount === 0) {
      throw new HttpException('Order item not found', HttpStatus.NOT_FOUND);
    }

    return { message: 'Order item deleted successfully' };
  }
}
