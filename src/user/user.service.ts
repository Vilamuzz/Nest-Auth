import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto | any) {
    const created = new this.userModel(createUserDto);
    return created.save();
  }

  async findByUsername(username: string) {
    // your users store email, so query by email
    return this.userModel.findOne({ email: username }).exec();
  }

  async findByToken(token: string) {
    return this.userModel.findOne({ token }).exec();
  }
}