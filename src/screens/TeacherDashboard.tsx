import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  BackHandler,
} from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';

type ScreenName = keyof RootStackParamList;

interface Props {
  navigation: {
    navigate: (screenName: ScreenName, userType?: 'student' | 'teacher') => void;
    goBack: () => void;
  };
}

const { width, height } = Dimensions.get('window');

const TeacherDashboard: React.FC<Props> = ({ navigation }) => {
  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      console.log('TeacherDashboard: Android back button pressed');
      navigation.goBack();
      return true; // Indicate that back was handled
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Welcome, Teacher! 👨‍🏫</Text>
        <Text style={styles.subtitle}>Manage your classroom and content</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate('SyncProgress')}
          >
            <Text style={styles.optionIcon}>🔄</Text>
            <Text style={styles.optionTitle}>Sync</Text>
            <Text style={styles.optionDescription}>
              Sync student progress and update content
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate('FileTransfer', 'teacher')}
          >
            <Text style={styles.optionIcon}>📁</Text>
            <Text style={styles.optionTitle}>File Transfer</Text>
            <Text style={styles.optionDescription}>
              Share videos and files with students
            </Text>
          </TouchableOpacity>
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
  welcomeText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#666',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  optionsContainer: {
    padding: width * 0.05,
    paddingBottom: height * 0.1,
  },
  optionCard: {
    backgroundColor: '#fff',
    padding: width * 0.08,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: height * 0.025,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    minHeight: height * 0.2,
    justifyContent: 'center',
  },
  optionIcon: {
    fontSize: width * 0.12,
    marginBottom: height * 0.02,
  },
  optionTitle: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.015,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: width * 0.035,
    color: '#666',
    textAlign: 'center',
    lineHeight: height * 0.025,
    paddingHorizontal: width * 0.02,
  },
});

export default TeacherDashboard;
