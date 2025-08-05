import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/infra/auth/decorator/public.decorator';
import { CollectionService } from './collection.service';
import { CollectionListResponseDto } from './dto/collection-list-response.dto';

@Controller('public/collection')
@ApiTags('Public Collection')
@Public()
export class PublicCollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get()
  @ApiOperation({ summary: 'Listar coleções ativas para o frontend' })
  @ApiResponse({
    status: 200,
    description: 'Lista de coleções otimizada para frontend',
    type: [CollectionListResponseDto],
  })
  async findAll(): Promise<CollectionListResponseDto[]> {
    return this.collectionService.findAllActiveForFrontend();
  }
}
