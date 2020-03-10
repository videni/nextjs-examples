import { Environment, RecordSource, Store } from 'relay-runtime';
import Cookies from 'universal-cookie';
import {
  RelayNetworkLayer,
  urlMiddleware,
  cacheMiddleware,
  authMiddleware,
  RelayRequestAny,
  uploadMiddleware,
} from 'react-relay-network-modern';

let environment: Environment | null = null;

export const createEnvironment = function ({ records = {} } = {}) {
  if (environment) {
    return environment;
  }

  console.log('graphql env', process.env.GRAPHQL_ENDPOINT);

  const middlewares = [
    urlMiddleware({
      url: (process.env.GRAPHQL_ENDPOINT as string)
    }),
    cacheMiddleware({
      size: 100,
      ttl: 60 * 1000,
    }),
    authMiddleware({
      token: async (req: RelayRequestAny) => {
        const cookies = new Cookies(req.fetchOpts.headers.cookie);

        return cookies.get('jwt_token');
      },
    }),
    uploadMiddleware(),
  ];

  const network = new RelayNetworkLayer(
    middlewares, {
    noThrow: true
  });

  const source = new RecordSource(records);
  const store = new Store(source);

  environment = new Environment({
    network,
    store,
  });

  return environment;
}

export default createEnvironment;
