
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose from "mongoose"
import { Permission } from "src/permissions/schemas/permission.schema"

@Schema({ timestamps: true })
export class Subscriber {

    @Prop()
    name: string

    @Prop()
    email: string

    @Prop()
    skills: string[]

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date

    @Prop()
    deletedAt: Date

    @Prop({ default: false })
    isDeleted: boolean

    @Prop({ type: Object })
    createdBy:
        {
            _id: mongoose.Schema.Types.ObjectId; // ép kiểu cho _id là ObjectId của mongoose
            email: string;
        }

    @Prop({ type: Object })
    updatedBy:
        {
            _id: mongoose.Schema.Types.ObjectId; // ép kiểu cho _id là ObjectId của mongoose
            email: string;
        }

    @Prop({ type: Object })
    deletedBy:
        {
            _id: mongoose.Schema.Types.ObjectId; // ép kiểu cho _id là ObjectId của mongoose
            email: string;
        }
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
