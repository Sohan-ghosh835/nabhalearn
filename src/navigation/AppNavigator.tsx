import React, { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import StudentDashboard from '../screens/StudentDashboard';
import TeacherDashboard from '../screens/TeacherDashboard';
import FileTransferScreen from '../screens/FileTransferScreen';
import OfflineTransferScreen from '../screens/OfflineTransferScreen';
import CloudTransferScreen from '../screens/CloudTransferScreen';
import AIChatScreen from '../screens/AIChatScreen';
import SyncProgressScreen from '../screens/SyncProgressScreen';
import TeacherOfflineTransferScreen from '../screens/TeacherOfflineTransferScreen';

export type RootStackParamList = {
  Login: undefined;
  StudentDashboard: undefined;
  TeacherDashboard: undefined;
  FileTransfer: undefined;
  OfflineTransfer: undefined;
  CloudTransfer: undefined;
  AIChat: undefined;
  SyncProgress: undefined;
  TeacherOfflineTransfer: undefined;
};

type ScreenName = keyof RootStackParamList;

const AppNavigator: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Login');
  const [navigationHistory, setNavigationHistory] = useState<ScreenName[]>(['Login']);

  const navigate = (screenName: ScreenName) => {
    setCurrentScreen(screenName);
    setNavigationHistory(prev => [...prev, screenName]);
  };

  const goBack = React.useCallback(() => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop();
      const previousScreen = newHistory[newHistory.length - 1];
      setCurrentScreen(previousScreen);
      setNavigationHistory(newHistory);
      return true; // Indicate that back was handled
    }
    return false; // Let system handle back (close app)
  }, [navigationHistory]);

  // Android back button is handled by individual screens

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <LoginScreen navigation={{ navigate, goBack }} />;
      case 'StudentDashboard':
        return <StudentDashboard navigation={{ navigate, goBack }} />;
      case 'TeacherDashboard':
        return <TeacherDashboard navigation={{ navigate, goBack }} />;
      case 'FileTransfer':
        return <FileTransferScreen navigation={{ navigate, goBack }} />;
      case 'OfflineTransfer':
        return <OfflineTransferScreen navigation={{ navigate, goBack }} />;
      case 'CloudTransfer':
        return <CloudTransferScreen navigation={{ navigate, goBack }} />;
      case 'AIChat':
        return <AIChatScreen navigation={{ navigate, goBack }} />;
      case 'SyncProgress':
        return <SyncProgressScreen navigation={{ navigate, goBack }} />;
      case 'TeacherOfflineTransfer':
        return <TeacherOfflineTransferScreen navigation={{ navigate, goBack }} />;
      default:
        return <LoginScreen navigation={{ navigate, goBack }} />;
    }
  };

  return renderScreen();
};

export default AppNavigator;
