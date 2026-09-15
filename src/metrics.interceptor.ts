import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Counter, Histogram } from 'prom-client';

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total de requisicoes HTTP recebidas por rota e status code',
  labelNames: ['method', 'route', 'status_code'],
});

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duracao do processamento das requisicoes HTTP em segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const { method, url } = req;

    if (url === '/metrics' || url.includes('/favicon.ico')) {
      return next.handle();
    }

    const endTimer = httpRequestDuration.startTimer();

    return next.handle().pipe(
      tap(() => {
        const statusCode = res.statusCode || 200;
        const routePath = req.route?.path || url;
        const labels = { method, route: routePath, status_code: statusCode.toString() };
        httpRequestsTotal.labels(labels.method, labels.route, labels.status_code).inc();
        endTimer(labels);
      }),
      catchError((err) => {
        const statusCode = err instanceof HttpException ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const routePath = req.route?.path || url;
        const labels = { method, route: routePath, status_code: statusCode.toString() };
        httpRequestsTotal.labels(labels.method, labels.route, labels.status_code).inc();
        endTimer(labels);
        return throwError(() => err);
      })
    );
  }
}

@Injectable()
export class MetricsExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const { method, url } = request;

    if (url === '/metrics' || url.includes('/favicon.ico')) {
      return;
    }

    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const routePath = request.route?.path || url;
    const labels = { method, route: routePath, status_code: statusCode.toString() };

    httpRequestsTotal.labels(labels.method, labels.route, labels.status_code).inc();

    if (exception instanceof HttpException) {
      response.status(statusCode).json(exception.getResponse());
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    }
  }
}
