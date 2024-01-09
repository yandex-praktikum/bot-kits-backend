// Описание структуры данных Воронок

// Состояние Воронок описывается объектом (нужно передавать/получать на/от сервер(а)):
export type TBuilderData = {
  type?: string; // Тип бота(VK/TG/OK и т.д.), можно задать варианты перечислением через |
  variables?: TVariable[]; // Пока не ясно что это, некие переменные
  nodes: TReactFlowNode[];
  edges: TReactFlowEdge[];
  triggers?: TTrigger[];
};

type TReactFlowNode = {
  id: string; // уникальная строка
  type: string; // один из типов блоков (нужно придумать)
  data:
    | TApiBlock
    | TConditionalBlock
    | TVariablesControlBlock
    | TOperatorBlock
    | TCRMBlock
    | TDeepLinkBlock
    | TTelegramPayBlock
    | TCoordinateBlock
    | TMessageBlock
    | TButtonBlock;
  position: { y: number; x: number };
  positionAbsolute: { y: number; x: number };
  parentNode?: string; // id родительской ноды, если такая есть
};

type TReactFlowEdge = {
  id: string; // уникальная строка
  source: string; // ReactFlowNode id источника
  target: string; // ReactFlowNode id цели
};

type TVariable = {
  [key: string]: any; // Пока не понятная структура переменных
};

type TTrigger = {
  tag: string;
  type: 'block' | 'text'; // Тип цели триггера
  name?: string; // Имя одного из блоков
  text?: string; // Произовльный текст
};

//      2.

// В data ReactFlowEdge входят 9 пользовательских блоков, являющихся нодами ReactFlow, и нода (ButtonBlock), входящая в составной блок MessageBlock

type TCoordinateBlock = {
  name: string;
  coordinates: number[]; // Массив из 2-х чисел
};

type TTelegramPayBlock = {
  name: string;
  goodsName: string;
  image?: File; // Изображение, если есть. Для отображения будет использоваться компонент File
  description: string;
  payment: number;
  currency: string; // Валюты нужно будет вынести в env.
  providerToken: string;
  onSuccess: string; // name блока, на который происходит перенаправление при успешной оплате
};

type TDeepLinkBlock = {
  name: string;
  param: string; // Выбор одного из параметров, откуда-то должен получаться список
  type: 'random' | 'static' | 'variable' | 'JS' | 'CRM'; // по умолчанию random
  signsAmount: number; // по умолчанию 8
  additionValue: string;
  additionLink: string;
};

type TCRMBlock = {
  name: string;
  crmList: string[]; // Подтянуть список crm пользователя, пока закроем хардкодом
  chosenCrm?: string; // Выбор из crmList, можно просто выбрать первую
  save?: 'new' | 'suppl';
};

type TOperatorBlock = {
  name: string;
};

type TVariablesControlBlock = {
  // В данном блоке должно происходить присваивание переменной некоторого значения.
  name: string;
  variables: { variable?: TVariable; value: string }[]; // Пока  не точно
};

type TConditionalBlock = {
  name: string;
  variables: {
    id: string;
    type: 'easy' | 'hard'; // В зависимости от типа переменной нужны (variable, sign, condition, blockName) для easy и (condition, blockName) для hard
    variable?: TVariable; // Некая переменная
    sign?: string; // Одно из value принимаемых select, 11 значений, значения стоит отправить в конфиг.
    condition?: string; // Строка-условие для сложного режима или значение для легкого
    targetBlock: string; // name одного из блоков
  }[];
};

type TApiBlock = {
  name: string;
  url: string;
  reqType?: 'get' | 'post';
  headers: {
    type: 'variable' | 'const';
    name: string;
    variable: string;
  }[];
  params: {
    type: 'variable' | 'const';
    name: string;
    variable: string;
  }[];
  variable?: TVariable;
};

type TMessageBlock = {
  name: string;
  data: TMessageBlockData[];
  saveAnswer: {
    show: boolean;
    value: string;
  };
  showTime: {
    show: boolean;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
};

export type TButtonBlock = {
  type: 'button' | 'answer';
  direction: 'horizontal' | 'vertical';
  additionalData?: boolean;
  name: string;
  color: string;
  str: string;
  deskY: number;
  mobY: number;
};

//      3.
type TMessageBlockData = TMessageData | TButtonsData | TAnswersData | TFileData;

type TMessageData = {
  type: MessageDataTypes.message;
  value: string;
  emoji?: string;
};

type TButtonsData = {
  type: MessageDataTypes.buttons;
};

type TAnswersData = {
  type: MessageDataTypes.answers;
};

type TFileData = {
  type: MessageDataTypes.file;
  file: File;
};

enum MessageDataTypes {
  buttons = 'buttons',
  message = 'message',
  answers = 'answers',
  file = 'file',
}
