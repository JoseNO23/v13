import { Controller, Get } from '@nestjs/common';
import { TaxonomyService } from './taxonomy.service';

@Controller('taxonomy')
export class TaxonomyController {
  constructor(private readonly taxonomyService: TaxonomyService) {}

  @Get()
  getTaxonomy() {
    return this.taxonomyService.getTaxonomy();
  }
}
