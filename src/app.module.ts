import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PedidosModule } from './pedidos/pedidos.module';

@Module({
  imports: [AuthModule, PrismaModule, PedidosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
