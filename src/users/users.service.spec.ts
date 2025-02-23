import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
//import { UseInterceptors } from '@nestjs/common';


describe('UsersService', () => {

  let usersService: UsersService;

  let usersRepo: Repository<User>;

  beforeEach(async () => {
    

    const usersRepoMock = {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      save: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      
      providers: [UsersService,{
        provide: getRepositoryToken(User),
        useValue: usersRepoMock
      }],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
    usersRepo = module.get<Repository<User>>(getRepositoryToken(User))
  });

  describe("CreateUser", ()=>{
    it("Should create a user", async()=>{

      const user = {username: "test", password: "test"};

      


      (usersRepo.create as jest.Mock).mockResolvedValue(user);
      (usersRepo.save as jest.Mock).mockResolvedValue(user);

      const result = await usersService.CreateUser("test", "test");

      expect(result).toHaveProperty("username", "test")
    
    })
  })
});
