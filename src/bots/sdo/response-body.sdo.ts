/* eslint-disable prettier/prettier */
import { HttpStatus } from '@nestjs/common';
import {
  ApiPropertyFactory,
  IFieldDescription,
  createField,
  createNestedObject,
} from 'src/utils/apiPropertyFactory';

const bot: IFieldDescription = createNestedObject([
  createField('name', 'name-bot', 'string'),
  createField('pages', ['vk.com/club1245321223'], 'array'),
  createField(
    'accessKey',
    '1685494522:AAHzRs4YFqckLvBVARVoUL0c3B1GFqlDpo',
    'string',
  ),
  createField('url', 'some_url', 'string'),
]);

const settings: IFieldDescription = createNestedObject([
  createField('prop1', 'prop1', 'string'),
  createField('prop2', 'prop2', 'string'),
]);

const permission: IFieldDescription = createNestedObject([
  createField('dashboard', true, 'boolean'),
  createField('botBuilder', true, 'boolean'),
  createField('mailing', true, 'boolean'),
  createField('statistics', true, 'boolean'),
]);

const createBot: IFieldDescription[] = [
  createField('type', 'custom', 'string'),
  createField('title', 'Бот', 'string'),
  createField('description', 'Какой-то бот', 'string'),
  createField('profile', '65a6c1d139fcee38a9890d13', 'string'),
  createField('messengers', [bot.example], 'array'),
  createField(
    'commands',
    ['/copy', '/delete', '/rename', '/share', '/info', '/notify'],
    'array',
  ),
  createField('isToPublish', false, 'boolean'),
  createField('_id', '65c12f9e1aab02a0f1392f32', 'string'),
  { ...permission, key: 'permission' },
];

const getBots: IFieldDescription[] = [
  createField('_id', '65c12f9e1aab02a0f1392f32', 'string'),
  createField('type', 'custom', 'string'),
  createField('title', 'Бот', 'string'),
  createField('description', 'Какой-то бот', 'string'),
  createField('profile', '65a6c1d139fcee38a9890d13', 'string'),
  createField('messengers', [bot.example], 'array'),
  createField(
    'commands',
    ['/copy', '/delete', '/rename', '/share', '/info', '/notify'],
    'array',
  ),
  createField('isToPublish', false, 'boolean'),
  createField('_id', '65c12f9e1aab02a0f1392f32', 'string'),
  { ...permission, key: 'permission' },
];

const getBotsTemplates: IFieldDescription[] = [
  createField('_id', '65c12f9e1aab02a0f1392f32', 'string'),
  createField('type', 'custom', 'string'),
  createField('title', 'Бот', 'string'),
  createField('description', 'Какой-то бот', 'string'),
  createField('icon', 'answering machine', 'string'),
  createField('messengers', [], 'array'),
  createField('profile', 'null', 'string'),
  createField(
    'features',
    {
      // eslint-disable-next-line prettier/prettier
      nodes: [
        {
          width: 80,
          height: 29,
          id: 'node-1',
          type: 'buttonStart',
          data: {
            type: 'start',
          },
          position: {
            x: 0,
            y: 0,
          },
          positionAbsolute: {
            x: 0,
            y: 0,
          },
        },
        {
          width: 296,
          height: 954,
          id: 'node-2',
          type: 'message',
          data: {
            name: 'message',
            data: [
              {
                type: 'message',
                value: '',
              },
              {
                type: 'buttons',
                verButtons: [],
                horButtons: [],
              },
              {
                type: 'answers',
                verButtons: [],
                horButtons: [],
              },
            ],
            showTime: {
              show: true,
              value: 0,
            },
            saveAnswer: {
              show: true,
              value: '',
            },
          },
          position: {
            x: 130,
            y: 0,
          },
          positionAbsolute: {
            x: 130,
            y: 0,
          },
        },
        {
          width: 296,
          height: 148,
          id: 'ea276e42-2a22-457a-aa75-e7f83cc28b6d',
          position: {
            x: 518.3058186738838,
            y: 188.7345060893099,
          },
          type: 'variable',
          data: {
            name: 'Variable Block',
            variables: [],
          },
          selected: false,
          positionAbsolute: {
            x: 518.3058186738838,
            y: 188.7345060893099,
          },
          dragging: false,
        },
        {
          id: '37ccf480-a55c-4eab-a9d2-60b5a582fe5d',
          position: {
            x: 630.487956698241,
            y: 430.1391069012179,
          },
          type: 'telegramPay',
          data: {
            name: 'TelegramPay',
            goodsName: '',
            image: '',
            description: '',
            payment: '',
            currency: '',
            providerToken: '',
            onSuccess: '',
          },
          width: 296,
          height: 654,
          selected: true,
          positionAbsolute: {
            x: 630.487956698241,
            y: 430.1391069012179,
          },
          dragging: false,
        },
      ],
      // eslint-disable-next-line prettier/prettier
      edges: [
        {
          id: '1-2',
          source: 'node-1',
          target: 'node-2',
          targetHandle: 'l',
        },
        {
          type: 'smoothstep',
          markerEnd: {
            type: 'arrow',
          },
          source: 'node-2',
          sourceHandle: 'r',
          target: 'ea276e42-2a22-457a-aa75-e7f83cc28b6d',
          targetHandle: 'l',
          id: 'reactflow__edge-node-2r-ea276e42-2a22-457a-aa75-e7f83cc28b6dl',
        },
        {
          type: 'smoothstep',
          markerEnd: {
            type: 'arrow',
          },
          source: 'node-2',
          sourceHandle: 'r',
          target: '37ccf480-a55c-4eab-a9d2-60b5a582fe5d',
          targetHandle: 'l',
          id: 'reactflow__edge-node-2r-37ccf480-a55c-4eab-a9d2-60b5a582fe5dl',
        },
      ],
    },
    'object',
  ),
  createField(
    'commands',
    ['/copy', '/delete', '/rename', '/share', '/info', '/notify'],
    'array',
  ),
  createField('isToPublish', false, 'boolean'),
  createField('_id', '65c12f9e1aab02a0f1392f32', 'string'),
  { ...permission, key: 'permission' },
];

const createBotTemplate: IFieldDescription[] = [
  createField('_id', '65c12f9e1aab02a0f1392f32', 'string'),
  createField('type', 'custom', 'string'),
  createField('title', 'Бот', 'string'),
  createField('description', 'Какой-то бот', 'string'),
  createField('icon', 'answering machine', 'string'),
  createField(
    'messengers',
    [
      {
        name: 'VK',
        pages: ['vk.com/club1245321223'],
        accessKey: '1685494522:AAHzRs4YFqckLvBVARVoUL0c3B1GFqlDpo',
        url: 'some_url',
      },
      {
        name: 'WhathApp',
        pages: [
          'vk.com/club1245321223',
          'vk.com/club1245321223',
          'vk.com/club1245321223',
          'vk.com/club1245321223',
        ],
        accessKey: '1685494522:AAHzRs4YFqckLvBVARVoUL0c3B1GFqlDpo',
        url: 'some_url',
      },
    ],
    'array',
  ),
  createField('profile', '65a6c1d139fcee38a9890d13', 'string'),
  createField(
    'features',
    {
      // eslint-disable-next-line prettier/prettier
      nodes: [
        {
          width: 80,
          height: 29,
          id: 'node-1',
          type: 'buttonStart',
          data: {
            type: 'start',
          },
          position: {
            x: 0,
            y: 0,
          },
          positionAbsolute: {
            x: 0,
            y: 0,
          },
        },
        {
          width: 296,
          height: 954,
          id: 'node-2',
          type: 'message',
          data: {
            name: 'message',
            data: [
              {
                type: 'message',
                value: '',
              },
              {
                type: 'buttons',
                verButtons: [],
                horButtons: [],
              },
              {
                type: 'answers',
                verButtons: [],
                horButtons: [],
              },
            ],
            showTime: {
              show: true,
              value: 0,
            },
            saveAnswer: {
              show: true,
              value: '',
            },
          },
          position: {
            x: 130,
            y: 0,
          },
          positionAbsolute: {
            x: 130,
            y: 0,
          },
        },
        {
          width: 296,
          height: 148,
          id: 'ea276e42-2a22-457a-aa75-e7f83cc28b6d',
          position: {
            x: 518.3058186738838,
            y: 188.7345060893099,
          },
          type: 'variable',
          data: {
            name: 'Variable Block',
            variables: [],
          },
          selected: false,
          positionAbsolute: {
            x: 518.3058186738838,
            y: 188.7345060893099,
          },
          dragging: false,
        },
        {
          id: '37ccf480-a55c-4eab-a9d2-60b5a582fe5d',
          position: {
            x: 630.487956698241,
            y: 430.1391069012179,
          },
          type: 'telegramPay',
          data: {
            name: 'TelegramPay',
            goodsName: '',
            image: '',
            description: '',
            payment: '',
            currency: '',
            providerToken: '',
            onSuccess: '',
          },
          width: 296,
          height: 654,
          selected: true,
          positionAbsolute: {
            x: 630.487956698241,
            y: 430.1391069012179,
          },
          dragging: false,
        },
      ],
      // eslint-disable-next-line prettier/prettier
      edges: [
        {
          id: '1-2',
          source: 'node-1',
          target: 'node-2',
          targetHandle: 'l',
        },
        {
          type: 'smoothstep',
          markerEnd: {
            type: 'arrow',
          },
          source: 'node-2',
          sourceHandle: 'r',
          target: 'ea276e42-2a22-457a-aa75-e7f83cc28b6d',
          targetHandle: 'l',
          id: 'reactflow__edge-node-2r-ea276e42-2a22-457a-aa75-e7f83cc28b6dl',
        },
        {
          type: 'smoothstep',
          markerEnd: {
            type: 'arrow',
          },
          source: 'node-2',
          sourceHandle: 'r',
          target: '37ccf480-a55c-4eab-a9d2-60b5a582fe5d',
          targetHandle: 'l',
          id: 'reactflow__edge-node-2r-37ccf480-a55c-4eab-a9d2-60b5a582fe5dl',
        },
      ],
    },
    'object',
  ),
  createField(
    'commands',
    ['/copy', '/delete', '/rename', '/share', '/info', '/notify'],
    'array',
  ),
  createField('isToPublish', false, 'boolean'),
  createField('_id', '65c12f9e1aab02a0f1392f32', 'string'),
  { ...permission, key: 'permission' },
  { ...settings, key: 'settings' },
];

const createTemplate: IFieldDescription[] = [
  createField('type', 'custom', 'string'),
  createField('title', 'Бот', 'string'),
  createField('description', 'Какой-то бот', 'string'),
  createField('messengers', [], 'array'),
  createField(
    'commands',
    ['/copy', '/delete', '/rename', '/share', '/info', '/notify'],
    'array',
  ),
  createField('isToPublish', false, 'boolean'),
  createField('_id', '65c12f9e1aab02a0f1392f32', 'string'),
  { ...permission, key: 'permission' },
];

const userUnauthirizedResponse: IFieldDescription[] = [
  createField('message', 'Unauthorized', 'string', 'Сообщение об ошибке'),
  createField(
    'statusCode',
    HttpStatus.UNAUTHORIZED,
    'number',
    'HTTP-статус код',
  ),
  createField(
    'timestamp',
    '2024-02-04T12:37:00.127Z',
    'string',
    'Время возникновения ошибки',
  ),
  createField('path', '/dev/api/:path', 'string', 'Путь возникновения ошибки'),
];

const botDataConflict: IFieldDescription[] = [
  createField(
    'message',
    'Бот с таким имененм уже существует',
    'string',
    'Сообщение об ошибке',
  ),
  createField('statusCode', HttpStatus.CONFLICT, 'number', 'HTTP-статус код'),
  createField(
    'timestamp',
    '2024-02-04T12:37:00.127Z',
    'string',
    'Время возникновения ошибки',
  ),
  createField('path', '/dev/api/:path', 'string', 'Путь возникновения ошибки'),
];

const templateDataConflict: IFieldDescription[] = [
  createField(
    'message',
    'Шаблон с таким имененм уже существует',
    'string',
    'Сообщение об ошибке',
  ),
  createField('statusCode', HttpStatus.CONFLICT, 'number', 'HTTP-статус код'),
  createField(
    'timestamp',
    '2024-02-04T12:37:00.127Z',
    'string',
    'Время возникновения ошибки',
  ),
  createField('path', '/dev/api/:path', 'string', 'Путь возникновения ошибки'),
];

const botDataBadRequest: IFieldDescription[] = [
  createField(
    'message',
    'Bad Request Exception',
    'string',
    'Сообщение об ошибке',
  ),
  createField(
    'statusCode',
    HttpStatus.BAD_REQUEST,
    'number',
    'HTTP-статус код',
  ),
  createField(
    'timestamp',
    '2024-02-04T12:37:00.127Z',
    'string',
    'Время возникновения ошибки',
  ),
  createField('path', '/dev/api/:path', 'string', 'Путь возникновения ошибки'),
];

const updateTemplateBadRequest: IFieldDescription[] = [
  createField(
    'message',
    'Шаблон с ID 65a6c1d139fcee38a9890d51 не найден',
    'string',
    'Сообщение об ошибке',
  ),
  createField('statusCode', HttpStatus.NOT_FOUND, 'number', 'HTTP-статус код'),
  createField(
    'timestamp',
    '2024-02-04T12:37:00.127Z',
    'string',
    'Время возникновения ошибки',
  ),
  createField('path', '/dev/api/:path', 'string', 'Путь возникновения ошибки'),
];

const deleteTemplateNotFound: IFieldDescription = createNestedObject([
  createField(
    'message',
    'Шаблон с ID 65a6c1d139fcee38a9890d51 не найден',
    'string',
  ),
  createField('error', 'Not Found', 'string'),
  createField('statusCode', HttpStatus.NOT_FOUND, 'number', 'HTTP-статус код'),
]);

const deleteBotNotFound: IFieldDescription = createNestedObject([
  createField(
    'message',
    'Бот с ID 65a6c1d139fcee38a9890d16 не найден',
    'string',
  ),
  createField('error', 'Not Found', 'string'),
  createField('statusCode', HttpStatus.NOT_FOUND, 'number', 'HTTP-статус код'),
]);

const deleteBotBadRequest: IFieldDescription = createNestedObject([
  createField(
    'message',
    'Бот с ID 65a6c1d139fcee38a9890d16 не найден',
    'string',
  ),
  createField('error', 'Not Found', 'string'),
  createField(
    'statusCode',
    HttpStatus.BAD_REQUEST,
    'number',
    'HTTP-статус код',
  ),
]);

const deleteTemplateBadRequest: IFieldDescription[] = [
  { ...deleteTemplateNotFound, key: 'response' },
  createField('status', HttpStatus.NOT_FOUND, 'number', 'HTTP-статус код'),
  createField('options', {}, 'object'),
  createField(
    'message',
    'Шаблон с ID 65a6c1d139fcee38a9890d51 не найден',
    'string',
    'Сообщение об ошибке',
  ),
  createField('name', 'NotFoundException', 'string'),
];

const deleteBotNotFoundBadRequest: IFieldDescription[] = [
  { ...deleteBotNotFound, key: 'response' },
  createField('status', HttpStatus.NOT_FOUND, 'number', 'HTTP-статус код'),
  createField('options', {}, 'object'),
  createField(
    'message',
    'Бот с ID 65a6c1d139fcee38a9890d51 не найден',
    'string',
    'Сообщение об ошибке',
  ),
  createField('name', 'NotFoundException', 'string'),
];

const deleteBotBadRequestBad: IFieldDescription[] = [
  { ...deleteBotBadRequest, key: 'response' },
  createField('status', HttpStatus.BAD_REQUEST, 'number', 'HTTP-статус код'),
  createField('options', {}, 'object'),
  createField(
    'message',
    'Шаблон с ID 65a6c1d139fcee38a9890d51 не найден',
    'string',
    'Сообщение об ошибке',
  ),
  createField('name', 'NotFoundException', 'string'),
];

const updateBotNotFoundBadRequest: IFieldDescription[] = [
  createField(
    'message',
    'Бот с ID 65a6c1d139fcee38a9890d51 не найден',
    'string',
    'Сообщение об ошибке',
  ),
  createField('statusCode', HttpStatus.NOT_FOUND, 'number', 'HTTP-статус код'),
  createField(
    'timestamp',
    '2024-02-04T12:37:00.127Z',
    'string',
    'Время возникновения ошибки',
  ),
  createField('path', '/dev/api/:path', 'string', 'Путь возникновения ошибки'),
];

const updateBotTemplate: IFieldDescription[] = [
  createField('_id', '65c12f9e1aab02a0f1392f32', 'string'),
  createField('type', 'custom', 'string'),
  createField('title', 'Бот', 'string'),
  createField('description', 'Какой-то бот', 'string'),
  createField('profile', '65c5e2ee219c9bffc85cb696', 'string'),
  createField(
    'messengers',
    [
      {
        name: 'VK',
        pages: ['vk.com/club1245321223'],
        accessKey: '1685494522:AAHzRs4YFqckLvBVARVoUL0c3B1GFqlDpo',
        url: 'some_url',
      },
      {
        name: 'WhathApp',
        pages: [
          'vk.com/club1245321223',
          'vk.com/club1245321223',
          'vk.com/club1245321223',
          'vk.com/club1245321223',
        ],
        accessKey: '1685494522:AAHzRs4YFqckLvBVARVoUL0c3B1GFqlDpo',
        url: 'some_url',
      },
    ],
    'array',
  ),
  createField(
    'commands',
    ['/copy', '/delete', '/rename', '/share', '/info', '/notify'],
    'array',
  ),
  createField('isToPublish', false, 'boolean'),
  { ...settings, key: 'settings' },
];

export const CreateBotResponseOk = new ApiPropertyFactory(createBot).generate(
  'CreateBotResponseOk',
);

export const GetBotsResponseOk = new ApiPropertyFactory(getBots).generate(
  'GetBotsResponseOk',
);

export const GetBotsTemplatesResponseOk = new ApiPropertyFactory(
  getBotsTemplates,
).generate('GetBotsTemplatesResponseOk');

export const CreateTemplateResponseOk = new ApiPropertyFactory(
  createTemplate,
).generate('CreateTemplateResponseOk');

export const CreateBotTemplateResponseOk = new ApiPropertyFactory(
  createBotTemplate,
).generate('CreateBotTemplateResponseOk');

export const UpdateBotResponseOk = new ApiPropertyFactory(
  updateBotTemplate,
).generate('UpdateBotResponseOk');

export const UserUnauthirizedResponse = new ApiPropertyFactory(
  userUnauthirizedResponse,
).generate('UserUnauthirizedResponse');

export const BotDataConflictResponse = new ApiPropertyFactory(
  botDataConflict,
).generate('BotDataConflictResponse');

export const TemplateDataConflictResponse = new ApiPropertyFactory(
  templateDataConflict,
).generate('TemplateDataConflictResponse');

export const BotDataBadRequestResponse = new ApiPropertyFactory(
  botDataBadRequest,
).generate('BotDataBadRequestResponse');

export const UpdateTemplateBadRequestResponse = new ApiPropertyFactory(
  updateTemplateBadRequest,
).generate('UpdateTemplateBadRequestResponse');

export const DeleteTemplateBadRequestResponse = new ApiPropertyFactory(
  deleteTemplateBadRequest,
).generate('DeleteTemplateBadRequestResponse');

export const DeleteBotBadRequestResponse = new ApiPropertyFactory(
  deleteBotNotFoundBadRequest,
).generate('DeleteBotBadRequestResponse');

export const DeleteBotBadRequestBad = new ApiPropertyFactory(
  deleteBotBadRequestBad,
).generate('DeleteBotBadRequestBad');

export const UpdateBotNotFoundBadRequest = new ApiPropertyFactory(
  updateBotNotFoundBadRequest,
).generate('UpdateBotNotFoundBadRequest');
