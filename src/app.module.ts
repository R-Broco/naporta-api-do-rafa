import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { MetricsInterceptor, MetricsExceptionFilter } from './metrics.interceptor';
import { BasicAuthMiddleware } from './basic-auth.middleware';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
    }),
    AuthModule, 
    PrismaModule, 
    PedidosModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: MetricsExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BasicAuthMiddleware)
      .forRoutes({ path: 'metrics', method: RequestMethod.GET });
  }
}
