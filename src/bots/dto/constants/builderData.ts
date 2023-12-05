export const builderData = {
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
};
