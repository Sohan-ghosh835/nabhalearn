import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { sendChatMessages, ChatMessage } from '../services/ChatService';

type ScreenName = keyof RootStackParamList;

interface Props {
  navigation: {
    navigate: (screenName: ScreenName) => void;
    goBack: () => void;
  };
}

const { width, height } = Dimensions.get('window');

const AIChatScreen: React.FC<Props> = ({ navigation }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi! I am your NabhaLearn AI assistant. How can I help you today?' },
  ]);
  const [input, setInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      console.log('AIChatScreen: Android back button pressed');
      navigation.goBack();
      return true; // Indicate that back was handled
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  const onSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    const userMsg: ChatMessage = { role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      const response = await sendChatMessages([...messages, userMsg], controller.signal);
      setMessages(prev => [...prev, response.message]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Sorry, I ran into an error: ${err?.message || 'Unknown error'}` },
      ]);
    } finally {
      setIsSending(false);
      abortControllerRef.current = null;
    }
  }, [input, isSending, messages]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Chat</Text>
      </View>

      <KeyboardAvoidingView style={styles.chatContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.messagesScroll} contentContainerStyle={styles.messagesContainer}>
          {messages.map((m, idx) => (
            <View key={idx} style={[styles.messageBubble, m.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
              <Text style={[styles.messageText, m.role === 'user' ? styles.userText : styles.assistantText]}>{m.content}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputBox}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message"
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, isSending ? styles.sendButtonDisabled : null]}
            onPress={onSend}
            disabled={isSending}
          >
            <Text style={styles.sendButtonText}>{isSending ? '...' : 'Send'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  chatContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.03,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: width * 0.02,
    gap: 10,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9ECEF',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: '#212529',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingTop: 8,
  },
  inputBox: {
    flex: 1,
    minHeight: 44,
    maxHeight: 140,
    backgroundColor: '#fff',
    borderColor: '#dee2e6',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sendButton: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#94d3a2',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AIChatScreen;
