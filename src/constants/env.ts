import Config from 'react-native-config';

export const IS_PRODUCTION = Config.NODE_ENV === 'production';

const buildUrl = (protocol?: string, host?: string) => {
  if (!protocol || !host) return '';
  return `${protocol}://${host}`;
};

export const SERVER_URL = buildUrl(Config.SERVER_PROTOCOL, Config.SERVER_HOST);

export const TEST_SERVER_URL = buildUrl(
  Config.TEST_SERVER_PROTOCOL,
  Config.TEST_SERVER_HOST,
);

export const APP_CLIENT_URL = buildUrl(
  Config.APP_CLIENT_PROTOCOL,
  Config.APP_CLIENT_HOST,
);

export const LANDING_CLIENT_URL = buildUrl(
  Config.LANDING_CLIENT_PROTOCOL,
  Config.LANDING_CLIENT_HOST,
);
