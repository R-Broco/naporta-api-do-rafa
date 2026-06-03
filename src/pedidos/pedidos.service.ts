import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: string) {
    const pedido = await this.prisma.pedido.findFirst({
      where: { 
        id, 
        deletedAt: null 
      },
      include: { 
        items: true 
      },
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
    }

    return pedido;
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    await this.findOne(id);

    // Isola 'items' para que o rest contendo apenas dados do Pedido vá para o banco
    const { items, ...dadosDoPedido } = updatePedidoDto;

    return this.prisma.pedido.update({
      where: { id },
      data: {
        ...dadosDoPedido,
        dataPrevisaoEntrega: dadosDoPedido.dataPrevisaoEntrega 
          ? new Date(dadosDoPedido.dataPrevisaoEntrega) 
          : undefined,
      },
      include: { items: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.pedido.update({
      where: { id },
      data: { 
        deletedAt: new Date() 
      },
    });
  }
}
