
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true })
export class Resume {
    @Prop()
    name: string;

    @Prop()
    userId: mongoose.Schema.Types.ObjectId; // ép kiểu cho userId là ObjectId của mongoose

    @Prop()
    url: string;

    @Prop()
    status: string;

    @Prop()
    companyId: mongoose.Schema.Types.ObjectId; // ép kiểu cho companyId là ObjectId của mongoose

    @Prop()
    jobId: mongoose.Schema.Types.ObjectId; // ép kiểu cho companyId là ObjectId của mongoose

    @Prop()
    history: {
        status: string; // Trạng thái của hồ sơ (ví dụ: "Đã nộp", "Đã xem", "Đã phỏng vấn", v.v.)
        updatedAt: Date; // Ngày cập nhật trạng thái
        updatedBy: {
            _id: mongoose.Schema.Types.ObjectId; // ép kiểu cho _id là ObjectId của mongoose
            name: string; // Tên người cập nhật trạng thái
        };
    }[];

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

    @Prop()
    deletedAt: Date;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
