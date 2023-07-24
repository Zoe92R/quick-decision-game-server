import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Gender } from 'src/types.ts/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  private async getGender(userName: string): Promise<Gender> {
    try {
      const response = await axios.get(
        `https://api.genderize.io?name=${userName}`,
      );
      const data = response.data;
      return data.probability > 0.95 ? data.gender : 'undetermined';
    } catch (error) {
      console.error('Error retrieving gender data:', error);
      return Gender.UNDETERMINED;
    }
  }

  private async getAdditionalData(gender: Gender): Promise<any> {
    try {
      const seed = gender === Gender.UNDETERMINED ? '' : `&gender=${gender}`;
      const response: any = await axios.get(
        `https://randomuser.me/api?inc=name,location${seed}`,
      );
      const results = response.data.results[0];
      return {
        title: results.name.title,
        lastName: results.name.last,
        city: results.location.city,
        country: results.location.country,
      };
    } catch (error) {
      console.error('Error retrieving additional data:', error);
      return;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const gender = await this.getGender(createUserDto.userName);
    const additionalData = await this.getAdditionalData(gender);
    const createdUser = await this.userModel.create({
      gender: gender,
      ...additionalData,
      ...createUserDto,
    });
    return createdUser;
  }

  async findByUserId(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.findByUserId(id);
    const updatedUser = await this.userModel.updateOne(
      { _id: id },
      { ...updateUserDto, existingUser },
    );
    return updatedUser;
  }

  async findLeaders(): Promise<User[]> {
    return this.userModel.find().sort({ score: -1 }).exec();
  }
}
