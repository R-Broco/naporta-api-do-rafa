import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  async create(createPedidoDto: CreatePedidoDto) {
    return this.prisma.pedido.create({
      data: {
        numero: createPedidoDto.numero,
        dataPrevisaoEntrega: new Date(createPedidoDto.dataPrevisaoEntrega),
        clienteNome: createPedidoDto.clienteNome,
        clienteDocumento: createPedidoDto.clienteDocumento,
        enderecoEntrega: createPedidoDto.enderecoEntrega,
        status: createPedidoDto.status || 'PENDENTE',
        items: {
          create: createPedidoDto.items,
        },
      },
      include: { items: true },
    });
  }

  async findAll(filters: { numero?: string; status?: string; dataInicial?: string; dataFinal?: string }) {
    const where: any = { deletedAt: null };

    if (filters.numero) {
      where.numero = { contains: filters.numero, mode: 'insensitive' };
    }

    if (filters.status) {
      where.status = { equals: filters.status, mode: 'insensitive' };
    }

    if (filters.dataInicial || filters.dataFinal) {
      where.createdAt = {};
      if (filters.dataInicial) where.createdAt.gte = new Date(filters.dataInicial);
      if (filters.dataFinal) where.createdAt.lte = new Date(filters.dataFinal);
    }

    return this.prisma.pedido.findMany({
      where,
      include: { items: true },
    });
  }

  findOne(id: string) {
    return this.prisma.pedido.findFirst({
      where: { id, deletedAt: null },
      include: { items: true },
    });
  }

  update(id: string, updatePedidoDto: UpdatePedidoDto) {
    return `This action updates a #${id} pedido`;
  }

  remove(id: string) {
    return `This action removes a #${id} pedido`;
  }
}
