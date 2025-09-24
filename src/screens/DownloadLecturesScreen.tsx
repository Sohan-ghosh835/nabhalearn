import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  FlatList,
  Image,
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

type Quality = '360p' | '480p' | '720p' | '1080p';

interface VideoItem {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  availableQualities: Quality[];
}

const DUMMY_VIDEOS: VideoItem[] = [
  {
    id: 'vid1',
    title: 'Introduction to Fractions',
    duration: '12:34',
    thumbnail: 'https://placehold.co/320x180?text=Math',
    availableQualities: ['360p', '480p', '720p'],
  },
  {
    id: 'vid2',
    title: 'Photosynthesis Explained',
    duration: '09:12',
    thumbnail: 'https://placehold.co/320x180?text=Science',
    availableQualities: ['360p', '480p', '720p', '1080p'],
  },
  {
    id: 'vid3',
    title: 'English Grammar: Tenses',
    duration: '15:03',
    thumbnail: 'https://placehold.co/320x180?text=English',
    availableQualities: ['360p', '480p'],
  },
];

const DownloadLecturesScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedQuality, setSelectedQuality] = useState<Record<string, Quality>>({});

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => sub.remove();
  }, [navigation]);

  const renderQuality = (video: VideoItem) => {
    const current = selectedQuality[video.id] || video.availableQualities[0];
    return (
      <View style={styles.qualityRow}>
        {video.availableQualities.map(q => (
          <TouchableOpacity
            key={q}
            onPress={() => setSelectedQuality(prev => ({ ...prev, [video.id]: q }))}
            style={[styles.qualityChip, current === q ? styles.qualityChipActive : null]}
          >
            <Text style={[styles.qualityText, current === q ? styles.qualityTextActive : null]}>{q}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderItem = ({ item }: { item: VideoItem }) => {
    return (
      <View style={styles.videoCard}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{item.title}</Text>
          <Text style={styles.videoDuration}>{item.duration}</Text>
          {renderQuality(item)}
          <TouchableOpacity style={styles.downloadButton} onPress={() => {}}>
            <Text style={styles.downloadButtonText}>Download</Text>
          </TouchableOpacity>
        </View>
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
        <Text style={styles.headerTitle}>Download Lectures</Text>
      </View>
      <FlatList
        data={DUMMY_VIDEOS}
        keyExtractor={(v) => v.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
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
    paddingVertical: height * 0.03,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  headerTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  listContent: {
    padding: width * 0.05,
    paddingBottom: height * 0.1,
  },
  videoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: height * 0.02,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  thumbnail: {
    width: '100%',
    height: width * (9 / 16),
    backgroundColor: '#dee2e6',
  },
  videoInfo: {
    padding: 14,
    gap: 8,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
  },
  videoDuration: {
    fontSize: 12,
    color: '#6c757d',
  },
  qualityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  qualityChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#fff',
  },
  qualityChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  qualityText: {
    fontSize: 12,
    color: '#212529',
  },
  qualityTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  downloadButton: {
    marginTop: 6,
    backgroundColor: '#28a745',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default DownloadLecturesScreen;


