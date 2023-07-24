import { IsInt } from 'class-validator';

export class UpdateUserDto {
  @IsInt()
  readonly score: number;
}
