import { Schema, Model, Document, model } from "mongoose";
import { PasswordService } from "../services/password";

export interface IUser {
  email: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
};

interface IUserModel extends Model<IUser> {
  build: (model: IUser) => IUser & Document
};

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    }
  }
});

userSchema.statics.build = (model: IUser) => {
  return new UserModel(model)
};

userSchema.pre('save', function(done) {
  if (this.isModified('password')) {
    const hashed = PasswordService.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

export const UserModel = model<Document<IUser>, IUserModel>('User', userSchema);