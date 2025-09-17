import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
  BackHandler,
  Platform,
  PermissionsAndroid,
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

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [userType, setUserType] = useState<'student' | 'teacher' | null>(null);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  // Request all necessary permissions when app opens
  const requestAllPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const androidVersion = Platform.Version;
        let allPermissions = [];

        // Bluetooth permissions
        if (androidVersion >= 31) {
          // Android 12+ (API 31+)
          allPermissions = [
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ];
        } else {
          // Android 11 and below
          allPermissions = [
            PermissionsAndroid.PERMISSIONS.BLUETOOTH,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ];
        }

        // Storage permissions
        if (androidVersion >= 33) {
          // Android 13+ (API 33+)
          allPermissions.push(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          );
        } else {
          // Android 12 and below
          allPermissions.push(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          );
        }

        // Request all permissions at once
        const granted = await PermissionsAndroid.requestMultiple(allPermissions);
        
        const allGranted = Object.values(granted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED
        );

        if (allGranted) {
          setPermissionsGranted(true);
          console.log('All permissions granted');
        } else {
          Alert.alert(
            'Permissions Required',
            'Some permissions were denied. The app may not work properly without all permissions. You can grant them later in settings.',
            [{ text: 'OK', onPress: () => setPermissionsGranted(true) }]
          );
        }
      } catch (error) {
        console.error('Permission request error:', error);
        Alert.alert(
          'Permission Error',
          'Failed to request permissions. You can grant them later in settings.',
          [{ text: 'OK', onPress: () => setPermissionsGranted(true) }]
        );
      }
    } else {
      setPermissionsGranted(true);
    }
  };

  // Request permissions when component mounts
  useEffect(() => {
    requestAllPermissions();
  }, []);

  const handleUserTypeSelection = (type: 'student' | 'teacher') => {
    setUserType(type);
    setShowLoginForm(true);
  };

  const handleLogin = () => {
    if (!userId.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both User ID and Password');
      return;
    }

    // Mock authentication - just navigate based on user type
    if (userType === 'student') {
      navigation.navigate('StudentDashboard', 'student');
    } else if (userType === 'teacher') {
      navigation.navigate('TeacherDashboard', 'teacher');
    }

    // Reset form
    setUserId('');
    setPassword('');
    setShowLoginForm(false);
    setUserType(null);
  };

  const handleBack = () => {
    if (showLoginForm) {
      // If we're on the login form, go back to role selection
      setShowLoginForm(false);
      setUserType(null);
      setUserId('');
      setPassword('');
    }
  };

  // Handle Android back button for login screen
  React.useEffect(() => {
    const backAction = () => {
      console.log('LoginScreen: Android back button pressed, showLoginForm:', showLoginForm);
      if (showLoginForm) {
        // If we're on the login form, go back to role selection
        console.log('LoginScreen: Going back to role selection');
        setShowLoginForm(false);
        setUserType(null);
        setUserId('');
        setPassword('');
        return true; // Indicate that back was handled
      } else {
        // If we're on role selection, let the app handle back (close app)
        console.log('LoginScreen: On role selection, letting system handle back');
        return false; // Let system handle back (close app)
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [showLoginForm]);

  if (showLoginForm) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>
            {userType === 'student' ? 'Student Login' : 'Teacher Login'}
          </Text>
          
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="User ID"
              placeholderTextColor="#999"
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCorrect={false}
            />
            
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.backButton} onPress={() => handleBack()}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>📱 NabhaLearn</Text>
          <Text style={styles.appSubtitle}>AI-Powered Education Platform</Text>
          {!permissionsGranted && (
            <Text style={styles.permissionText}>Requesting permissions...</Text>
          )}
        </View>

        <View style={styles.loginOptionsContainer}>
          <Text style={styles.selectText}>Select your role to continue:</Text>
          
          <TouchableOpacity
            style={styles.loginOption}
            onPress={() => handleUserTypeSelection('student')}
          >
            <Text style={styles.loginOptionIcon}>🎓</Text>
            <Text style={styles.loginOptionTitle}>Student Login</Text>
            <Text style={styles.loginOptionSubtitle}>Access lessons and AI chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginOption}
            onPress={() => handleUserTypeSelection('teacher')}
          >
            <Text style={styles.loginOptionIcon}>👨‍🏫</Text>
            <Text style={styles.loginOptionTitle}>Teacher Login</Text>
            <Text style={styles.loginOptionSubtitle}>Manage content and sync</Text>
          </TouchableOpacity>
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
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
  },
  header: {
    alignItems: 'center',
    marginBottom: height * 0.08,
  },
  appTitle: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.01,
  },
  appSubtitle: {
    fontSize: width * 0.04,
    color: '#666',
    textAlign: 'center',
  },
  permissionText: {
    fontSize: width * 0.035,
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: height * 0.01,
    fontStyle: 'italic',
  },
  loginOptionsContainer: {
    alignItems: 'center',
  },
  selectText: {
    fontSize: width * 0.045,
    color: '#333',
    marginBottom: height * 0.05,
    textAlign: 'center',
  },
  loginOption: {
    backgroundColor: '#fff',
    width: '100%',
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
    minHeight: height * 0.15,
    justifyContent: 'center',
  },
  loginOptionIcon: {
    fontSize: width * 0.12,
    marginBottom: height * 0.02,
  },
  loginOptionTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.01,
  },
  loginOptionSubtitle: {
    fontSize: width * 0.035,
    color: '#666',
    textAlign: 'center',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
  },
  loginTitle: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: height * 0.05,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: width * 0.08,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: width * 0.04,
    fontSize: width * 0.04,
    marginBottom: height * 0.025,
    backgroundColor: '#f9f9f9',
    color: '#333',
    textAlign: 'left',
    minHeight: height * 0.06,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    padding: height * 0.02,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: height * 0.02,
    minHeight: height * 0.06,
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  backButton: {
    padding: height * 0.02,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666',
    fontSize: width * 0.04,
  },
});

export default LoginScreen;
