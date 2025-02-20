import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"
import { User, UserRole } from '../users/user.entity';


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

    const AuthServiceMock = {
      validateUser: jest.fn()
    }
    const jwtServiceMock = {
      sign: jest.fn()
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {provide: UsersService, useValue: usersServiceMock},
        {provide: JwtService, useValue: jwtServiceMock},
        
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService)
    jwtService = module.get<JwtService>(JwtService)


  });

  describe("login", ()=>{
    it('should return access and refreshTokens on Login', async()=>{

      const plainPassword = "fascinator"
      const hashedPassword = await bcrypt.hash(plainPassword, 10)

      const user = {id: '123', username: "effemm", password: hashedPassword };
      const users = {id: '123', username: 'effemm', password: hashedPassword, refreshToken: 'fake' , roles: UserRole.ADMIN};
      (usersService.findUserByUsername as jest.Mock).mockResolvedValue(user);
      (jwtService.sign as jest.Mock).mockReturnValue('fake');
       jest.spyOn(authService, 'validateUser').mockResolvedValue(users);
       const result = await authService.login({username: "test", password: plainPassword})
       expect(result).toHaveProperty("accessToken", "fake")
    })
  })
});
