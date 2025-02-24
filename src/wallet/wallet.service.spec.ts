import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { DataSource, Repository } from 'typeorm';
import { IdempotencyRecord } from '../idempotency/idempotency.entity';
import { Wallet } from './wallet.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {  Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { execOnce } from 'next/dist/shared/lib/utils';

describe('WalletService', () => {
 

    let walletService: WalletService;
    let datasource: DataSource;
    let idempotencyRecord: Repository<IdempotencyRecord>;
    let walletRepository: Repository<Wallet>;
    let cacheManager:  Cache;

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



  beforeEach(async () => {

  

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
      const wallet = {userId: 12345, currency: "USD", balance: 0};
      walletRepoMock.create.mockResolvedValue(wallet);
      walletRepoMock.save.mockResolvedValue(wallet);
      cacheMangerMock.del.mockResolvedValue(true);


      const result = await walletService.createWallet(12345, "USD");
      
      expect(walletRepoMock.create).toHaveBeenCalledWith(wallet);
      expect(result).toHaveProperty("userId", 12345)
    })
  }) 

  describe("getWalletsByUser", ()=>{
    it("should return list of wallets in cache", async()=>{
      const userId = 1234;

      const userwallet = [{id: "wallet1", userId, currecny: "USD", balance: 0}]
      cacheMangerMock.get.mockResolvedValue(userwallet)
      const result = await walletService.getWalletsByUser(userId);
      expect(cacheMangerMock.get).toHaveBeenCalledWith(`wallets:${userId}`)
      expect(result).toEqual(userwallet)



    })
    it("should fetch from databse if not available in cache", async()=>{
      const userId = 123
      const userwallets = [{id: "wallet1", userId, currency: "NGN", balance: 50000}];

      cacheMangerMock.get.mockResolvedValue(undefined);
      walletRepoMock.find.mockResolvedValue(userwallets)
      cacheMangerMock.set(true)

      const result = await walletService.getWalletsByUser(userId);

      expect(walletRepoMock.find).toHaveBeenCalledWith({"where": {"userId": userId}})
      expect(result).toEqual(userwallets)




    })
  })

  
});
