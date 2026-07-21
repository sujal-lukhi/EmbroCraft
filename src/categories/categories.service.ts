import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async createCategory(createCategoryDto: CreateCategoryDto, imageUrl?: string) {
    const slug = this.generateSlug(createCategoryDto.name);

    const existing = await this.prisma.category.findUnique({
      where: { name: createCategoryDto.name },
    });

    if (existing) {
      throw new ConflictException('Category with this name already exists');
    }

    // Handle formData string booleans
    const isActive = createCategoryDto.isActive === undefined ? true : 
                     (typeof createCategoryDto.isActive === 'string' ? createCategoryDto.isActive === 'true' : createCategoryDto.isActive);

    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        description: createCategoryDto.description,
        isActive: isActive,
        slug,
        ...(imageUrl && { imageUrl }),
      },
    });
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto, imageUrl?: string) {
    await this.getCategoryById(id); // Ensure it exists

    let slug = undefined;
    if (updateCategoryDto.name) {
      slug = this.generateSlug(updateCategoryDto.name);
      const existing = await this.prisma.category.findFirst({
        where: { name: updateCategoryDto.name, id: { not: id } },
      });
      if (existing) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    const isActive = updateCategoryDto.isActive === undefined ? undefined : 
                     (typeof updateCategoryDto.isActive === 'string' ? updateCategoryDto.isActive === 'true' : updateCategoryDto.isActive);

    return this.prisma.category.update({
      where: { id },
      data: {
        ...(updateCategoryDto.name && { name: updateCategoryDto.name }),
        ...(updateCategoryDto.description && { description: updateCategoryDto.description }),
        ...(isActive !== undefined && { isActive }),
        ...(slug && { slug }),
        ...(imageUrl && { imageUrl }),
      },
    });
  }

  async softDeleteCategory(id: number) {
    await this.getCategoryById(id);
    return this.prisma.category.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async getCategoryById(id: number) {
    const category = await this.prisma.category.findFirst({
      where: { id, isDeleted: false },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async getAllCategories(filterDto: GetCategoriesFilterDto) {
    const { search, isActive, sortBy, page = 1, limit = 10 } = filterDto;

    const where: Prisma.CategoryWhereInput = {
      isDeleted: false,
    };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const orderBy: Prisma.CategoryOrderByWithRelationInput = {};
    if (sortBy) {
      switch (sortBy) {
        case 'newest':
          orderBy.createdAt = 'desc';
          break;
        case 'oldest':
          orderBy.createdAt = 'asc';
          break;
        case 'name_asc':
          orderBy.name = 'asc';
          break;
        case 'name_desc':
          orderBy.name = 'desc';
          break;
      }
    } else {
      orderBy.createdAt = 'desc'; // Default sorting
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
