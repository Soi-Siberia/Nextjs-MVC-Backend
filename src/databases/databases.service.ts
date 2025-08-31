import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { SoftDeleteModel } from 'mongoose-delete'; // Import SoftDeleteModel if you are using soft delete
import { Permission } from 'src/permissions/schemas/permission.schema';
import { Role } from 'src/roles/schemas/role.schema';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { INIT_PERMISSIONS, ADMIN_ROLE, USER_ROLE } from 'src/databases/sample'
import { hashPassword } from '../common/utils/bcrypt.util'

@Injectable()
export class DatabasesService implements OnModuleInit {


    constructor(
        @InjectModel(User.name)
        private UserModel: SoftDeleteModel<User>,

        @InjectModel(Permission.name)
        private permissionModel: SoftDeleteModel<Permission>,

        @InjectModel(Role.name)
        private roleModel: SoftDeleteModel<Role>,

        private configService: ConfigService,
        private userService: UsersService

    ) { }



    async onModuleInit() {

        const isInit = this.configService.get<string>("SOULD_INIT");
        if (Boolean(isInit)) {

            const coutUser = await this.UserModel.countDocuments({})
            const countPermission = await this.permissionModel.countDocuments({})
            const countRole = await this.roleModel.countDocuments({})

            if (countPermission === 0) {
                await this.permissionModel.insertMany(INIT_PERMISSIONS)
            }

            if (countRole === 0) {
                const permissions = await this.permissionModel.find({}).select("_id");
                await this.roleModel.insertMany([
                    {
                        name: ADMIN_ROLE,
                        description: "admin role full tất cả các quyền",
                        isActive: true,
                        permissions: permissions
                    },
                    {
                        name: USER_ROLE,
                        description: "Người dùng/ ứng viên sử dụng hệ thống",
                        isActive: true,
                        permissions: []
                    }
                ])
            }

            if (coutUser === 0) {
                const adminrole = await this.roleModel.findOne({ name: ADMIN_ROLE })
                const userRole = await this.roleModel.findOne({ name: USER_ROLE })
                await this.UserModel.insertMany([
                    {
                        name: "Tôi là Admin",
                        mail: "admin@gmail.com",
                        password: await hashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        age: 25,
                        gender: "name",
                        role: adminrole?._id
                    },
                    {
                        name: "Tôi là Admin xóa",
                        mail: "hungvn@gmail.com",
                        password: await hashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        age: 25,
                        gender: "name",
                        role: adminrole?._id
                    },
                    {
                        name: "Tôi là User thường",
                        mail: "user@gmail.com",
                        password: await hashPassword(this.configService.get<string>("INIT_PASSWORD")),
                        age: 25,
                        gender: "name",
                        role: userRole?._id
                    }
                ])
            }
        }

        console.log(`The module has been initialized.`);
    }
}
