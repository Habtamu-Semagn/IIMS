import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ access_token: 'token' }),
    register: jest.fn().mockResolvedValue({ user_id: 'uuid' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should login user', async () => {
    const res = await controller.login({ email: 'a@b.com', password: '123' });
    expect(res).toEqual({ access_token: 'token' });
    expect(mockAuthService.login).toHaveBeenCalled();
  });

  it('should register user', async () => {
    const res = await controller.register({
      name: 'Test',
      email: 'a@b.com',
      password: '123',
      role: 'admin',
    });
    expect(res).toEqual({ user_id: 'uuid' });
    expect(mockAuthService.register).toHaveBeenCalled();
  });
});
