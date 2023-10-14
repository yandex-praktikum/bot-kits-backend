const formFieldsExampleSocialNetworks = {
  name: true,
  pages: true,
  accessKey: false,
  url: false,
};

const formFieldsExampleWeb = {
  name: true,
  pages: false,
  accessKey: false,
  url: true,
};

const formFieldsExampleMessenger = {
  name: true,
  pages: false,
  accessKey: true,
  url: false,
};

export const platforms = [
  {
    icon: 'facebook',
    title: 'Facebook',
    formFields: formFieldsExampleSocialNetworks,
  },
  {
    icon: 'vk',
    title: 'VK',
    formFields: formFieldsExampleSocialNetworks,
  },
  {
    icon: 'odnoklassniki',
    title: 'Odnoklassniki',
    formFields: formFieldsExampleSocialNetworks,
  },
  {
    icon: 'telegram',
    title: 'Telegram',
    formFields: formFieldsExampleMessenger,
  },
  {
    icon: 'viber',
    title: 'Viber',
    formFields: {
      name: true,
      pages: false,
      accessKey: true,
      url: true,
    },
  },
  {
    icon: 'alisa',
    title: 'Алиса',
    formFields: formFieldsExampleMessenger,
  },
  {
    icon: 'whatsapp',
    title: 'Whatsapp',
    formFields: formFieldsExampleMessenger,
  },
  {
    icon: 'insta',
    title: 'Instagram',
    formFields: formFieldsExampleSocialNetworks,
  },
  {
    icon: 'web',
    title: 'Веб-сайт',
    formFields: formFieldsExampleWeb,
  },
];
