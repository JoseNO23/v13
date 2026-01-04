import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaxonomyService {
  constructor(private readonly prisma: PrismaService) {}

  async getTaxonomy() {
    const [genres, groups] = await Promise.all([
      this.prisma.genre.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
      this.prisma.categoryGroup.findMany({
        select: {
          id: true,
          name: true,
          order: true,
          categories: {
            select: { id: true, name: true },
            orderBy: { name: 'asc' },
          },
        },
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
      }),
    ]);

    return { genres, groups };
  }
}
