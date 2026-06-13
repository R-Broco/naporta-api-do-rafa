import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  descricao!: string;

  @IsNumber()
  @IsNotEmpty()
  preco!: number;
}

export class CreatePedidoDto {
  @IsString()
  @IsNotEmpty()
  numero!: string;

  @IsDateString()
  @IsNotEmpty()
  dataPrevisaoEntrega!: string;

  @IsString()
  @IsNotEmpty()
  clienteNome!: string;

  @IsString()
  @IsNotEmpty()
  clienteDocumento!: string;

  @IsString()
  @IsNotEmpty()
  enderecoEntrega!: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  items!: CreateItemDto[];
}
