import { IsString } from 'class-validator';

export class ConfirmOrderDto {
  @IsString()
  sessionId: string;
}
