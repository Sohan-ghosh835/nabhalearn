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
  ScrollView,
} from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import BluetoothManager, { BluetoothDevice, FileTransferProgress } from '../services/BluetoothManager';

type ScreenName = keyof RootStackParamList;

interface Props {
  navigation: {
    navigate: (screenName: ScreenName) => void;
    goBack: () => void;
  };
}

const { width, height } = Dimensions.get('window');

const OfflineTransferScreen: React.FC<Props> = ({ navigation }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<BluetoothDevice[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingDevice, setDownloadingDevice] = useState<string | null>(null);
  const [transferProgress, setTransferProgress] = useState<FileTransferProgress | null>(null);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);

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

  // Set up Bluetooth event listeners
  useEffect(() => {
    BluetoothManager.setOnDeviceFound((device) => {
      setDiscoveredDevices(prev => {
        const exists = prev.find(d => d.id === device.id);
        if (!exists) {
          return [...prev, device];
        }
        return prev;
      });
    });

    BluetoothManager.setOnFileTransferProgress((progress) => {
      setTransferProgress(progress);
    });

    return () => {
      BluetoothManager.stopDiscovery();
    };
  }, []);

  const startSearching = async () => {
    // Check Bluetooth permissions first
    const hasPermission = await BluetoothManager.requestBluetoothPermissions();
    if (!hasPermission) {
      Alert.alert(
        'Bluetooth Permission Required', 
        'Bluetooth permissions are required to discover devices. Please grant permissions in settings.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Check if Bluetooth is enabled
    const isEnabled = await BluetoothManager.isBluetoothEnabled();
    if (!isEnabled) {
      Alert.alert(
        'Bluetooth is Off',
        'Bluetooth is currently disabled. Would you like to turn it on to discover nearby devices?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Turn On', 
            onPress: async () => {
              const enabled = await BluetoothManager.enableBluetooth();
              if (!enabled) {
                Alert.alert('Error', 'Failed to enable Bluetooth. Please turn it on manually in settings.');
                return;
              }
              // Continue with discovery after enabling
              await continueDiscovery();
            }
          }
        ]
      );
      return;
    }

    // Continue with discovery if Bluetooth is already enabled
    await continueDiscovery();
  };

  const continueDiscovery = async () => {
    setIsSearching(true);
    setDiscoveredDevices([]);
    setIsBluetoothEnabled(true);
    
    const discoveryStarted = await BluetoothManager.startDiscovery();
    if (!discoveryStarted) {
      Alert.alert('Discovery Error', 'Failed to start device discovery. Please make sure Bluetooth is enabled and try again.');
      setIsSearching(false);
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    setIsDownloading(true);
    setDownloadingDevice(device.name);
    
    try {
      const connected = await BluetoothManager.connectToDevice(device);
      if (connected) {
        // Simulate file download with progress
        setTimeout(() => {
          setIsDownloading(false);
          setDownloadingDevice(null);
          setTransferProgress(null);
          Alert.alert(
            'Download Complete!',
            `Successfully downloaded video from ${device.name}`,
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        }, 5000);
      } else {
        Alert.alert('Error', 'Failed to connect to device');
        setIsDownloading(false);
        setDownloadingDevice(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download file');
      setIsDownloading(false);
      setDownloadingDevice(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSecond: number) => {
    return formatFileSize(bytesPerSecond) + '/s';
  };

  const renderSearchingState = () => (
    <View style={styles.searchingContainer}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={styles.searchingText}>Searching for devices...</Text>
      <Text style={styles.searchingSubtext}>
        Make sure teacher devices have Bluetooth enabled and are sharing files
      </Text>
    </View>
  );

  const renderDeviceList = () => (
    <ScrollView style={styles.deviceListContainer}>
      <Text style={styles.deviceListTitle}>Available Teacher Devices:</Text>
      {discoveredDevices.map((device) => (
        <TouchableOpacity
          key={device.id}
          style={styles.deviceItem}
          onPress={() => connectToDevice(device)}
          disabled={isDownloading}
        >
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <Text style={styles.deviceAddress}>{device.address}</Text>
            <Text style={styles.deviceStatus}>
              {device.isConnected ? 'Connected' : 'Available'}
            </Text>
          </View>
          <View style={styles.deviceAction}>
            {isDownloading && downloadingDevice === device.name ? (
              <ActivityIndicator size="small" color="#4CAF50" />
            ) : (
              <Text style={styles.connectButton}>Connect</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderDownloadProgress = () => {
    if (!transferProgress) return null;

    return (
      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Downloading {transferProgress.fileName}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${transferProgress.percentage}%` }]} />
        </View>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {formatFileSize(transferProgress.bytesTransferred)} / {formatFileSize(transferProgress.totalBytes)}
          </Text>
          <Text style={styles.progressSpeed}>
            {formatSpeed(transferProgress.speed)}
          </Text>
        </View>
        <Text style={styles.progressPercentage}>{transferProgress.percentage.toFixed(1)}%</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offline Transfer</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Discover Teacher Devices</Text>
        <Text style={styles.subtitle}>
          Find nearby teacher devices sharing educational content
        </Text>

        {!isBluetoothEnabled && !isSearching && (
          <TouchableOpacity style={styles.startButton} onPress={startSearching}>
            <Text style={styles.startButtonText}>Start Discovery</Text>
          </TouchableOpacity>
        )}

        {isSearching && renderSearchingState()}
        
        {discoveredDevices.length > 0 && !isSearching && renderDeviceList()}
        
        {isDownloading && renderDownloadProgress()}

        {!isSearching && discoveredDevices.length === 0 && isBluetoothEnabled && (
          <View style={styles.noDevicesContainer}>
            <Text style={styles.noDevicesText}>No teacher devices found</Text>
            <Text style={styles.noDevicesSubtext}>
              Make sure teacher devices are nearby and sharing files
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={startSearching}>
              <Text style={styles.retryButtonText}>Search Again</Text>
            </TouchableOpacity>
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
    paddingVertical: height * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginRight: width * 0.03,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: width * 0.05,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#666',
    textAlign: 'center',
    marginBottom: height * 0.04,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    padding: height * 0.02,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  startButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  searchingContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.05,
  },
  searchingText: {
    fontSize: width * 0.045,
    color: '#333',
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },
  searchingSubtext: {
    fontSize: width * 0.035,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: width * 0.05,
  },
  deviceListContainer: {
    flex: 1,
  },
  deviceListTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
    marginBottom: height * 0.02,
  },
  deviceItem: {
    backgroundColor: '#fff',
    padding: width * 0.04,
    borderRadius: 12,
    marginBottom: height * 0.015,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  deviceAddress: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: 2,
  },
  deviceStatus: {
    fontSize: width * 0.035,
    color: '#4CAF50',
    fontWeight: '500',
  },
  deviceAction: {
    paddingLeft: width * 0.03,
  },
  connectButton: {
    fontSize: width * 0.04,
    color: '#4CAF50',
    fontWeight: '600',
  },
  progressContainer: {
    backgroundColor: '#fff',
    padding: width * 0.04,
    borderRadius: 12,
    marginTop: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: height * 0.01,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
  },
  progressText: {
    fontSize: width * 0.035,
    color: '#666',
  },
  progressSpeed: {
    fontSize: width * 0.035,
    color: '#666',
  },
  progressPercentage: {
    fontSize: width * 0.04,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center',
  },
  noDevicesContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.05,
  },
  noDevicesText: {
    fontSize: width * 0.045,
    color: '#333',
    marginBottom: height * 0.01,
  },
  noDevicesSubtext: {
    fontSize: width * 0.035,
    color: '#666',
    textAlign: 'center',
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.05,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.015,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
});

export default OfflineTransferScreen;