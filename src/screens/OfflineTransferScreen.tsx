import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Dimensions,
  BackHandler,
} from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';

type ScreenName = keyof RootStackParamList;

interface Props {
  navigation: {
    navigate: (screenName: ScreenName) => void;
    goBack: () => void;
  };
}

interface Device {
  id: string;
  name: string;
  type: 'teacher' | 'student';
}

const { width, height } = Dimensions.get('window');

const OfflineTransferScreen: React.FC<Props> = ({ navigation }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingDevice, setDownloadingDevice] = useState<string | null>(null);

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      console.log('OfflineTransferScreen: Android back button pressed');
      navigation.goBack();
      return true; // Indicate that back was handled
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  // Mock device discovery
  const mockDevices: Device[] = [
    { id: '1', name: 'Teacher Phone 1', type: 'teacher' },
    { id: '2', name: 'Teacher Phone 2', type: 'teacher' },
    { id: '3', name: 'Teacher Tablet', type: 'teacher' },
  ];

  const startSearching = () => {
    setIsSearching(true);
    setDevices([]);
    
    // Simulate device discovery
    setTimeout(() => {
      setDevices(mockDevices);
      setIsSearching(false);
    }, 2000);
  };

  const handleDeviceSelect = async (device: Device) => {
    setIsDownloading(true);
    setDownloadingDevice(device.id);
    
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadingDevice(null);
      Alert.alert(
        'Download Complete!',
        `Successfully downloaded files from ${device.name}`,
        [{ text: 'OK' }]
      );
    }, 3000);
  };

  useEffect(() => {
    startSearching();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Offline Transfer</Text>
        <Text style={styles.subtitle}>Search for nearby teacher devices</Text>
      </View>

      <View style={styles.content}>
        {isSearching ? (
          <View style={styles.searchingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.searchingText}>Searching for devices...</Text>
            <Text style={styles.searchingSubtext}>
              Make sure Bluetooth is enabled and devices are nearby
            </Text>
          </View>
        ) : (
          <View style={styles.devicesContainer}>
            <View style={styles.devicesHeader}>
              <Text style={styles.devicesTitle}>Available Devices</Text>
              <TouchableOpacity style={styles.refreshButton} onPress={startSearching}>
                <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
              </TouchableOpacity>
            </View>

            {devices.length === 0 ? (
              <View style={styles.noDevicesContainer}>
                <Text style={styles.noDevicesText}>No devices found</Text>
                <Text style={styles.noDevicesSubtext}>
                  Make sure teacher devices are nearby and sharing is enabled
                </Text>
              </View>
            ) : (
              <View style={styles.devicesList}>
                {devices.map((device) => (
                  <TouchableOpacity
                    key={device.id}
                    style={[
                      styles.deviceCard,
                      isDownloading && downloadingDevice === device.id && styles.downloadingCard,
                    ]}
                    onPress={() => handleDeviceSelect(device)}
                    disabled={isDownloading}
                  >
                    <View style={styles.deviceInfo}>
                      <Text style={styles.deviceIcon}>
                        {device.type === 'teacher' ? '👨‍🏫' : '🎓'}
                      </Text>
                      <View style={styles.deviceDetails}>
                        <Text style={styles.deviceName}>{device.name}</Text>
                        <Text style={styles.deviceType}>
                          {device.type === 'teacher' ? 'Teacher Device' : 'Student Device'}
                        </Text>
                      </View>
                    </View>
                    
                    {isDownloading && downloadingDevice === device.id ? (
                      <View style={styles.downloadingIndicator}>
                        <ActivityIndicator size="small" color="#4CAF50" />
                        <Text style={styles.downloadingText}>Downloading...</Text>
                      </View>
                    ) : (
                      <Text style={styles.downloadButton}>📥</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: width * 0.05,
    top: height * 0.03,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    padding: width * 0.05,
  },
  searchingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchingText: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
    marginTop: height * 0.025,
    marginBottom: 8,
  },
  searchingSubtext: {
    fontSize: width * 0.035,
    color: '#666',
    textAlign: 'center',
    lineHeight: height * 0.025,
    paddingHorizontal: width * 0.05,
  },
  devicesContainer: {
    flex: 1,
  },
  devicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.025,
  },
  devicesTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: width * 0.035,
    fontWeight: '600',
  },
  noDevicesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDevicesText: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  noDevicesSubtext: {
    fontSize: width * 0.035,
    color: '#999',
    textAlign: 'center',
    lineHeight: height * 0.025,
    paddingHorizontal: width * 0.05,
  },
  devicesList: {
    flex: 1,
  },
  deviceCard: {
    backgroundColor: '#fff',
    padding: width * 0.05,
    borderRadius: 12,
    marginBottom: height * 0.015,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: height * 0.08,
  },
  downloadingCard: {
    backgroundColor: '#f0f8f0',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceIcon: {
    fontSize: width * 0.08,
    marginRight: width * 0.04,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  deviceType: {
    fontSize: width * 0.035,
    color: '#666',
  },
  downloadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadingText: {
    fontSize: width * 0.035,
    color: '#4CAF50',
    marginLeft: 8,
    fontWeight: '600',
  },
  downloadButton: {
    fontSize: width * 0.06,
  },
});

export default OfflineTransferScreen;
