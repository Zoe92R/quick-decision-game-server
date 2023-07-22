import { IsInt, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly userName: string;

  @IsInt()
  readonly score: number;
}
