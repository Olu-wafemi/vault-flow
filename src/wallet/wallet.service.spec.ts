import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { DataSource, Entity, Repository } from 'typeorm';
import { IdempotencyRecord } from '../idempotency/idempotency.entity';
import { Wallet } from './wallet.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {  Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { execOnce } from 'next/dist/shared/lib/utils';
import { BadGatewayException, BadRequestException, NotFoundException } from '@nestjs/common';

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

      expect(walletRepoMock.find).toHaveBeenCalledWith({where: { userId}})
      expect(cacheMangerMock.get).toHaveBeenCalledWith(`wallets:${userId}`)
      expect(result).toEqual(userwallets)

    })
  })

  describe("deposit", ()=>{

    it("should return error if the amount is less than or equal to zero", async()=>{
      const amount = 0
      const walletid = "1234"
      const idempotencykey = "123456"
      
      await expect(walletService.deposit(walletid,amount, idempotencykey)).rejects.toThrow(new BadGatewayException("Amount must be greater than zero"))
    })

    it("should check idempotency record to see if transaction exists", async()=>{
      const walletid = "Wallet1"
      const amount = 400
      const idempotencyKey = "testkey"
      const transactionType= "deposit"
      const record = {id: "Record1", idempotencyKey ,walletid, transactionType, transactionId: "testtx", amount };
      const userwallet = {id: "wallet1", balance: 5000, currency: "NGN", userId: 1234};
      IdempotencyRepoMock.findOne.mockResolvedValue(record);
      walletRepoMock.findOne.mockResolvedValue(userwallet)

      const result = await walletService.deposit(walletid, amount, idempotencyKey)

      expect(IdempotencyRepoMock.findOne).toHaveBeenCalledWith({where: {key: idempotencyKey, walletId: walletid, transactionType}})
      expect(walletRepoMock.findOne).toHaveBeenCalledWith({where: {id: walletid}})

      expect(result).toEqual(userwallet)

    })

    it("should throw NotFoundException if wallet is not found", async()=>{

      IdempotencyRepoMock.findOne.mockResolvedValue(undefined);
      dataSourceMock.transaction.mockImplementation(async(callback)=>{
        return await callback({
          findOne: jest.fn().mockResolvedValue(null),
          save: jest.fn(),
          create: jest.fn()
        })
      })
      expect(walletService.deposit( "Wallets1", 500, "2345")).rejects.toThrow(new NotFoundException("Wallet Not Found"))
    })

    it("should deposit amount and record idempotency record", async()=>{
      const wallet = {id: "wallet1", balance: 5000, currency: "NGN", userId: 1234};
      const updatedwallet = {...wallet, balance: 6000}
      IdempotencyRepoMock.findOne.mockResolvedValue(undefined);
      dataSourceMock.transaction.mockImplementation(async(callback)=>{

        const fakeManager = {
          findOne: jest.fn().mockResolvedValue(wallet),
          save: jest.fn().mockImplementation((entity)=> entity),
          create: jest.fn((Entity, data)=> data)
        }
        return await callback(fakeManager)   
      })

      walletRepoMock.findOne.mockResolvedValue(updatedwallet)
      cacheMangerMock.del.mockResolvedValue(true)

      const result = await walletService.deposit("wallet1", 1000,"testkey")

      expect(result).toEqual(updatedwallet);
      expect(cacheMangerMock.del).toHaveBeenCalledWith(`wallets:${updatedwallet.userId}`)
    })
  })

  describe("Withdrawal", ()=>{

    it("should throw error on Invalid withdrawal amouunt" ,async()=>{
      await  expect( walletService.withdraw("wallet1", -2300, "testkey")).rejects.toThrow(new BadRequestException("Amount must be greater than zero"))
    })

    it("should return present state of wallet if idempotencykey is found", async()=>{
      const walletid = "Wallet1"
      const amount = 400
      const idempotencyKey = "testkey"
      const transactionType= "withdraw"
      const record = {id: "Record1", idempotencyKey ,walletid, transactionType, transactionId: "testtx", amount };
      const userwallet = {id: "wallet1", balance: 5000, currency: "NGN", userId: 1234};
     
      IdempotencyRepoMock.findOne.mockResolvedValue(record)
      walletRepoMock.findOne.mockResolvedValue(userwallet)

      const result = await walletService.withdraw(walletid, amount, idempotencyKey);
      expect(IdempotencyRepoMock.findOne).toHaveBeenCalledWith({where: {key: idempotencyKey, walletId: walletid, transactionType,}})
      expect(walletRepoMock.findOne).toHaveBeenCalledWith({where: {id: walletid}})
    })
    it("should create a withdrawal and update idempotency record", async()=>{
      const wallet =  {id: "wallet1", balance: 5000, currency: "NGN", userId: 1234};
      const updatedwallet = {...wallet, balance: 4000}

      IdempotencyRepoMock.findOne.mockResolvedValue(undefined)


      dataSourceMock.transaction.mockImplementation(async(callback)=>{

        const fakeManager = {
          findOne: jest.fn().mockResolvedValue(wallet),
          create: jest.fn((Entity, data)=> (data)),
          save: jest.fn().mockImplementation((entity)=> (entity))
        }
        return callback(fakeManager)
        
      })

      walletRepoMock.findOne.mockResolvedValue(updatedwallet)
      cacheMangerMock.del.mockResolvedValue(true)

      const result = await walletService.withdraw("wallet1", 1000, "testkey")

      expect(walletRepoMock.findOne).toHaveBeenCalledWith({where: {id: "wallet1"}})
      expect(cacheMangerMock.del).toHaveBeenCalledWith(`wallets:${updatedwallet.userId}`)
      expect(result).toEqual(updatedwallet)

      

      




    })

  })

  
});
