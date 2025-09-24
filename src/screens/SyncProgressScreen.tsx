import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  BackHandler,
} from 'react-native';
import { ScrollView } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';

type ScreenName = keyof RootStackParamList;

interface Props {
  navigation: {
    navigate: (screenName: ScreenName) => void;
    goBack: () => void;
  };
}

const { width, height } = Dimensions.get('window');

const SyncProgressScreen: React.FC<Props> = ({ navigation }) => {
  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      console.log('SyncProgressScreen: Android back button pressed');
      navigation.goBack();
      return true; // Indicate that back was handled
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  // prototype data
  const overview = {
    totalStudyTime: '5h 42m this week',
    lessonsCompleted: 12,
    quizzesPassed: 7,
    currentStreakDays: 4,
  };

  const topics = [
    { name: 'Mathematics', time: '1h 50m', completion: 0.72 },
    { name: 'Science', time: '1h 15m', completion: 0.58 },
    { name: 'English', time: '52m', completion: 0.41 },
    { name: 'History', time: '38m', completion: 0.3 },
  ];

  const activity = [
    { label: 'Quiz: Fractions Basics', result: '8/10', when: 'Today, 10:15 AM' },
    { label: 'Lesson: Photosynthesis', result: 'Completed', when: 'Yesterday, 6:20 PM' },
    { label: 'Practice: Grammar - Tenses', result: '15 mins', when: 'Yesterday, 4:05 PM' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sync Progress</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.cardRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{overview.totalStudyTime}</Text>
              <Text style={styles.statLabel}>Time Spent</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{overview.lessonsCompleted}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
          </View>
          <View style={styles.cardRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{overview.quizzesPassed}</Text>
              <Text style={styles.statLabel}>Quizzes Passed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{overview.currentStreakDays} days</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Topics</Text>
          {topics.map((t, i) => (
            <View key={i} style={styles.topicCard}>
              <View style={styles.topicHeader}>
                <Text style={styles.topicName}>{t.name}</Text>
                <Text style={styles.topicTime}>{t.time}</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressBar, { width: `${Math.round(t.completion * 100)}%` }]} />
              </View>
              <Text style={styles.progressLabel}>{Math.round(t.completion * 100)}% complete</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {activity.map((a, i) => (
            <View key={i} style={styles.activityRow}>
              <View style={styles.activityDot} />
              <View style={styles.activityTextWrap}>
                <Text style={styles.activityLabel}>{a.label} — <Text style={styles.activityResult}>{a.result}</Text></Text>
                <Text style={styles.activityWhen}>{a.when}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.syncCard}>
          <Text style={styles.syncTitle}>✅ Sync Complete</Text>
          <Text style={styles.syncSubtitle}>All data synchronized successfully</Text>
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
  headerTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: width * 0.05,
    gap: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: width * 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#6c757d',
  },
  topicCard: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  topicName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
  },
  topicTime: {
    fontSize: 13,
    color: '#6c757d',
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  progressLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#6c757d',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28a745',
    marginRight: 10,
  },
  activityTextWrap: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 14,
    color: '#212529',
  },
  activityResult: {
    fontWeight: '700',
  },
  activityWhen: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  syncCard: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  syncTitle: {
    color: '#155724',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  syncSubtitle: {
    color: '#155724',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default SyncProgressScreen;
