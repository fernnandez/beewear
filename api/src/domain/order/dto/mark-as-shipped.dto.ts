import { IsString, IsNotEmpty } from 'class-validator';

export class MarkAsShippedDto {
  @IsString()
  @IsNotEmpty({ message: 'Observações sobre o envio são obrigatórias' })
  notes: string;
}
