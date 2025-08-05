import { ApiProperty } from '@nestjs/swagger';

export class CollectionListResponseDto {
  @ApiProperty({ description: 'PublicId da coleção' })
  publicId: string;

  @ApiProperty({ description: 'Nome da coleção' })
  name: string;

  @ApiProperty({ description: 'Status ativo da coleção' })
  active: boolean;

  @ApiProperty({ description: 'Descrição da coleção', required: false })
  description?: string;

  @ApiProperty({ description: 'URL da imagem da coleção', required: false })
  imageUrl?: string;
}
