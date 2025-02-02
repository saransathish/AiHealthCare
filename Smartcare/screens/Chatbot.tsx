// ChatBot.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language?: string;
}

interface ChatResponse {
  success: boolean;
  response: string;
  language?: string;
}

interface QuestionData {
  query: string;
  session_id: string;
}

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingMessage, setCurrentSpeakingMessage] = useState<number | null>(null);
  const [ttsReady, setTtsReady] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const waveAnimation = useRef(new Animated.Value(0)).current;

  // Initialize TTS
  useEffect(() => {
    const initTts = async () => {
      try {
        await Tts.getInitStatus();
        Tts.setDefaultRate(0.5);
        Tts.setDefaultPitch(1.0);
        await Tts.setDefaultLanguage('en-US');
        
        Tts.addEventListener('tts-start', onTtsStart);
        Tts.addEventListener('tts-finish', onTtsFinish);
        Tts.addEventListener('tts-error', onTtsError);
        
        setTtsReady(true);
      } catch (err) {
        console.error('TTS initialization failed:', err);
        setTtsReady(false);
      }
    };

    initTts();

    return () => {
      Tts.removeEventListener('tts-start', onTtsStart);
      Tts.removeEventListener('tts-finish', onTtsFinish);
      Tts.removeEventListener('tts-error', onTtsError);
    };
  }, []);

  // Initialize Voice Recognition
  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // Initialize session and load chat history
  useEffect(() => {
    initializeSession();
    startWaveAnimation();
  }, []);

  // Save messages to storage when updated
  useEffect(() => {
    if (messages.length > 0) {
      AsyncStorage.setItem('medical_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const startWaveAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnimation, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const initializeSession = async () => {
    try {
      const savedSessionId = await AsyncStorage.getItem('medical_session_id');
      const newSessionId = savedSessionId || uuidv4();
      if (!savedSessionId) {
        await AsyncStorage.setItem('medical_session_id', newSessionId);
      }
      setSessionId(newSessionId);

      const savedChat = await AsyncStorage.getItem('medical_chat_history');
      if (savedChat) {
        setMessages(JSON.parse(savedChat));
      }
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  };

  // TTS Event Handlers
  const onTtsStart = () => setIsSpeaking(true);
  const onTtsFinish = () => {
    setIsSpeaking(false);
    setCurrentSpeakingMessage(null);
  };
  const onTtsError = (err: any) => {
    console.error('TTS error:', err);
    setIsSpeaking(false);
    setCurrentSpeakingMessage(null);
  };

  // Voice Recognition Handlers
  const onSpeechResults = (e: SpeechResultsEvent) => {
    if (e.value) {
      setInputMessage(e.value[0]);
    }
  };

  const onSpeechError = (e: any) => {
    console.error('Speech recognition error:', e);
    setIsListening(false);
  };

  const toggleSpeechRecognition = async () => {
    try {
      if (isListening) {
        await Voice.stop();
        setIsListening(false);
      } else {
        await Voice.start('en-US');
        setIsListening(true);
        setInputMessage('');
      }
    } catch (error) {
      console.error('Error toggling speech recognition:', error);
    }
  };

  const speakMessage = async (message: string, index: number, language?: string) => {
    if (!ttsReady) {
      console.warn('TTS is not ready yet');
      return;
    }

    try {
      if (isSpeaking && currentSpeakingMessage === index) {
        await Tts.stop();
        setIsSpeaking(false);
        setCurrentSpeakingMessage(null);
        return;
      }

      if (language) {
        try {
          await Tts.setDefaultLanguage(language);
        } catch (langError) {
          console.warn('Language not supported, falling back to en-US:', langError);
          await Tts.setDefaultLanguage('en-US');
        }
      }

      setCurrentSpeakingMessage(index);
      await Tts.speak(message);
    } catch (error) {
      console.error('Error speaking message:', error);
      setIsSpeaking(false);
      setCurrentSpeakingMessage(null);
    }
  };

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const clearConversation = async () => {
    setMessages([]);
    const newSessionId = uuidv4();
    await AsyncStorage.setItem('medical_session_id', newSessionId);
    setSessionId(newSessionId);
    await AsyncStorage.removeItem('medical_chat_history');
  };

  const getChatbotResponse = async (data: QuestionData): Promise<ChatResponse> => {
    try {
      // Implement your API call here
      // This is a mock response - replace with actual API call
      return {
        success: true,
        response: "This is a mock response. Implement actual API integration here.",
        language: "en-US"
      };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    if (isListening) {
      await Voice.stop();
      setIsListening(false);
    }

    const newUserMessage = {
      role: 'user' as const,
      content: userMessage,
      timestamp: formatTimestamp()
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await getChatbotResponse({
        query: userMessage,
        session_id: sessionId
      });
      
      if (response.success) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: response.response,
            timestamp: formatTimestamp(),
            language: response.language
          }
        ]);
      } else {
        setError(response.response);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSpeakButton = (message: Message, index: number) => {
    if (!ttsReady) return null;

    return (
      <TouchableOpacity
        onPress={() => speakMessage(message.content, index, message.language)}
        style={styles.speakButton}
      >
        <Icon
          name={isSpeaking && currentSpeakingMessage === index ? 'volume-off' : 'volume-high'}
          size={20}
          color="#6b7280"
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#033d9a', '#1051e9']}
        style={styles.header}
      >
        <Text style={styles.headerIcon}>👨‍⚕️</Text>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>SmartCare Medical Assistant</Text>
          <Text style={styles.connectionStatus}>
            {error ? 'Connection Error' : 'Connected'}
          </Text>
        </View>
        <TouchableOpacity onPress={clearConversation} style={styles.clearButton}>
          <Icon name="delete" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? (
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Hello! 👋</Text>
              <Text style={styles.welcomeText}>
                I'm SmartCare, your medical assistant. I can help you with medical-related questions.
              </Text>
              <Text style={styles.disclaimer}>
                Note: I provide general medical information only. Always consult with a healthcare 
                professional for specific medical advice.
              </Text>
            </View>
          ) : (
            messages.map((message, index) => (
              <View
                key={`${message.timestamp}-${index}`}
                style={[
                  styles.messageWrapper,
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage
                ]}
              >
                <LinearGradient
                  colors={
                    message.role === 'user' 
                      ? ['#033d9a', '#1051e9']
                      : ['#ffffff', '#ffffff']
                  }
                  style={[
                    styles.messageContent,
                    message.role === 'user' ? styles.userMessageGradient : styles.assistantMessageGradient
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    message.role === 'user' ? styles.userMessageText : styles.assistantMessageText
                  ]}>
                    {message.content}
                  </Text>
                  {message.role === 'assistant' && renderSpeakButton(message, index)}
                  <Text style={[
                    styles.timestamp,
                    message.role === 'user' ? styles.userTimestamp : styles.assistantTimestamp
                  ]}>
                    {message.timestamp}
                  </Text>
                </LinearGradient>
              </View>
            ))
          )}

          {isListening && (
            <View style={styles.listeningIndicator}>
              {[...Array(5)].map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.listeningWave,
                    {
                      transform: [{
                        scaleY: waveAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        })
                      }]
                    }
                  ]}
                />
              ))}
              <Text style={styles.listeningText}>Listening...</Text>
            </View>
          )}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#033d9a" />
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => handleSubmit()}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Type your medical question here..."
            placeholderTextColor="#9ca3af"
            multiline
          />
          <TouchableOpacity
            onPress={toggleSpeechRecognition}
            style={[
              styles.micButton,
              isListening && styles.micButtonListening
            ]}
          >
            <Icon
              name={isListening ? 'stop-circle' : 'microphone'}
              size={24}
              color={isListening ? 'white' : '#374151'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!inputMessage.trim() || isLoading}
            style={[
              styles.sendButton,
              (!inputMessage.trim() || isLoading) && styles.sendButtonDisabled
            ]}
          >
            <Icon name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatBot;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  connectionStatus: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  clearButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  welcomeContainer: {
    alignItems: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 8,
  },
  disclaimer: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  messageWrapper: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  // Continuation of styles...
  userMessageGradient: {
    borderBottomRightRadius: 4,
  },
  assistantMessageGradient: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  assistantMessageText: {
    color: '#1f2937',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'right',
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  assistantTimestamp: {
    color: '#9ca3af',
  },
  speakButton: {
    padding: 8,
    marginLeft: 8,
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 4,
  },
  listeningWave: {
    width: 3,
    height: 20,
    backgroundColor: '#ef4444',
    marginHorizontal: 2,
    borderRadius: 1.5,
  },
  listeningText: {
    marginLeft: 12,
    color: '#374151',
    fontSize: 14,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1f2937',
    maxHeight: 100,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonListening: {
    backgroundColor: '#ef4444',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#033d9a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
