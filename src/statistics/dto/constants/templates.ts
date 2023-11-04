const platformsData = [
  {
    date: Date.now(),
    amountOfBots: 120,
  },
  {
    date: Date.now(),
    amountOfBots: 20,
  },
  {
    date: Date.now(),
    amountOfBots: 400,
  },
];

const installedBotsData = [
  {
    date: Date.now(),
    amountOfBots: 300,
  },
  {
    date: Date.now(),
    amountOfBots: 550,
  },
  {
    date: Date.now(),
    amountOfBots: 10,
  },
];

const connectedBotsData = [
  {
    date: Date.now(),
    amountOfBots: 210,
  },
  {
    date: Date.now(),
    amountOfBots: 60,
  },
  {
    date: Date.now(),
    amountOfBots: 330,
  },
];

export const statisticsTemplate = {
  platformStats: {
    statsData: [
      {
        platform: 'VK',
        data: platformsData,
        total: 640,
      },
    ],
  },
  installedBots: {
    statsData: {
      data: installedBotsData,
      total: 860,
    },
  },

  connectedBotsData: {
    statsData: {
      data: connectedBotsData,
      total: 600,
    },
  },
};
