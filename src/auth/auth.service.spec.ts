import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>

  beforeEach(async () => {

    const usersServiceMock = {
      findUserByUsername: jest.fn(),
      createUser: jest.fn(),
      findOneById: jest.fn(),
      updateRefreshToken: jest.fn()

    }
    const jwtServiceMock = {
      sign: jest.fn()
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {provide: UsersService, useValue: usersServiceMock},
        {provide: JwtService, useValue: jwtServiceMock}
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService)
    jwtService = module.get<JwtService>(JwtService)


  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
