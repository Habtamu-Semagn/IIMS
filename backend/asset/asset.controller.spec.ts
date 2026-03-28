import { Test, TestingModule } from '@nestjs/testing';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';

describe('AssetController', () => {
  let controller: AssetController;

  const mockService = {
    create: jest.fn().mockResolvedValue({ asset_id: 'uuid', name: 'Laptop' }),
    findAll: jest
      .fn()
      .mockResolvedValue([{ asset_id: 'uuid', name: 'Laptop' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetController],
      providers: [{ provide: AssetService, useValue: mockService }],
    }).compile();

    controller = module.get<AssetController>(AssetController);
  });

  it('should create an asset', async () => {
    const res = await controller.create({
      name: 'Laptop',
      type: 'Hardware',
      status: 'New',
      school_id: 'school-uuid',
    });
    expect(res).toEqual({ asset_id: 'uuid', name: 'Laptop' });
    expect(mockService.create).toHaveBeenCalled();
  });

  it('should list assets', async () => {
    const res = await controller.findAll();
    expect(res).toEqual([{ asset_id: 'uuid', name: 'Laptop' }]);
  });
});
