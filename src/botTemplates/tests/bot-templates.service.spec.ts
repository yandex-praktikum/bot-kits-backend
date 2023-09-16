import { Test, TestingModule } from '@nestjs/testing';
import { BotTemplatesService } from '../bot-templates.service';
import { getModelToken } from '@nestjs/mongoose';
import {
  oneBotTemplateDocument,
  oneBotTemplateDocumentFactory,
  result,
  resultArrayWithLength3,
  threeBotTemplateDocuments,
} from './documents.db';

describe('BotTemplates Service', () => {
  const repo = {
    find: jest.fn(() => threeBotTemplateDocuments),
    findById: jest.fn(() => oneBotTemplateDocument),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(() => oneBotTemplateDocument),
  };
  let botTemplatesService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        BotTemplatesService,
        {
          provide: getModelToken('BotTemplate'),
          useValue: repo,
        },
      ],
    }).compile();

    botTemplatesService = app.get<BotTemplatesService>(BotTemplatesService);
  });

  describe('find all', () => {
    it('should return a non empty array', async () => {
      const received = await botTemplatesService.findAll();
      expect(received).toStrictEqual(resultArrayWithLength3);
      expect(repo.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('find by Id', () => {
    it('should return one object', async () => {
      expect(await botTemplatesService.findById(1)).toStrictEqual(result);
      expect(repo.findById).toHaveBeenCalledTimes(1);
      expect(repo.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should return a doc with new title', async () => {
      const newProps = { title: 'new' };
      const mockValue = oneBotTemplateDocumentFactory(10, newProps);
      repo.findByIdAndUpdate.mockReturnValue(mockValue);
      expect(await botTemplatesService.update(10, newProps)).toStrictEqual({
        ...result,
        ...newProps,
        _id: 10,
      });
      expect(repo.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(repo.findByIdAndUpdate).toHaveBeenCalledWith(10, newProps, {
        new: true,
      });
    });
  });

  describe('create', () => {
    it('should return one object', async () => {
      expect(await botTemplatesService.create(result)).toStrictEqual(result);
      expect(repo.create).toHaveBeenCalledTimes(1);
      expect(repo.create).toHaveBeenCalledWith(result);
    });
  });
});
