import { Test, TestingModule } from '@nestjs/testing';
import { PedidosService } from './pedidos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PedidosService', () => {
  let service: PedidosService;
  let prisma: PrismaService;

  // Mock simulando o banco de dados sem usar 'any' para não quebrar o Linter
  const mockPrismaService = {
    pedido: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: '123',
          numero: 'PED-1005',
          clienteNome: 'João da Silva',
          deletedAt: null,
        },
      ]),
      create: jest
        .fn()
        .mockImplementation(
          (params: { data: { numero: string; clienteNome: string } }) =>
            Promise.resolve({
              id: '124',
              numero: params.data.numero,
              dataPrevisaoEntrega: new Date(),
              clienteNome: params.data.clienteNome,
              clienteDocumento: '11122233344',
              enderecoEntrega: 'Endereço Teste',
              status: 'PENDENTE',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            }),
        ),
      findFirst: jest.fn().mockResolvedValue({
        id: '123',
        numero: 'PED-1005',
        clienteNome: 'João da Silva',
        dataPrevisaoEntrega: new Date(),
        clienteDocumento: '11122233344',
        enderecoEntrega: 'Endereço Teste',
        status: 'PENDENTE',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidosService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PedidosService>(PedidosService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('deve listar os pedidos corretamente', async () => {
    const result = await service.findAll({});
    const spy = jest.spyOn(prisma.pedido, 'findMany');
    expect(spy).toHaveBeenCalled();
    expect(result).toEqual([
      {
        id: '123',
        numero: 'PED-1005',
        clienteNome: 'João da Silva',
        deletedAt: null,
      },
    ]);
  });

  it('deve criar um novo pedido', async () => {
    const novoPedidoDto = {
      numero: 'PED-1006',
      dataPrevisaoEntrega: '2026-06-20T00:00:00Z',
      clienteNome: 'Maria Souza',
      clienteDocumento: '98765432100',
      enderecoEntrega: 'Rua Nova, 456',
      items: [],
    };

    const result = await service.create(novoPedidoDto);
    const spy = jest.spyOn(prisma.pedido, 'create');

    expect(spy).toHaveBeenCalled();
    expect(result.numero).toEqual('PED-1006');
    expect(result.clienteNome).toEqual('Maria Souza');
  });

  it('deve buscar um pedido pelo ID', async () => {
    const result = await service.findOne('123');
    const spy = jest.spyOn(prisma.pedido, 'findFirst');

    expect(spy).toHaveBeenCalled();
    expect(result.id).toEqual('123');
  });
});
