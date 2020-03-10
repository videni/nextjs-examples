import { Environment, RecordSource, Store } from 'relay-runtime';
import RelayServerSSR from 'react-relay-network-modern-ssr/lib/server';
import RelayClientSSR from 'react-relay-network-modern-ssr/lib/client';
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

export const createEnvironment = function ({ cache = [] } = {}) {
  if (environment) {
    return environment;
  }

  const isServer = typeof window === 'undefined';

  console.log(process.env.GRAPHQL_ENDPOINT);

  const relaySSRMiddleware = isServer
    ? new RelayServerSSR()
    : new RelayClientSSR(cache)

  const middlewares = [
    relaySSRMiddleware.getMiddleware(),
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

  const source = new RecordSource();
  const store = new Store(source);

  environment = new Environment({
    network,
    store,
  });

  (environment as any).relaySSRMiddleware = relaySSRMiddleware

  return environment;
}

export default createEnvironment;
