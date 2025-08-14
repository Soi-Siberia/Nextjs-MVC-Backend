import { Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as fs from "fs"; // Import toàn bộ module fs
import { extname, basename, join } from "path"; // Import các hàm cần dùng từ path

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {

    // Lấy đường dẫn gốc của project (nơi chạy NestJS)
    getRootPath = () => {
        return process.cwd();
    };

    // Đảm bảo thư mục tồn tại (nếu chưa có thì tạo)
    ensureExists(targetDirectory: string) {
        try {
            // mkdirSync: tạo thư mục đồng bộ, recursive: true để tạo nhiều cấp
            fs.mkdirSync(targetDirectory, { recursive: true });
            console.log(`✅ Directory ready: ${targetDirectory}`);
        } catch (error) {
            console.error(`❌ Error creating directory ${targetDirectory}:`, error);
        }
    }

    // Cấu hình Multer
    createMulterOptions(): MulterModuleOptions {
        return {
            storage: diskStorage({
                // Nơi lưu file
                destination: (req, file, cb) => {
                    // Lấy tên folder từ header "folder_type", nếu không có thì mặc định "default"
                    const folder = req?.headers?.folder_type ?? "default";

                    // Tạo đường dẫn tuyệt đối
                    const targetPath = join(this.getRootPath(), `public/images/${folder}`);

                    // Đảm bảo thư mục tồn tại trước khi ghi file
                    this.ensureExists(targetPath);

                    // Trả về đường dẫn cho Multer
                    cb(null, targetPath);
                },

                // Tạo tên file mới khi lưu
                filename: (req, file, cb) => {
                    // Lấy phần mở rộng của file (vd: .jpg)
                    const extName = extname(file.originalname);

                    // Lấy tên file gốc (bỏ phần mở rộng)
                    const baseName = basename(file.originalname, extName);

                    // Ghép tên file mới: tên gốc + timestamp + phần mở rộng
                    const finalName = `${baseName}-${Date.now()}${extName}`;

                    cb(null, finalName);
                }
            }),

            // Giới hạn dung lượng upload
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            },

            // Bộ lọc loại file
            fileFilter: (req, file, cb) => {
                // Chỉ cho phép ảnh JPG, JPEG, PNG
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return cb(new Error('Chỉ cho phép file JPG, JPEG, PNG!'), false);
                }
                cb(null, true);
            },
        };
    }
}
