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
  ScrollView,
  Modal,
} from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import BluetoothManager, { VideoFile, CompressionSettings } from '../services/BluetoothManager';
import VideoPathModal from '../components/VideoPathModal';

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
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);
  const [availableVideos, setAvailableVideos] = useState<VideoFile[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressedVideo, setCompressedVideo] = useState<VideoFile | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<CompressionSettings['resolution']>('720p');
  const [showVideoPathModal, setShowVideoPathModal] = useState(false);
  const [videoPathCallback, setVideoPathCallback] = useState<((path: string) => void) | null>(null);

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

  // Load available videos on component mount
  useEffect(() => {
    loadAvailableVideos();
  }, []);

  const loadAvailableVideos = async () => {
    setIsLoadingVideos(true);
    try {
      const videos = await BluetoothManager.getVideoFiles();
      setAvailableVideos(videos);
    } catch (error) {
      Alert.alert('Error', 'Failed to load video files');
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const selectVideoFromDevice = async () => {
    try {
      // Create modal callback function
      const showModal = (onSelectVideo: (path: string) => void) => {
        setVideoPathCallback(() => onSelectVideo);
        setShowVideoPathModal(true);
      };

      const selectedVideo = await BluetoothManager.selectVideoFile(showModal).catch((error) => {
        console.error('Promise rejection in selectVideoFromDevice:', error);
        Alert.alert('Video Selection Error', 'Failed to select video. Please check permissions and try again.');
        return null;
      });
      
      if (selectedVideo) {
        setSelectedVideo(selectedVideo);
        setShowResolutionModal(true);
      }
    } catch (error) {
      console.error('Error in selectVideoFromDevice:', error);
      Alert.alert('Error', 'Failed to select video file. Please try again.');
    }
  };

  const handleVideoPathSelect = (path: string) => {
    if (videoPathCallback) {
      videoPathCallback(path);
      setVideoPathCallback(null);
    }
    setShowVideoPathModal(false);
  };

  const handleVideoPathClose = () => {
    setShowVideoPathModal(false);
    setVideoPathCallback(null);
  };

  const selectVideo = (video: VideoFile) => {
    setSelectedVideo(video);
    setShowResolutionModal(true);
  };

  const startCompression = () => {
    if (!selectedVideo) return;

    setIsCompressing(true);
    setCompressionProgress(0);
    setStep('compress');

    const compressionSettings: CompressionSettings = {
      resolution: selectedResolution,
      quality: 'medium',
      bitrate: 1000,
    };

    BluetoothManager.compressVideo(
      selectedVideo,
      compressionSettings,
      (progress) => {
        setCompressionProgress(progress);
      }
    ).then((compressed) => {
      setCompressedVideo(compressed);
      setIsCompressing(false);
      setStep('sharing');
    });
  };

  const startSharing = async () => {
    const hasPermission = await BluetoothManager.requestBluetoothPermissions();
    if (!hasPermission) return;

    const isEnabled = await BluetoothManager.isBluetoothEnabled();
    if (!isEnabled) {
      const enabled = await BluetoothManager.enableBluetooth();
      if (!enabled) {
        Alert.alert('Error', 'Failed to enable Bluetooth');
        return;
      }
    }

    setIsSharing(true);
    const serverStarted = await BluetoothManager.startServer();
    
    if (serverStarted) {
      Alert.alert(
        'Server Started',
        'Bluetooth server is now running. Students can discover and connect to your device.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Error', 'Failed to start Bluetooth server');
      setIsSharing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getCompressionRatio = () => {
    if (!selectedVideo || !compressedVideo) return 0;
    return Math.round(((selectedVideo.size - compressedVideo.size) / selectedVideo.size) * 100);
  };

  const openDownloadsFolder = async () => {
    try {
      await BluetoothManager.openDownloadsFolder();
    } catch (error) {
      console.error('Error opening downloads folder:', error);
      Alert.alert('Error', 'Could not open downloads folder. Please check manually in /storage/emulated/0/Download/');
    }
  };

  const renderSelectStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Video to Share</Text>
      <Text style={styles.stepDescription}>
        Choose a video from your device to share with students
      </Text>
      
      {isLoadingVideos ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading videos...</Text>
        </View>
      ) : (
        <>
          <TouchableOpacity style={styles.selectFromDeviceButton} onPress={selectVideoFromDevice}>
            <Text style={styles.selectFromDeviceButtonText}>📁 Select Video from Device</Text>
          </TouchableOpacity>

          <ScrollView style={styles.videoListContainer}>
            <Text style={styles.sampleVideosTitle}>Sample Videos (for demo):</Text>
            {availableVideos.map((video) => (
              <TouchableOpacity
                key={video.id}
                style={styles.videoItem}
                onPress={() => selectVideo(video)}
              >
                <View style={styles.videoInfo}>
                  <Text style={styles.videoName}>{video.name}</Text>
                  <Text style={styles.videoDetails}>
                    {formatFileSize(video.size)} • {formatDuration(video.duration)} • {video.resolution}
                  </Text>
                </View>
                <Text style={styles.selectButton}>Select</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );

  const renderCompressStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Compress Video</Text>
      <Text style={styles.stepDescription}>
        Compressing video to {selectedResolution} for faster transfer
      </Text>
      
      {selectedVideo && (
        <View style={styles.videoInfoContainer}>
          <Text style={styles.videoName}>{selectedVideo.name}</Text>
          <Text style={styles.videoDetails}>
            Original: {formatFileSize(selectedVideo.size)} • {selectedVideo.resolution}
          </Text>
          <Text style={styles.videoDetails}>
            Target: {selectedResolution} • Estimated: {formatFileSize(selectedVideo.size * 0.4)}
          </Text>
        </View>
      )}

      {isCompressing ? (
        <View style={styles.compressionContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.compressionText}>Compressing video...</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${compressionProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>{compressionProgress}%</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.actionButton} onPress={startCompression}>
          <Text style={styles.actionButtonText}>Start Compression</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSharingStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Share Video</Text>
      <Text style={styles.stepDescription}>
        Start Bluetooth server to share compressed video with students
      </Text>
      
      {compressedVideo && (
        <View style={styles.videoInfoContainer}>
          <Text style={styles.videoName}>{compressedVideo.name}</Text>
          <Text style={styles.videoDetails}>
            Size: {formatFileSize(compressedVideo.size)} • {compressedVideo.resolution}
          </Text>
          <Text style={styles.compressionInfo}>
            Size reduced by {getCompressionRatio()}%
          </Text>
          <Text style={styles.videoPath}>
            📂 Saved to: Downloads folder
          </Text>
        </View>
      )}

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.downloadButton]} 
          onPress={openDownloadsFolder}
        >
          <Text style={styles.actionButtonText}>📥 Open Downloads</Text>
        </TouchableOpacity>

        {isSharing ? (
          <View style={styles.sharingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.sharingText}>Bluetooth server is running...</Text>
            <Text style={styles.sharingSubtext}>
              Students can now discover and connect to your device
            </Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.actionButton} onPress={startSharing}>
            <Text style={styles.actionButtonText}>📤 Start Sharing</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderResolutionModal = () => (
    <Modal
      visible={showResolutionModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowResolutionModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Resolution</Text>
          <Text style={styles.modalDescription}>
            Choose the resolution for video compression
          </Text>
          
          {selectedVideo && (
            <View style={styles.originalInfo}>
              <Text style={styles.originalText}>
                Original: {formatFileSize(selectedVideo.size)} • {selectedVideo.resolution}
              </Text>
            </View>
          )}

          {['720p', '480p', '360p', '240p'].map((resolution) => (
            <TouchableOpacity
              key={resolution}
              style={[
                styles.resolutionOption,
                selectedResolution === resolution && styles.selectedResolution
              ]}
              onPress={() => setSelectedResolution(resolution as CompressionSettings['resolution'])}
            >
              <Text style={[
                styles.resolutionText,
                selectedResolution === resolution && styles.selectedResolutionText
              ]}>
                {resolution}
              </Text>
              <Text style={styles.resolutionSize}>
                ~{formatFileSize(selectedVideo ? selectedVideo.size * (resolution === '720p' ? 0.6 : resolution === '480p' ? 0.4 : resolution === '360p' ? 0.25 : 0.15) : 0)}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowResolutionModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                setShowResolutionModal(false);
                startCompression();
              }}
            >
              <Text style={styles.confirmButtonText}>Compress</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Teacher File Transfer</Text>
      </View>

      <View style={styles.stepIndicator}>
        <View style={[styles.stepDot, step === 'select' && styles.activeStepDot]} />
        <View style={[styles.stepDot, step === 'compress' && styles.activeStepDot]} />
        <View style={[styles.stepDot, step === 'sharing' && styles.activeStepDot]} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 'select' && renderSelectStep()}
        {step === 'compress' && renderCompressStep()}
        {step === 'sharing' && renderSharingStep()}
      </ScrollView>

      {renderResolutionModal()}

      
      <VideoPathModal
        visible={showVideoPathModal}
        onClose={handleVideoPathClose}
        onSelectVideo={handleVideoPathSelect}
      />
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: height * 0.02,
    backgroundColor: '#fff',
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
  activeStepDot: {
    backgroundColor: '#4CAF50',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: width * 0.05,
  },
  stepTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: width * 0.04,
    color: '#666',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.05,
  },
  loadingText: {
    fontSize: width * 0.04,
    color: '#666',
    marginTop: height * 0.02,
  },
  selectFromDeviceButton: {
    backgroundColor: '#4CAF50',
    padding: height * 0.02,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: height * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectFromDeviceButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  sampleVideosTitle: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#666',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  videoListContainer: {
    maxHeight: height * 0.5,
  },
  videoItem: {
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
  videoInfo: {
    flex: 1,
  },
  videoName: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  videoDetails: {
    fontSize: width * 0.035,
    color: '#666',
  },
  selectButton: {
    fontSize: width * 0.04,
    color: '#4CAF50',
    fontWeight: '600',
  },
  videoInfoContainer: {
    backgroundColor: '#fff',
    padding: width * 0.04,
    borderRadius: 12,
    marginBottom: height * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compressionContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.05,
  },
  compressionText: {
    fontSize: width * 0.045,
    color: '#333',
    marginTop: height * 0.02,
    marginBottom: height * 0.03,
  },
  progressBar: {
    width: '80%',
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
  progressText: {
    fontSize: width * 0.04,
    color: '#666',
  },
  compressionInfo: {
    fontSize: width * 0.035,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 4,
  },
  videoPath: {
    fontSize: width * 0.032,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  actionButtonsContainer: {
    gap: height * 0.015,
    alignItems: 'center',
  },
  downloadButton: {
    backgroundColor: '#2196F3',
  },
  sharingContainer: {
    alignItems: 'center',
    paddingVertical: height * 0.05,
  },
  sharingText: {
    fontSize: width * 0.045,
    color: '#333',
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
  },
  sharingSubtext: {
    fontSize: width * 0.035,
    color: '#666',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    padding: height * 0.02,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: width * 0.05,
    width: width * 0.9,
    maxHeight: height * 0.7,
  },
  modalTitle: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  modalDescription: {
    fontSize: width * 0.04,
    color: '#666',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  originalInfo: {
    backgroundColor: '#f0f0f0',
    padding: width * 0.03,
    borderRadius: 8,
    marginBottom: height * 0.02,
  },
  originalText: {
    fontSize: width * 0.035,
    color: '#666',
    textAlign: 'center',
  },
  resolutionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04,
    borderRadius: 8,
    marginBottom: height * 0.01,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedResolution: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
  },
  resolutionText: {
    fontSize: width * 0.045,
    color: '#333',
    fontWeight: '600',
  },
  selectedResolutionText: {
    color: '#4CAF50',
  },
  resolutionSize: {
    fontSize: width * 0.035,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.03,
  },
  cancelButton: {
    flex: 1,
    padding: height * 0.015,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: width * 0.02,
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: width * 0.04,
    color: '#666',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    padding: height * 0.015,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: width * 0.02,
    backgroundColor: '#4CAF50',
  },
  confirmButtonText: {
    fontSize: width * 0.04,
    color: '#fff',
    fontWeight: '600',
  },
});

export default TeacherOfflineTransferScreen;