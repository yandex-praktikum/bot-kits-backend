import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from '../../src/profiles/profiles.controller';
import { ProfilesService } from '../../src/profiles/profiles.service';
import { Profile } from '../../src/profiles/schema/profile.schema';
import { CreateProfileDto } from '../../src/profiles/dto/create-profile.dto';
import { UpdateProfileDto } from '../../src/profiles/dto/update-profile.dto';

interface MockProfile extends Partial<Profile> {
  _id: string;
  username: string;
  phone: string;
  avatar: string;
  balance: number;
  accounts: [];
  partner_ref: string;
  visited_ref: number;
  registration_ref: number;
  sharedAccess: null;
}

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let service: ProfilesService;

  const mockProfile: MockProfile = {
    _id: 'someId',
    username: 'John Doe',
    phone: '+79501364578',
    avatar: 'https://i.pravatar.cc/300',
    balance: 1000,
    accounts: [],
    partner_ref: '0000000',
    visited_ref: 0,
    registration_ref: 0,
    sharedAccess: null,
  };

  const mockProfilesService = {
    findAll: jest.fn(() => Promise.resolve([mockProfile])),
    findByToken: jest.fn(() => Promise.resolve(mockProfile)),
    findOne: jest.fn(() => Promise.resolve(mockProfile)),
    findAccountsByProfileId: jest.fn(() => Promise.resolve([])),
    update: jest.fn(() => Promise.resolve(mockProfile)),
    remove: jest.fn(() => Promise.resolve(mockProfile)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [{ provide: ProfilesService, useValue: mockProfilesService }],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
    service = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of profiles', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockProfile]);
      expect(mockProfilesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findProfileByToken', () => {
    it('should return a profile for a given token', async () => {
      const token = 'someToken';
      const result = await controller.findProfileByToken(`Bearer ${token}`);
      expect(result).toEqual(mockProfile);
      expect(mockProfilesService.findByToken).toHaveBeenCalledWith(token);
    });
  });

  describe('findOne', () => {
    it('should return a profile for a given id', async () => {
      const id = 'someId';
      const result = await controller.findOne(id);
      expect(result).toEqual(mockProfile);
      expect(mockProfilesService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('findAccountByProfileId', () => {
    it('should return accounts for a given profile id', async () => {
      const id = 'someProfileId';
      const result = await controller.findAccountByProfileId(id);
      expect(result).toEqual([]);
      expect(mockProfilesService.findAccountsByProfileId).toHaveBeenCalledWith(
        id,
      );
    });
  });

  describe('update', () => {
    it('should update and return a profile', async () => {
      const id = 'someId';
      const updateProfileDto: UpdateProfileDto = {
        username: 'Jane Doe',
        phone: '+79501364579',
        // other fields as necessary
      };
      const result = await controller.update(id, updateProfileDto);
      expect(result).toEqual(mockProfile);
      expect(mockProfilesService.update).toHaveBeenCalledWith(
        id,
        updateProfileDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove and return a profile', async () => {
      const id = 'someId';
      const result = await controller.remove(id);
      expect(result).toEqual(mockProfile);
      expect(mockProfilesService.remove).toHaveBeenCalledWith(id);
    });
  });
});
