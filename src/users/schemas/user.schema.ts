// export class User { }
import { create } from 'domain';
import e from 'express';
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    name: String,
    account: String,
    email: String,
    address: String,
    phone: Number,
    createdAt: Date,
    updatedAt: Date,

});