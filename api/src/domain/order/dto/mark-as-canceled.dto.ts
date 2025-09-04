import { IsString, IsNotEmpty } from 'class-validator';

export class MarkAsCanceledDto {
  @IsString()
  @IsNotEmpty({ message: 'Motivo do cancelamento é obrigatório' })
  notes: string;
}
