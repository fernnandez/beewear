import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/infra/auth/decorator/current-user.decorator';
import { User } from '../user.entity';
import { AddressService } from './address.service';
import { AddressResponseDto } from './dto/address-response.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Addresses')
@Controller('addresses')
@ApiBearerAuth('access-token')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateAddressDto,
  ): Promise<AddressResponseDto> {
    return this.addressService.create(user.id, dto);
  }

  @Get()
  async findAll(@CurrentUser() user: User): Promise<AddressResponseDto[]> {
    return this.addressService.findAll(user.id);
  }

  @Put(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAddressDto,
  ): Promise<AddressResponseDto> {
    return this.addressService.update(user.id, id, dto);
  }

  @Delete(':id')
  async remove(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.addressService.remove(user.id, id);
  }
}
