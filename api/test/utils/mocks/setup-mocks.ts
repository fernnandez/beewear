import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/infra/auth/guard/auth.guard';
import { RolesGuard } from 'src/infra/auth/guard/roles.guard';

/**
 * Configura mocks globais para testes de integração, desabilitando guards de autenticação
 * e injetando um usuário mockado no request.
 */
export function setupIntegrationMocks() {
  // Mockar JwtAuthGuard
  jest
    .spyOn(JwtAuthGuard.prototype, 'canActivate')
    .mockImplementation((context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest<Request>(); // Tipagem para o request

      // Injetar um usuário mockado no request
      request.user = {
        id: 1, // ID do user_admin das fixtures
        email: 'email@example.com', // Email do user_admin
        roles: ['admin', 'user'], // Garanta que as roles esperadas estejam aqui
        // Adicione outras propriedades de usuário que sua aplicação espera em req.user
      } as any; // Usar 'as any' para flexibilidade com a tipagem de req.user

      return true; // Sempre permite o acesso
    });

  // Mockar RolesGuard
  jest
    .spyOn(RolesGuard.prototype, 'canActivate')
    .mockImplementation((_context: ExecutionContext) => {
      // O RolesGuard geralmente confia que o JwtAuthGuard já colocou o req.user.
      // Neste mock, ele apenas permite a passagem.
      return true; // Sempre permite o acesso
    });
}
