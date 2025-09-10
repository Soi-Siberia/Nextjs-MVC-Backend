import { Controller, Get } from '@nestjs/common';
import { Public, ResponseMessage } from 'src/decorator/cusommize';
import { MailerService } from '@nestjs-modules/mailer';
import { Subscriber } from 'src/subscribers/schemas/subscriber.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { Job } from 'src/jobs/schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailerService: MailerService,
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<Subscriber>,

    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<Job>,
  ) { }


  @Get()
  @Public()
  @ResponseMessage("Test email")
  async handleTestEmail() {
    // const jobs = [
    //   {
    //     name: "Frontend Developer",
    //     company: "Công ty ABC",
    //     salary: "$1000 - $1500",
    //     skills: ["React", "TypeScript"],
    //   },
    //   {
    //     name: "Backend Developer",
    //     company: "Công ty XYZ",
    //     salary: "$1200 - $1800",
    //     skills: ["NestJS", "PostgreSQL"],
    //   },
    // ]



    const subscribers = await this.subscriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } });
      if (jobWithMatchingSkills?.length) {
        const jobs = jobWithMatchingSkills.map(item => {
          return {
            name: item.name,
            company: item.company.name,
            salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
            skills: item.skills
          }
        })

        await this.mailerService.sendMail({
          to: "ngochung221096@gmail.com",
          from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Nice App! Confirm your Email',
          template: "job", // HTML body content
          context: {
            receiver: subs.name,
            jobs: jobs
          }
        });
      }
    }



    // await this.mailerService.sendMail({
    //   to: "ngochung221096@gmail.com",
    //   from: '"Support Team" <support@example.com>', // override default from 
    //   subject: 'Welcome to Nice App! Confirm your Email',
    //   template: 'job', // HTML body content 
    //   context: {
    //     receiver: "Sói Con",
    //     jobs: jobs
    //   },
    // });
  }

}


