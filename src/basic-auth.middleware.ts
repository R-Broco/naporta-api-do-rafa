import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const USERNAME = 'bangulog';
    const PASSWORD = 'operacaoSRE2026';
    
    const encodedCredentials = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');
    const expectedAuthHeader = `Basic ${encodedCredentials}`;
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader !== expectedAuthHeader) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Prometheus Metrics"');
      return res.status(401).send('Unauthorized');
    }

    next();
  }
}
