// // ChatbotScreen.tsx
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Platform,
//   KeyboardAvoidingView,
//   SafeAreaView,
//   Animated,
//   Alert,
// } from 'react-native';
// import { Audio } from 'expo-av';
// import * as Speech from 'expo-speech';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import uuid from 'react-native-uuid';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { getChatbotResponse, ChatResponse } from '../utils/api';
// import { LinearGradient } from 'expo-linear-gradient';

// interface Message {
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: string;
//   language?: string;
// }

// const Chatbot: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [sessionId, setSessionId] = useState<string>('');
//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [currentSpeakingMessage, setCurrentSpeakingMessage] = useState<number | null>(null);
  
//   const scrollViewRef = useRef<ScrollView>(null);
//   const loadingAnimation = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     initializeSession();
//     loadChatHistory();
//   }, []);

//   useEffect(() => {
//     if (messages.length > 0) {
//       saveChatHistory();
//       scrollToBottom();
//     }
//   }, [messages]);

//   const initializeSession = async () => {
//     try {
//       const savedSessionId = await AsyncStorage.getItem('medical_session_id');
//       if (!savedSessionId) {
//         const newSessionId = uuid.v4().toString();
//         await AsyncStorage.setItem('medical_session_id', newSessionId);
//         setSessionId(newSessionId);
//       } else {
//         setSessionId(savedSessionId);
//       }
//     } catch (error) {
//       console.error('Session initialization error:', error);
//     }
//   };

//   const loadChatHistory = async () => {
//     try {
//       const savedChat = await AsyncStorage.getItem('medical_chat_history');
//       if (savedChat) {
//         setMessages(JSON.parse(savedChat));
//       }
//     } catch (error) {
//       console.error('Error loading chat history:', error);
//     }
//   };

//   const saveChatHistory = async () => {
//     try {
//       await AsyncStorage.setItem('medical_chat_history', JSON.stringify(messages));
//     } catch (error) {
//       console.error('Error saving chat history:', error);
//     }
//   };

//   const scrollToBottom = () => {
//     scrollViewRef.current?.scrollToEnd({ animated: true });
//   };

//   const formatTimestamp = () => {
//     return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const startLoading = () => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(loadingAnimation, {
//           toValue: 1,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(loadingAnimation, {
//           toValue: 0,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   };

//   const stopLoading = () => {
//     loadingAnimation.stopAnimation();
//     loadingAnimation.setValue(0);
//   };

//   const handleSpeech = async (message: string, index: number) => {
//     if (isSpeaking && currentSpeakingMessage === index) {
//       Speech.stop();
//       setIsSpeaking(false);
//       setCurrentSpeakingMessage(null);
//       return;
//     }

//     setIsSpeaking(true);
//     setCurrentSpeakingMessage(index);
    
//     try {
//       await Speech.speak(message, {
//         onDone: () => {
//           setIsSpeaking(false);
//           setCurrentSpeakingMessage(null);
//         },
//         onError: () => {
//           setIsSpeaking(false);
//           setCurrentSpeakingMessage(null);
//           Alert.alert('Error', 'Failed to speak message');
//         },
//       });
//     } catch (error) {
//       console.error('Speech error:', error);
//       Alert.alert('Error', 'Failed to speak message');
//     }
//   };

//   const clearConversation = async () => {
//     try {
//       const newSessionId = uuid.v4().toString();
//       await AsyncStorage.setItem('medical_session_id', newSessionId);
//       await AsyncStorage.removeItem('medical_chat_history');
//       setSessionId(newSessionId);
//       setMessages([]);
//     } catch (error) {
//       console.error('Error clearing conversation:', error);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!inputMessage.trim() || isLoading) return;

//     const userMessage = inputMessage.trim();
//     setInputMessage('');
//     setIsLoading(true);
//     setError(null);
//     startLoading();

//     const newUserMessage = {
//       role: 'user' as const,
//       content: userMessage,
//       timestamp: formatTimestamp(),
//     };

//     setMessages(prev => [...prev, newUserMessage]);

//     try {
//       const response = await getChatbotResponse({
//         query: userMessage,
//         session_id: sessionId,
//       });

//       if (response.success) {
//         setMessages(prev => [
//           ...prev,
//           {
//             role: 'assistant',
//             content: response.response,
//             timestamp: formatTimestamp(),
//             language: response.language,
//           },
//         ]);
//       } else {
//         setError(response.response);
//       }
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//       stopLoading();
//     }
//   };

//   const renderMessage = (message: Message, index: number) => (
//     <Animated.View
//       key={`${message.timestamp}-${index}`}
//       style={[
//         styles.messageContainer,
//         message.role === 'user' ? styles.userMessage : styles.assistantMessage,
//       ]}
//     >
//       <View style={styles.messageContent}>
//         <Text style={[
//           styles.messageText,
//           message.role === 'user' ? styles.userMessageText : styles.assistantMessageText
//         ]}>
//           {message.content}
//         </Text>
//         {message.role === 'assistant' && (
//           <TouchableOpacity
//             onPress={() => handleSpeech(message.content, index)}
//             style={styles.speakButton}
//           >
//             <Icon
//               name={isSpeaking && currentSpeakingMessage === index ? 'volume-off' : 'volume-high'}
//               size={20}
//               color={isSpeaking && currentSpeakingMessage === index ? '#ef4444' : '#6b7280'}
//             />
//           </TouchableOpacity>
//         )}
//       </View>
//       <Text style={styles.timestamp}>{message.timestamp}</Text>
//     </Animated.View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <LinearGradient
//         colors={['#033d9a', '#1051e9']}
//         style={styles.header}
//       >
//         <View style={styles.headerContent}>
//           <Text style={styles.headerIcon}>👨‍⚕️</Text>
//           <View style={styles.headerTextContainer}>
//             <Text style={styles.headerTitle}>SmartCare Medical Assistant</Text>
//             <Text style={styles.headerStatus}>
//               {error ? 'Connection Error' : 'Connected'}
//             </Text>
//           </View>
//           <TouchableOpacity onPress={clearConversation} style={styles.clearButton}>
//             <Icon name="delete" size={24} color="white" />
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>

//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.chatContainer}
//       >
//         <ScrollView
//           ref={scrollViewRef}
//           style={styles.messagesContainer}
//           contentContainerStyle={styles.messagesContent}
//         >
//           {messages.length === 0 ? (
//             <View style={styles.welcomeContainer}>
//               <Text style={styles.welcomeTitle}>Hello! 👋</Text>
//               <Text style={styles.welcomeText}>
//                 I'm SmartCare, your medical assistant. I can help you with medical-related questions.
//               </Text>
//               <Text style={styles.disclaimer}>
//                 Note: I provide general medical information only. Always consult with a healthcare
//                 professional for specific medical advice.
//               </Text>
//             </View>
//           ) : (
//             messages.map((message, index) => renderMessage(message, index))
//           )}
          
//           {isLoading && (
//             <View style={styles.loadingContainer}>
//               <Animated.View style={styles.loadingDots}>
//                 {[0, 1, 2].map(i => (
//                   <Animated.View
//                     key={i}
//                     style={[
//                       styles.dot,
//                       {
//                         opacity: loadingAnimation.interpolate({
//                           inputRange: [0, 1],
//                           outputRange: [0.3, 0.7],
//                         }),
//                       },
//                     ]}
//                   />
//                 ))}
//               </Animated.View>
//             </View>
//           )}
//         </ScrollView>

//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             value={inputMessage}
//             onChangeText={setInputMessage}
//             placeholder="Type your medical question here..."
//             placeholderTextColor="#9ca3af"
//             multiline
//             maxLength={1000}
//             editable={!isLoading}
//           />
//           <TouchableOpacity
//             onPress={handleSubmit}
//             disabled={!inputMessage.trim() || isLoading}
//             style={[styles.sendButton, !inputMessage.trim() && styles.sendButtonDisabled]}
//           >
//             <Icon name="send" size={24} color="white" />
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f7fb',
//   },
//   header: {
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   headerIcon: {
//     fontSize: 24,
//     marginRight: 12,
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   headerTitle: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   headerStatus: {
//     color: 'rgba(255, 255, 255, 0.8)',
//     fontSize: 14,
//   },
//   clearButton: {
//     padding: 8,
//   },
//   chatContainer: {
//     flex: 1,
//   },
//   messagesContainer: {
//     flex: 1,
//   },
//   messagesContent: {
//     padding: 16,
//   },
//   messageContainer: {
//     marginBottom: 16,
//     maxWidth: '80%',
//     borderRadius: 16,
//     padding: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   userMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#1051e9',
//     borderBottomRightRadius: 4,
//   },
//   assistantMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: 'white',
//     borderBottomLeftRadius: 4,
//   },
//   messageContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   messageText: {
//     fontSize: 16,
//     lineHeight: 22,
//     flex: 1,
//   },
//   userMessageText: {
//     color: 'white',
//   },
//   assistantMessageText: {
//     color: '#374151',
//   },
//   speakButton: {
//     marginLeft: 8,
//     padding: 4,
//   },
//   timestamp: {
//     fontSize: 12,
//     opacity: 0.7,
//     marginTop: 4,
//     textAlign: 'right',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     padding: 16,
//     backgroundColor: 'white',
//     borderTopWidth: 1,
//     borderTopColor: '#e5e7eb',
//   },
//   input: {
//     flex: 1,
//     backgroundColor: '#f3f4f6',
//     borderRadius: 24,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 16,
//     maxHeight: 100,
//     marginRight: 12,
//   },
//   sendButton: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#1051e9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   sendButtonDisabled: {
//     backgroundColor: '#9ca3af',
//   },
//   welcomeContainer: {
//     alignItems: 'center',
//     padding: 24,
//   },
//   welcomeTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 12,
//   },
//   welcomeText: {
//     fontSize: 16,
//     color: '#6b7280',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   disclaimer: {
//     fontSize: 14,
//     color: '#9ca3af',
//     textAlign: 'center',
//   },
//   loadingContainer: {
//     padding: 16,
//     alignItems: 'center',
//   },
//   loadingDots: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#6b7280',
//     marginHorizontal: 4,
//   },
// });

// export default Chatbot;