import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { DataSource, Repository } from 'typeorm';
import { IdempotencyRecord } from '../idempotency/idempotency.entity';
import { Wallet } from './wallet.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {  Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

describe('WalletService', () => {
 

    let walletService: WalletService;
    let datasource: DataSource;
    let idempotencyRecord: Repository<IdempotencyRecord>;
    let walletRepository: Repository<Wallet>;
    let cacheManager:  Cache;



  beforeEach(async () => {

    const walletRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),

    }

    const IdempotencyRepoMock= {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn()

    }

    const dataSourceMock = {
      transaction: jest.fn()
    }

    const cacheMangerMock = {
      del: jest.fn(),
      get: jest.fn(),
      set: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletService,
      
        {provide: getRepositoryToken(Wallet), useValue:walletRepoMock },
        {provide: getRepositoryToken(IdempotencyRecord), useValue: IdempotencyRepoMock},
        {provide: DataSource, useValue: dataSourceMock},
        {provide: CACHE_MANAGER, useValue: cacheMangerMock}

      ],
    }).compile();

    walletService = module.get<WalletService>(WalletService)
    idempotencyRecord = module.get<Repository<IdempotencyRecord>>(getRepositoryToken(IdempotencyRecord))
    datasource = module.get<DataSource>(DataSource)
    cacheManager = module.get<Cache>(CACHE_MANAGER)
    walletRepository = module.get<Repository<Wallet>>  (getRepositoryToken( Wallet))


  });

  describe("Create Wallet", ()=>{
    it("Should create a wallet", async()=>{
      const wallet = {userId: "12345", currency: "USD", balance: 0};
      (walletRepository.create as jest.Mock).mockResolvedValue(wallet);
      (walletRepository.save as jest.Mock).mockResolvedValue(wallet);

      const result = await walletService.createWallet(12345, "NGN");
      
      expect(result).toHaveProperty("userId", "12345")
    })
  }) 

  
});
