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
import { RootStackParamList } from '../navigation/AppNavigator';

type ScreenName = keyof RootStackParamList;

interface Props {
  navigation: {
    navigate: (screenName: ScreenName) => void;
    goBack: () => void;
  };
}

const { width, height } = Dimensions.get('window');

const CloudTransferScreen: React.FC<Props> = ({ navigation }) => {
  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      console.log('CloudTransferScreen: Android back button pressed');
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
        <Text style={styles.headerTitle}>Cloud Transfer</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>☁️</Text>
        </View>
        
        <Text style={styles.title}>Cloud Transfer</Text>
        <Text style={styles.subtitle}>Upload not implemented</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            This feature will allow you to:
          </Text>
          <Text style={styles.featureItem}>• Upload files to the cloud</Text>
          <Text style={styles.featureItem}>• Download files from the cloud</Text>
          <Text style={styles.featureItem}>• Sync across multiple devices</Text>
          <Text style={styles.featureItem}>• Access files from anywhere</Text>
        </View>
        
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            🚧 Coming Soon 🚧
          </Text>
          <Text style={styles.placeholderSubtext}>
            Cloud transfer functionality will be implemented in a future update
          </Text>
        </View>
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
  headerTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
  },
  iconContainer: {
    marginBottom: height * 0.04,
  },
  icon: {
    fontSize: width * 0.2,
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.015,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width * 0.045,
    color: '#666',
    marginBottom: height * 0.05,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: width * 0.06,
    borderRadius: 16,
    marginBottom: height * 0.04,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  infoText: {
    fontSize: width * 0.04,
    color: '#333',
    marginBottom: height * 0.02,
    fontWeight: '600',
  },
  featureItem: {
    fontSize: width * 0.035,
    color: '#666',
    marginBottom: height * 0.01,
    lineHeight: height * 0.025,
  },
  placeholderContainer: {
    backgroundColor: '#fff3cd',
    padding: width * 0.05,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffeaa7',
    width: '100%',
  },
  placeholderText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#856404',
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  placeholderSubtext: {
    fontSize: width * 0.035,
    color: '#856404',
    textAlign: 'center',
    lineHeight: height * 0.025,
  },
});

export default CloudTransferScreen;
