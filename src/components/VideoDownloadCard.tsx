import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { VideoLesson, VideoResolution } from '../types';

interface VideoDownloadCardProps {
  lesson: VideoLesson;
  onDownload: (lessonId: string, resolution: VideoResolution) => void;
  onPlay: (lessonId: string) => void;
  selectedResolution: VideoResolution;
  onResolutionChange: (resolution: VideoResolution) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width - 32;

const VideoDownloadCard: React.FC<VideoDownloadCardProps> = ({
  lesson,
  onDownload,
  onPlay,
  selectedResolution,
  onResolutionChange,
}) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isDownloading = lesson.downloadProgress > 0 && lesson.downloadProgress < 100;
  const isDownloaded = lesson.isDownloaded;

  return (
    <View style={styles.container}>
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: lesson.thumbnail }} style={styles.thumbnail} />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{formatDuration(lesson.duration)}</Text>
        </View>
        {isDownloaded && (
          <View style={styles.downloadedBadge}>
            <Text style={styles.downloadedText}>✓ Downloaded</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {lesson.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {lesson.description}
        </Text>

        <View style={styles.resolutionSelector}>
          <Text style={styles.resolutionLabel}>Download Quality:</Text>
          <View style={styles.resolutionButtons}>
            {lesson.availableResolutions.map((resolution) => (
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
                  {formatFileSize(lesson.fileSize[resolution])}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {isDownloading && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${lesson.downloadProgress}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {lesson.downloadProgress.toFixed(0)}%
            </Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          {isDownloaded ? (
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => onPlay(lesson.id)}
            >
              <Text style={styles.playButtonText}>▶ Play Video</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.downloadButton, isDownloading && styles.downloadingButton]}
              onPress={() => onDownload(lesson.id, selectedResolution)}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.downloadButtonText}>📥 Download</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  downloadedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  downloadedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  resolutionSelector: {
    marginBottom: 16,
  },
  resolutionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  resolutionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  resolutionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedResolutionButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
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
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  downloadButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  downloadingButton: {
    backgroundColor: '#81C784',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  playButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default VideoDownloadCard;

