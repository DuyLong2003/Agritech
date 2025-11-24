import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductSchema } from './schema/product.schema';

@Module({
  imports: [
    // Dòng này cực kỳ quan trọng, thiếu nó là DB không nhận diện được
    MongooseModule.forFeature([{ name: Products.name, schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // Export để module khác dùng nếu cần
})
export class ProductsModule { }