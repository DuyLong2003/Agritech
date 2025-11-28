import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('mail-queue')
export class MailJobProcessor {
    constructor(private readonly mailerService: MailerService) { }

    @Process('send-welcome')
    async handleSendEmail(job: Job) {
        // Log báo bắt đầu
        console.log(`[Mail Worker] 🚀 Đang gửi mail cho: ${job.data.email}`);

        try {
            // Gửi mail thực tế
            await this.mailerService.sendMail({
                to: job.data.email,
                subject: job.data.subject,
                template: 'register',
                context: {
                    name: job.data.name || 'User',
                    activationCode: '123456'
                },
            });

            // Log báo thành công
            console.log(`[Mail Worker] ✅ Đã gửi THÀNH CÔNG cho ${job.data.email}`);

            // Trả về kết quả (để lưu vào log của Bull nếu cần)
            return { sent: true, email: job.data.email };

        } catch (error) {
            // Nếu lỗi thật (sai pass, mất mạng thật) thì vẫn log ra để biết
            console.error(`[Mail Worker] ❌ Lỗi gửi mail: ${error.message}`);
            throw error; // Ném lỗi để Bull tự động Retry
        }
    }
}