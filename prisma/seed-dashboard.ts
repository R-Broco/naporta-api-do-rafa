import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const clientes = [
  'João Silva', 'Maria Souza', 'Carlos Almeida',
  'Ana Costa', 'Pedro Santos', 'Lucas Oliveira'
];

const enderecos = [
  'Rua das Flores, 123, Rio de Janeiro - RJ',
  'Avenida Paulista, 1000, São Paulo - SP',
  'Rua do Ouvidor, 50, Centro, Rio de Janeiro - RJ',
  'Avenida Afonso Pena, 500, Belo Horizonte - MG',
  'Avenida das Américas, 2000, Rio de Janeiro - RJ'
];

const statuses = ['PENDENTE', 'EM ROTA', 'ENTREGUE', 'CANCELADO'];

const catalogo = [
  { descricao: 'Roteador Wi-Fi 6', preco: 350.90 },
  { descricao: 'Monitor 24 polegadas', preco: 850.50 },
  { descricao: 'Cadeira de Escritório', preco: 600.00 },
  { descricao: 'Teclado Mecânico', preco: 250.00 },
  { descricao: 'Mouse Sem Fio', preco: 120.00 },
  { descricao: 'Cabo de Rede 10m', preco: 45.00 },
  { descricao: 'Headset Gamer', preco: 300.00 },
  { descricao: 'Webcam Full HD', preco: 199.99 }
];

function getRandomItem(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  await prisma.item.deleteMany();
  await prisma.pedido.deleteMany();

  console.log('Plantando sementes massivas para o Looker Studio...');

  for (let i = 1; i <= 150; i++) {
    const numItems = getRandomInt(1, 4);
    
    // O erro TS2345 (never[]) é resolvido declarando a tipagem explícita aqui:
    const items: { descricao: string; preco: number }[] = [];
    
    for (let j = 0; j < numItems; j++) {
      items.push(getRandomItem(catalogo));
    }

    const diasAtras = getRandomInt(0, 90);
    const dataPrevisao = new Date();
    dataPrevisao.setDate(dataPrevisao.getDate() - diasAtras);

    await prisma.pedido.create({
      data: {
        numero: `PED-200${i}`,
        dataPrevisaoEntrega: dataPrevisao,
        clienteNome: getRandomItem(clientes),
        clienteDocumento: `${getRandomInt(100, 999)}${getRandomInt(100, 999)}${getRandomInt(100, 999)}${getRandomInt(10, 99)}`,
        enderecoEntrega: getRandomItem(enderecos),
        status: getRandomItem(statuses),
        items: {
          create: items,
        },
      },
    });
  }

  console.log('Seed massivo concluído com sucesso. 150 pedidos inseridos.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });