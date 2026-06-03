import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.item.deleteMany();
  await prisma.pedido.deleteMany();

  console.log('Plantando sementes...');

  await prisma.pedido.create({
    data: {
      numero: 'PED-1001',
      dataPrevisaoEntrega: new Date('2026-06-10T12:00:00Z'),
      clienteNome: 'João Silva',
      clienteDocumento: '11122233344',
      enderecoEntrega: 'Rua das Flores, 123, Rio de Janeiro - RJ',
      items: {
        create: [
          { descricao: 'Roteador Wi-Fi 6', preco: 350.90 },
          { descricao: 'Cabo de Rede 10m', preco: 45.00 },
        ],
      },
    },
  });

  await prisma.pedido.create({
    data: {
      numero: 'PED-1002',
      dataPrevisaoEntrega: new Date('2026-06-12T15:00:00Z'),
      clienteNome: 'Maria Souza',
      clienteDocumento: '55566677788',
      enderecoEntrega: 'Avenida Paulista, 1000, São Paulo - SP',
      items: {
        create: [
          { descricao: 'Monitor 24 polegadas', preco: 850.50 },
        ],
      },
    },
  });

  await prisma.pedido.create({
    data: {
      numero: 'PED-1003',
      dataPrevisaoEntrega: new Date('2026-06-15T09:00:00Z'),
      clienteNome: 'Carlos Almeida',
      clienteDocumento: '99988877766',
      enderecoEntrega: 'Rua do Ouvidor, 50, Centro, Rio de Janeiro - RJ',
      items: {
        create: [
          { descricao: 'Cadeira de Escritório', preco: 600.00 },
          { descricao: 'Apoio de Pé', preco: 45.99 },
        ],
      },
    },
  });

  console.log('Seed concluído com sucesso. 3 pedidos inseridos.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });