import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { VideoResolution } from '../types';

interface ResolutionSliderProps {
  selectedResolution: VideoResolution;
  onResolutionChange: (resolution: VideoResolution) => void;
  availableResolutions: VideoResolution[];
  fileSizes: { [key in VideoResolution]: number };
}

const { width } = Dimensions.get('window');

const resolutionOrder: VideoResolution[] = ['144p', '240p', '360p', '480p', '720p', '1080p'];

const ResolutionSlider: React.FC<ResolutionSliderProps> = ({
  selectedResolution,
  onResolutionChange,
  availableResolutions,
  fileSizes,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Download Resolution</Text>
      
      <View style={styles.sliderContainer}>
        <Text style={styles.qualityLabel}>Choose Quality:</Text>
        <View style={styles.resolutionButtons}>
          {availableResolutions.map((resolution) => (
            <TouchableOpacity
              key={resolution}
              style={[
                styles.resolutionButton,
                selectedResolution === resolution && styles.selectedResolutionButton,
              ]}
              onPress={() => onResolutionChange(resolution)}
            >
              <Text
                style={[
                  styles.resolutionText,
                  selectedResolution === resolution && styles.selectedResolutionText,
                ]}
              >
                {resolution}
              </Text>
              <Text style={styles.fileSizeText}>
                {formatFileSize(fileSizes[resolution])}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Selected: {selectedResolution}</Text>
        <Text style={styles.infoText}>
          File Size: {formatFileSize(fileSizes[selectedResolution])}
        </Text>
        <Text style={styles.infoSubtext}>
          {selectedResolution === '144p' 
            ? 'Ultra-compressed for maximum storage savings'
            : selectedResolution === '720p' || selectedResolution === '1080p'
            ? 'High quality - AI upscaling recommended'
            : 'Balanced quality and storage'
          }
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  sliderContainer: {
    marginBottom: 20,
  },
  qualityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  resolutionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 8,
  },
  resolutionButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    margin: 4,
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedResolutionButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  resolutionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  selectedResolutionText: {
    color: '#fff',
  },
  fileSizeText: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default ResolutionSlider;
