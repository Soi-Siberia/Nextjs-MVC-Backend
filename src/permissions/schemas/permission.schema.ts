import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, mongo } from "mongoose";

export type CatDocument = HydratedDocument<Permission>;

@Schema({ timestamps: true })
export class Permission {

    @Prop()
    name: string

    @Prop()
    apiPath: string

    @Prop()
    method: string

    @Prop()
    module: string //thuộc modules nào ?

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date

    @Prop()
    deletedAt: Date

    @Prop({ default: false })
    isDeleted: boolean;

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

export const PermissionSchema = SchemaFactory.createForClass(Permission);
