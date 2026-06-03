import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { CurrentUser } from '../auth/current-user.decorator'; 


@UseGuards(JwtAuthGuard)
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto, @CurrentUser() user: any) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.pedidosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.pedidosService.findOne(id); // Removido o "+" antes de id
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto, @CurrentUser() user: any) {
    return this.pedidosService.update(id, updatePedidoDto); // Removido o "+" antes de id
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.pedidosService.remove(id); // Removido o "+" antes de id
  }
}
