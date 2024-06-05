import {
  Controller,
  Patch,
  Req,
  UseGuards,
  Body,
  Inject,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
import { Db } from 'mongodb';
import { AuthGuard } from 'src/auth/guards/auth.guard';

class UpdateAccountDto {
  @ApiProperty()
  city?: string;
  @ApiProperty()
  state?: string;
}

@ApiTags('Account')
@ApiBasicAuth()
@Controller('account')
export class AccountController {
  constructor(@Inject('DATABASE_CONNECTION') private readonly db: Db) {}

  @UseGuards(AuthGuard)
  @Patch()
  @ApiOperation({ summary: 'Update account information' })
  @ApiBody({
    type: UpdateAccountDto,
    description: 'Fields to update (city and/or state)',
  })
  @ApiResponse({
    status: 200,
    description: 'Account information updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateAccount(@Req() req, @Body() updateData: UpdateAccountDto) {
    const sellerId = req.seller.seller_id;

    const updateFields: any = {};
    if (updateData.city) updateFields.seller_city = updateData.city;
    if (updateData.state) updateFields.seller_state = updateData.state;

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
}
