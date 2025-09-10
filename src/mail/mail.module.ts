import { ConfigService } from "@nestjs/config";
import { MailController } from "./mail.controller";
import { MailService } from "./mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { join } from "path";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Job, JobSchema } from "src/jobs/schemas/job.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { Subscriber, SubscriberSchema } from "src/subscribers/schemas/subscriber.schema";

@Module({
  imports: [

    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    MongooseModule.forFeature([{ name: Subscriber.name, schema: SubscriberSchema }]),

    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          port: configService.get<number>('EMAIL_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('SENDER_EMAIL'),
            pass: configService.get<string>('SENDER_PASSWORD'),
          },
        },

        template: {
          dir: join(__dirname, 'templates'),
          // dir: join(process.cwd(), 'src', 'mail', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },

        preview: configService.get<string>('PREVIEW_EMAIL') === 'true' ? true : false,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule { } 