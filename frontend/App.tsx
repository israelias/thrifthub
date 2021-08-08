import React from 'react';
import 'react-native-gesture-handler';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import PreferencesProvider from './src/context/preferences.context';

import { Core } from './src/core';

export default function App() {
  return (
    <>
      <PreferencesProvider>
        <SafeAreaProvider>
          <Core />
        </SafeAreaProvider>
      </PreferencesProvider>
    </>
  );
}
