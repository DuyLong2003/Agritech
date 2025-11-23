import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';

@Controller('files')
export class FilesController {
    constructor(private readonly minioService: MinioService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file')) // 'file' là tên field trong FormData
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return await this.minioService.uploadFile(file);
    }
}