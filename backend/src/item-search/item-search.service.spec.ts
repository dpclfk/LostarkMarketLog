import { Test, TestingModule } from '@nestjs/testing';
import { ItemSearchService } from './item-search.service';

describe('ItemSearchService', () => {
  let service: ItemSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemSearchService],
    }).compile();

    service = module.get<ItemSearchService>(ItemSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
