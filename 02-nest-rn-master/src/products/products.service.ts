import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Products, ProductsDocument } from './schema/product.schema';
import apiQueryParams from 'api-query-params';
import mongoose from 'mongoose'; // Import để check ObjectId

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Products.name) private productModel: Model<ProductsDocument>
  ) { }

  async create(createProductDto: CreateProductDto) {
    const newProduct = await this.productModel.create(createProductDto);
    return {
      _id: newProduct._id,
      createdAt: newProduct.createdAt
    };
  }

  async findAll(query: any, current: number, pageSize: number) {
    const { filter, sort } = apiQueryParams(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.productModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const results = await this.productModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any);

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      result: results,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return `Product not found`;
    return this.productModel.findOne({ _id: id });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) return `Product not found`;
    return await this.productModel.updateOne({ _id: id }, { ...updateProductDto });
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return `Product not found`;
    return this.productModel.deleteOne({ _id: id });
  }
}