
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Company>;

@Schema({ timestamps: true })
export class Company {
    @Prop()
    name: string;

    @Prop()
    phone: string;

    @Prop()
    email: string;

    @Prop()
    address: string;

    @Prop()
    description: string;

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

export const CompanySchema = SchemaFactory.createForClass(Company);
