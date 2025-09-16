import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import VideoDownloadCard from '../components/VideoDownloadCard';
import ResolutionSlider from '../components/ResolutionSlider';
import { VideoLesson, VideoResolution } from '../types';

// Mock data for demonstration
const mockLessons: VideoLesson[] = [
  {
    id: '1',
    title: 'Introduction to Fractions',
    description: 'Learn the basics of fractions with visual examples and interactive exercises. Perfect for beginners who want to understand how fractions work.',
    thumbnail: 'https://via.placeholder.com/400x200/4CAF50/FFFFFF?text=Fractions+Lesson',
    duration: 450, // 7:30
    downloadUrl: 'https://example.com/video1',
    availableResolutions: ['144p', '240p', '360p', '480p'],
    downloadedResolutions: [],
    isDownloaded: false,
    downloadProgress: 0,
    fileSize: {
      '144p': 2.5 * 1024 * 1024, // 2.5 MB
      '240p': 5.2 * 1024 * 1024, // 5.2 MB
      '360p': 8.7 * 1024 * 1024, // 8.7 MB
      '480p': 15.3 * 1024 * 1024, // 15.3 MB
      '720p': 0,
      '1080p': 0,
    },
  },
  {
    id: '2',
    title: 'Advanced Mathematics: Algebra Basics',
    description: 'Dive deeper into algebraic concepts with step-by-step problem solving techniques and real-world applications.',
    thumbnail: 'https://via.placeholder.com/400x200/2196F3/FFFFFF?text=Algebra+Lesson',
    duration: 720, // 12:00
    downloadUrl: 'https://example.com/video2',
    availableResolutions: ['144p', '240p', '360p', '480p', '720p'],
    downloadedResolutions: [],
    isDownloaded: false,
    downloadProgress: 0,
    fileSize: {
      '144p': 4.1 * 1024 * 1024, // 4.1 MB
      '240p': 8.3 * 1024 * 1024, // 8.3 MB
      '360p': 14.2 * 1024 * 1024, // 14.2 MB
      '480p': 24.8 * 1024 * 1024, // 24.8 MB
      '720p': 42.1 * 1024 * 1024, // 42.1 MB
      '1080p': 0,
    },
  },
  {
    id: '3',
    title: 'Science: Photosynthesis Explained',
    description: 'Discover how plants convert sunlight into energy through photosynthesis with engaging animations and experiments.',
    thumbnail: 'https://via.placeholder.com/400x200/FF9800/FFFFFF?text=Science+Lesson',
    duration: 380, // 6:20
    downloadUrl: 'https://example.com/video3',
    availableResolutions: ['144p', '240p', '360p'],
    downloadedResolutions: [],
    isDownloaded: false,
    downloadProgress: 0,
    fileSize: {
      '144p': 2.1 * 1024 * 1024, // 2.1 MB
      '240p': 4.3 * 1024 * 1024, // 4.3 MB
      '360p': 7.2 * 1024 * 1024, // 7.2 MB
      '480p': 0,
      '720p': 0,
      '1080p': 0,
    },
  },
];

const VideoDownloadScreen: React.FC = () => {
  const [lessons, setLessons] = useState<VideoLesson[]>(mockLessons);
  const [selectedResolution, setSelectedResolution] = useState<VideoResolution>('144p');
  const [refreshing, setRefreshing] = useState(false);

  const handleDownload = async (lessonId: string, resolution: VideoResolution) => {
    try {
      // Simulate download process
      setLessons(prevLessons =>
        prevLessons.map(lesson =>
          lesson.id === lessonId
            ? { ...lesson, downloadProgress: 0 }
            : lesson
        )
      );

      // Simulate download progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setLessons(prevLessons =>
          prevLessons.map(lesson =>
            lesson.id === lessonId
              ? { ...lesson, downloadProgress: progress }
              : lesson
          )
        );
      }

      // Mark as downloaded
      setLessons(prevLessons =>
        prevLessons.map(lesson =>
          lesson.id === lessonId
            ? {
                ...lesson,
                isDownloaded: true,
                downloadProgress: 100,
                downloadedResolutions: [...lesson.downloadedResolutions, resolution],
              }
            : lesson
        )
      );

      Alert.alert(
        'Download Complete!',
        `Lesson downloaded successfully in ${resolution} quality. AI upscaling is now available for enhanced viewing.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Download Failed', 'Please check your internet connection and try again.');
    }
  };

  const handlePlay = (lessonId: string) => {
    Alert.alert(
      'AI Upscaling Demo',
      'This would open the video player with AI upscaling enabled. The compressed video will be enhanced in real-time to provide HD-like quality while saving storage space.',
      [{ text: 'OK' }]
    );
  };

  const handleResolutionChange = (resolution: VideoResolution) => {
    setSelectedResolution(resolution);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getTotalStorageUsed = (): number => {
    return lessons.reduce((total, lesson) => {
      return total + lesson.downloadedResolutions.reduce((lessonTotal, resolution) => {
        return lessonTotal + lesson.fileSize[resolution];
      }, 0);
    }, 0);
  };

  const formatStorageSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📱 NabhaLearn</Text>
        <Text style={styles.headerSubtitle}>AI-Powered Offline Education</Text>
        <View style={styles.storageInfo}>
          <Text style={styles.storageText}>
            Storage Used: {formatStorageSize(getTotalStorageUsed())}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ResolutionSlider
          selectedResolution={selectedResolution}
          onResolutionChange={handleResolutionChange}
          availableResolutions={['144p', '240p', '360p', '480p', '720p']}
          fileSizes={{
            '144p': 2.5 * 1024 * 1024,
            '240p': 5.2 * 1024 * 1024,
            '360p': 8.7 * 1024 * 1024,
            '480p': 15.3 * 1024 * 1024,
            '720p': 25.8 * 1024 * 1024,
            '1080p': 0,
          }}
        />

        <View style={styles.lessonsContainer}>
          <Text style={styles.sectionTitle}>Available Lessons</Text>
          {lessons.map((lesson) => (
            <VideoDownloadCard
              key={lesson.id}
              lesson={lesson}
              onDownload={handleDownload}
              onPlay={handlePlay}
              selectedResolution={selectedResolution}
              onResolutionChange={handleResolutionChange}
            />
          ))}
        </View>

        <View style={styles.aiInfoContainer}>
          <Text style={styles.aiInfoTitle}>🤖 AI Video Upscaling</Text>
          <Text style={styles.aiInfoText}>
            Download videos in ultra-compressed 144p format to save 70-80% storage space.
            Our on-device AI will upscale them to HD quality in real-time during playback.
          </Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• 70-80% storage savings</Text>
            <Text style={styles.featureItem}>• Real-time AI upscaling</Text>
            <Text style={styles.featureItem}>• Works completely offline</Text>
            <Text style={styles.featureItem}>• HD-like quality from compressed videos</Text>
          </View>
        </View>
      </ScrollView>
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  storageInfo: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  storageText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  lessonsContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  aiInfoContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  aiInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  aiInfoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  featureList: {
    marginLeft: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 4,
    fontWeight: '500',
  },
});

export default VideoDownloadScreen;

