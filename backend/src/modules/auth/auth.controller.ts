import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { LoginUseCase } from './application/login.usecase';
import { LoginDto } from './application/dto/login.dto';
import { LocalAuthGuard } from './infrastructure/guards/local-auth.guard';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from './infrastructure/decorators/current-user.decorator';
import { Public } from './infrastructure/decorators/public.decorator';
import { HttpResponse } from '../../common/http/http-response';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    const result = await this.loginUseCase.execute(loginData);
    return HttpResponse.ok(result, 'Login exitoso');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return HttpResponse.ok(user, 'Perfil de usuario obtenido exitosamente');
  }
}
