import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
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

const { width, height } = Dimensions.get('window');

const TeacherOfflineTransferScreen: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState<'select' | 'compress' | 'sharing'>('select');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      console.log('TeacherOfflineTransferScreen: Android back button pressed');
      navigation.goBack();
      return true; // Indicate that back was handled
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  // Mock file selection
  const mockFiles = [
    'Math Lesson 1.mp4',
    'Science Experiment.mp4',
    'History Documentary.mp4',
    'English Grammar.mp4',
  ];

  const handleFileSelection = () => {
    // Mock file picker - simulate selecting files
    const selected = mockFiles.slice(0, 2); // Select first 2 files
    setSelectedFiles(selected);
    setStep('compress');
  };

  const handleCompress = () => {
    setIsCompressing(true);
    
    // Simulate compression process
    setTimeout(() => {
      setIsCompressing(false);
      setStep('sharing');
    }, 2000);
  };

  const handleStartSharing = () => {
    setIsSharing(true);
    
    // Simulate sharing process
    setTimeout(() => {
      setIsSharing(false);
      Alert.alert(
        'Sharing Complete!',
        'Files have been shared to nearby student devices',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 3000);
  };

  const renderSelectStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Videos to Share</Text>
      <Text style={styles.stepDescription}>
        Choose videos from your phone storage to share with students
      </Text>
      
      <View style={styles.fileListContainer}>
        <Text style={styles.fileListTitle}>Available Files:</Text>
        {mockFiles.map((file, index) => (
          <View key={index} style={styles.fileItem}>
            <Text style={styles.fileIcon}>🎥</Text>
            <Text style={styles.fileName}>{file}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity style={styles.primaryButton} onPress={handleFileSelection}>
        <Text style={styles.primaryButtonText}>📁 Select Files</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCompressStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Compress Video Size</Text>
      <Text style={styles.stepDescription}>
        Compress selected videos to reduce file size for faster transfer
      </Text>
      
      <View style={styles.selectedFilesContainer}>
        <Text style={styles.selectedFilesTitle}>Selected Files:</Text>
        {selectedFiles.map((file, index) => (
          <View key={index} style={styles.selectedFileItem}>
            <Text style={styles.fileIcon}>🎥</Text>
            <Text style={styles.fileName}>{file}</Text>
          </View>
        ))}
      </View>
      
      {isCompressing ? (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.processingText}>Compressing videos...</Text>
          <Text style={styles.processingSubtext}>Size reduction in progress</Text>
        </View>
      ) : (
        <View style={styles.compressInfoContainer}>
          <Text style={styles.compressInfoTitle}>Compression Complete!</Text>
          <Text style={styles.compressInfoText}>
            Size reduced by 60% - Ready for sharing
          </Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={[styles.primaryButton, isCompressing && styles.disabledButton]} 
        onPress={handleCompress}
        disabled={isCompressing}
      >
        <Text style={styles.primaryButtonText}>
          {isCompressing ? 'Compressing...' : '🗜️ Compress Videos'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSharingStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Start Sharing</Text>
      <Text style={styles.stepDescription}>
        Share compressed videos with nearby student devices
      </Text>
      
      {isSharing ? (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.processingText}>Sharing to nearby devices...</Text>
          <Text style={styles.processingSubtext}>
            Students can now discover and download your files
          </Text>
        </View>
      ) : (
        <View style={styles.sharingInfoContainer}>
          <Text style={styles.sharingInfoTitle}>Ready to Share!</Text>
          <Text style={styles.sharingInfoText}>
            Your compressed videos are ready to be shared with students
          </Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={[styles.primaryButton, isSharing && styles.disabledButton]} 
        onPress={handleStartSharing}
        disabled={isSharing}
      >
        <Text style={styles.primaryButtonText}>
          {isSharing ? 'Sharing...' : '📤 Start Sharing'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Share Files</Text>
        <Text style={styles.subtitle}>Share videos with students via Bluetooth</Text>
      </View>

      <View style={styles.content}>
        {step === 'select' && renderSelectStep()}
        {step === 'compress' && renderCompressStep()}
        {step === 'sharing' && renderSharingStep()}
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
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  fileListContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fileListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  fileIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  fileName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  selectedFilesContainer: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  selectedFilesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  selectedFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  processingContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  processingSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  compressInfoContainer: {
    backgroundColor: '#d4edda',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  compressInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#155724',
    marginBottom: 8,
  },
  compressInfoText: {
    fontSize: 14,
    color: '#155724',
  },
  sharingInfoContainer: {
    backgroundColor: '#d1ecf1',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#bee5eb',
  },
  sharingInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0c5460',
    marginBottom: 8,
  },
  sharingInfoText: {
    fontSize: 14,
    color: '#0c5460',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: '#81C784',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TeacherOfflineTransferScreen;
