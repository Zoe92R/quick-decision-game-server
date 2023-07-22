import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  private async getGender(userName: string): Promise<string> {
    try {
      const response = await axios.get(
        `https://api.genderize.io?name=${userName}`,
      );
      const data = response.data;
      return data.probability > 0.95 ? data.gender : 'undetermined';
    } catch (error) {
      console.error('Error retrieving gender data:', error);
      // throw new Error('Error retrieving gender');
      return 'undetermined';
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const gender = await this.getGender(createUserDto.userName);
    const createdUser = await this.userModel.create({
      gender: gender,
      ...createUserDto,
    });
    return createdUser;
  }
}
