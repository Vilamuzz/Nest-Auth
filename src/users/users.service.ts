import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async create(user: Partial<User>) {
    const created = new this.userModel(user);
    return created.save();
  }

  async setHashedRefreshToken(userId: string, hashed: string | null) {
    return this.userModel
      .findByIdAndUpdate(userId, { hashedRefreshToken: hashed }, { new: true })
      .exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }
}
