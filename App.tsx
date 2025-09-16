/**
 * NabhaLearn - AI-Powered Offline-First Education App
 * 
 * @format
 */

import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import VideoDownloadScreen from './src/screens/VideoDownloadScreen';

function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <VideoDownloadScreen />
    </SafeAreaView>
  );
}

export default App;
