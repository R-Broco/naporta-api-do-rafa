import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // Adicionado
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy'; // Adicionado

@Module({
  imports: [
    PassportModule, // Adicionado
    JwtModule.register({
      secret: 'CHAVE_SECRETA_NAPORTA_123',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // JwtStrategy adicionado aqui
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
