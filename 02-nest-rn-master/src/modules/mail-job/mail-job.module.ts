import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailJobController } from './mail-job.controller';
import { MailJobProcessor } from './mail-job.processor';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'mail-queue', // Tên hàng đợi
        }),
    ],
    controllers: [MailJobController],
    providers: [MailJobProcessor],
})
export class MailJobModule { }