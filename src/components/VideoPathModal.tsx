import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

interface VideoPathModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectVideo: (path: string) => void;
}

const VideoPathModal: React.FC<VideoPathModalProps> = ({
  visible,
  onClose,
  onSelectVideo,
}) => {
  const [videoPath, setVideoPath] = useState('/storage/emulated/0/Download/');

  const commonPaths = [
    '/storage/emulated/0/Download/',
    '/storage/emulated/0/Movies/',
    '/storage/emulated/0/DCIM/Camera/',
    '/storage/emulated/0/WhatsApp/Media/WhatsApp Video/',
    '/storage/emulated/0/Pictures/',
  ];

  const handleSelectVideo = () => {
    if (videoPath.trim()) {
      onSelectVideo(videoPath.trim());
      onClose();
    } else {
      Alert.alert('Error', 'Please enter a valid video file path.');
    }
  };

  const selectCommonPath = (path: string) => {
    setVideoPath(path);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>🎬 Select Video File</Text>
          
          <Text style={styles.subtitle}>
            Enter the complete path to your video file:
          </Text>

          <TextInput
            style={styles.textInput}
            value={videoPath}
            onChangeText={setVideoPath}
            placeholder="/storage/emulated/0/Download/myvideo.mp4"
            placeholderTextColor="#999"
            multiline={true}
            numberOfLines={2}
            autoFocus={true}
          />

          <Text style={styles.commonPathsTitle}>Quick Select Common Folders:</Text>
          
          <ScrollView style={styles.commonPathsContainer}>
            {commonPaths.map((path, index) => (
              <TouchableOpacity
                key={index}
                style={styles.commonPathButton}
                onPress={() => selectCommonPath(path)}
              >
                <Text style={styles.commonPathText}>{path}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Example paths:</Text>
            <Text style={styles.exampleText}>
              /storage/emulated/0/Download/myvideo.mp4{'\n'}
              /storage/emulated/0/Movies/vacation.mp4{'\n'}
              /storage/emulated/0/DCIM/Camera/VID_20240101.mp4
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.selectButton]}
              onPress={handleSelectVideo}
            >
              <Text style={styles.selectButtonText}>Select Video</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  commonPathsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  commonPathsContainer: {
    maxHeight: 120,
    marginBottom: 15,
  },
  commonPathButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  commonPathText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
  },
  exampleContainer: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  exampleTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  exampleText: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoPathModal;
