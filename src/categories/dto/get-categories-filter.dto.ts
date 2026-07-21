import { IsOptional, IsString, IsBoolean, IsIn, IsInt, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class GetCategoriesFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsIn(['newest', 'oldest', 'name_asc', 'name_desc'])
  sortBy?: 'newest' | 'oldest' | 'name_asc' | 'name_desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
