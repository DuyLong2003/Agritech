import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('current') current: string, // Lấy từ query params
    @Query('pageSize') pageSize: string,
    @Query() query: string,
  ) {
    return this.productsService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id); // Bỏ dấu +
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto); // Bỏ dấu +
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id); // Bỏ dấu +
  }
}