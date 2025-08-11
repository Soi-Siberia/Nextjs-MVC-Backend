
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Job>;

@Schema({ timestamps: true })
export class Job {
    @Prop()
    name: string;

    @Prop()
    skill: string[];

    @Prop({ type: Object })
    company: {
        _id: mongoose.Schema.Types.ObjectId; // ép kiểu cho _id là ObjectId của mongoose
        name: string;
    }

    @Prop()
    location: string;

    @Prop()
    salary: number;

    @Prop()
    quantity: number; //số lượng tuyển

    @Prop()
    level: string;

    @Prop()
    description: string;

    @Prop()
    stratDate: Date;

    @Prop()
    eddDate: Date;

    @Prop()
    isActive: boolean;

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId; // ép kiểu cho _id là ObjectId của mongoose
        name: string;
    };

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        name: string;
    };

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        name: string;
    };

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;



}

export const JobSchema = SchemaFactory.createForClass(Job);
