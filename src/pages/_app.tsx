import React from 'react';
import { AppProps } from 'next/app'
import { RelayEnvironmentProvider } from 'relay-hooks';
import createEnvironment from '@/relay/createEnvironment';

const App = ({ Component, pageProps }: AppProps) => {
  const isServer = typeof window === 'undefined';
  const environment = createEnvironment( isServer ? {}:  (window as any).__RELAY_BOOTSTRAP_DATA__ || {});

  return (
    <RelayEnvironmentProvider environment={environment} >
        <Component {...pageProps} />
    </RelayEnvironmentProvider>
  );
};

export default App;
