import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  login() {
    const payload = {
      sub: '123e4567-e89b-12d3-a456-426614174000',
      username: 'admin',
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
