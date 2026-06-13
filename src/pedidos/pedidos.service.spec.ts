import { Test, TestingModule } from '@nestjs/testing';
import { PedidosService } from './pedidos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PedidosService', () => {
  let service: PedidosService;
  let prisma: PrismaService;

  // Mock simulando o comportamento do banco de dados
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
    // Chama o método passando um filtro vazio
    const result = await service.findAll({});

    // Verifica se o Prisma foi chamado
    expect(prisma.pedido.findMany).toHaveBeenCalled();

    // Verifica se o resultado é o que a gente simulou no mock
    expect(result).toEqual([
      {
        id: '123',
        numero: 'PED-1005',
        clienteNome: 'João da Silva',
        deletedAt: null,
      },
    ]);
  });
});
