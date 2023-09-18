export const result = {
  icon: 'http://placeimg.com/640/480',
  title: 'aperiam',
  description: 'Nemo repellat et rerum.',
  features: [],
  settings: {
    hello: 'world',
    test: ['q', 'w'],
  },
  _id: 1,
  createdAt: '2023-09-11T17:27:06.479Z',
  updatedAt: '2023-09-11T17:27:06.479Z',
  __v: 0,
};

export const resultArrayWithLength3 = [result, result, result];

export const oneBotTemplateDocument = {
  id: 1,
  exec: async () => ({ ...result, toJSON: () => result, id: 1 }),
  save: async () => ({ ...result, toJSON: () => result, id: 1 }),
};

export const threeBotTemplateDocuments = {
  exec: async () =>
    resultArrayWithLength3.map((it) => ({ ...it, toJSON: () => it, id: 1 })),
};
export const oneBotTemplateDocumentFactory = (id, props) => {
  const res = { ...result, ...props };
  return {
    id: id,
    exec: async () => ({ ...res, toJSON: () => res, id: id }),
  };
};
