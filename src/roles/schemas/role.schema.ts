import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose from "mongoose"
import { Permission } from "src/permissions/schemas/permission.schema"

@Schema({ timestamps: true })
export class Role {

    @Prop()
    name: string

    @Prop()
    description: string

    @Prop()
    isActive: boolean

    // @Prop([{ type: mongoose.Types.ObjectId, ref: Permission.name }])
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Permission.name }] })
    permissions: [
        _id: mongoose.Schema.Types.ObjectId[] // ép kiểu cho _id là ObjectId của mongoose
    ] //thuộc modules nào ?

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

export const RoleSchema = SchemaFactory.createForClass(Role);
