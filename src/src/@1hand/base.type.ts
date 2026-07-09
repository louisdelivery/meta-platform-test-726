import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class PhoneNumberDto {
  @ApiProperty({ example: '+237' })
  @IsString()
  @Matches(/^\+\d{1,4}$/, {
    message: 'Le dialCode doit etre au format +NNN (ex: +237).',
  })
  dialCode: string;

  @ApiProperty({ example: 'CM' })
  @IsString()
  @Length(2, 2, {
    message: 'Le code pays iso2 doit contenir exactement 2 lettres.',
  })
  iso2: string;

  @ApiProperty({ example: '690123456' })
  @IsString()
  @Matches(/^\d{4,14}$/, {
    message: 'Le numero national doit contenir entre 4 et 14 chiffres.',
  })
  nationalNumber: string;

  @ApiProperty({ example: '+237690123456' })
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Le numero international doit etre au format E.164 (ex: +237690123456).',
  })
  internationalNumber: string;
}

export class PaginationDto<T> {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 42 })
  total: number;

  data: T[];
}

export class BaseFilterDto {
  @ApiProperty({ required: false, example: 'chaussures' })
  search?: string;

  @ApiProperty({ required: false, example: 1 })
  page?: number;

  @ApiProperty({ required: false, example: 10 })
  limit?: number;
}
