import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  create(createPedidoDto: CreatePedidoDto) {
    return 'This action adds a new pedido';
  }

  findAll() {
    return `This action returns all pedidos`;
  }

  findOne(id: string) { // Mudado de number para string
    return `This action returns a #${id} pedido`;
  }

  update(id: string, updatePedidoDto: UpdatePedidoDto) { // Mudado de number para string
    return `This action updates a #${id} pedido`;
  }

  remove(id: string) { // Mudado de number para string
    return `This action removes a #${id} pedido`;
  }
}
