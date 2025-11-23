import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { MinioService } from './minio.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    controllers: [FilesController],
    providers: [MinioService],
    exports: [MinioService],
})
export class FilesModule { }