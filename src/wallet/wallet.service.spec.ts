import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { DataSource, Repository } from 'typeorm';
import { IdempotencyRecord } from 'src/idempotency/idempotency.entity';
import { Wallet } from './wallet.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('WalletService', () => {
 

  let walletService: WalletService;
    let datasource: DataSource
    let idempotencyRecord: Repository<IdempotencyRecord>
    let walletRepository: Repository<Wallet>
    let cacheManager:  Cache



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
        //{provide: getRepositoryToken Datasource, useValue: dataSourceMock},
        {provide: getRepositoryToken(Wallet), useValue:walletRepoMock },
        {provide: getRepositoryToken(IdempotencyRecord), useValue: IdempotencyRepoMock},
        {provide: DataSource, useValue: dataSourceMock},
        {provide: Cache, useValue: cacheMangerMock}

      ],
    }).compile();
    walletService = module.get<WalletService>(WalletService)
    idempotencyRecord = module.get<Repository<IdempotencyRecord>>(IdempotencyRecord)
    datasource = module.get<DataSource>(DataSource)
    cacheManager = module.get<Cache>(Cache)


  });

  
});
