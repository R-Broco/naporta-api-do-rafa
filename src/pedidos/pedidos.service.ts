import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

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

  async findAll(filters: {
    numero?: string;
    status?: string;
    dataInicial?: string;
    dataFinal?: string;
    excluidos?: string;
  }) {
    const where: Prisma.PedidoWhereInput = {};

    if (filters.excluidos === 'true') {
      where.deletedAt = { not: null };
    } else if (filters.excluidos !== 'all') {
      where.deletedAt = null;
    }

    if (filters.numero) {
      where.numero = { contains: filters.numero, mode: 'insensitive' };
    }

    if (filters.status) {
      where.status = { equals: filters.status, mode: 'insensitive' };
    }

    if (filters.dataInicial || filters.dataFinal) {
      const createdAtFilter: Prisma.DateTimeFilter = {};

      if (filters.dataInicial) {
        createdAtFilter.gte = new Date(filters.dataInicial);
      }
      if (filters.dataFinal) {
        createdAtFilter.lte = new Date(filters.dataFinal);
      }

      where.createdAt = createdAtFilter;
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
        deletedAt: null,
      },
      include: {
        items: true,
      },
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
    }

    return pedido;
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    await this.findOne(id);

    // Removemos os items remontando o objeto campo a campo de forma explícita e tipada
    const dadosDoPedido: Prisma.PedidoUpdateInput = {
      numero: updatePedidoDto.numero,
      clienteNome: updatePedidoDto.clienteNome,
      clienteDocumento: updatePedidoDto.clienteDocumento,
      enderecoEntrega: updatePedidoDto.enderecoEntrega,
      status: updatePedidoDto.status,
      dataPrevisaoEntrega: updatePedidoDto.dataPrevisaoEntrega
        ? new Date(updatePedidoDto.dataPrevisaoEntrega)
        : undefined,
    };

    return this.prisma.pedido.update({
      where: { id },
      data: dadosDoPedido,
      include: { items: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.pedido.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
