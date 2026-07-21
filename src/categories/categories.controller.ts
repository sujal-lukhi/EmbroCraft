import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../common/config/multer.config';
import { UploadService } from '../uploads/upload.service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly uploadService: UploadService
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('--- DEBUG: POST /categories ---');
    console.log('DTO:', createCategoryDto);
    console.log('File:', file);
    console.log('-------------------------------');
    let imageUrl = undefined;
    if (file) {
      imageUrl = await this.uploadService.uploadImage(file, 'categories');
    }
    const data = await this.categoriesService.createCategory(createCategoryDto, imageUrl);
    return {
      message: 'Category created successfully',
      data,
    };
  }

  @Get()
  findAll(@Query() filterDto: GetCategoriesFilterDto) {
    return this.categoriesService.getAllCategories(filterDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getCategoryById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imageUrl = undefined;
    if (file) {
      imageUrl = await this.uploadService.uploadImage(file, 'categories');
    }
    const data = await this.categoriesService.updateCategory(id, updateCategoryDto, imageUrl);
    return {
      message: 'Category updated successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.categoriesService.softDeleteCategory(id);
    return {
      message: 'Category deleted successfully',
    };
  }
}
