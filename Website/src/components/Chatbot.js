import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import React, { useState, useRef, useEffect } from 'react';
// import './css/Chatbot.css';
// import { v4 as uuidv4 } from 'uuid';
// import { Mic, StopCircle, Volume2, VolumeX } from 'lucide-react';
// import { getUserDetails } from '../utils/api';
// interface Message {
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: string;
//   language?: string;
// }
// interface ChatResponse {
//   success: boolean;
//   response: string;
//   disclaimer?: string;
//   language?: string;
// }
// const API_CONFIG = {
//   BASE_URL: 'http://localhost:8000',
//   ENDPOINTS: {
//     CHAT: '/api/chatbot/chat/'
//   }
// };
// export const Chatbot: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [sessionId, setSessionId] = useState<string>('');
//   const [isListening, setIsListening] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [currentSpeakingMessage, setCurrentSpeakingMessage] = useState<number | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const recognitionRef = useRef<any>(null);
//   // Initialize Web Speech API
//   useEffect(() => {
//     // @ts-ignore
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (SpeechRecognition) {
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = true;
//       recognitionRef.current.interimResults = true;
//       recognitionRef.current.onresult = (event: any) => {
//         const transcript = Array.from(event.results)
//           .map((result: any) => result[0])
//           .map(result => result.transcript)
//           .join('');
//         setInputMessage(transcript);
//       };
//       recognitionRef.current.onend = () => {
//         setIsListening(false);
//       };
//       recognitionRef.current.onerror = (event: any) => {
//         console.error('Speech recognition error:', event.error);
//         setIsListening(false);
//       };
//     }
//   }, []);
// console.log(getUserDetails())
//   // Initialize session ID and load chat history
//   useEffect(() => {
//     const savedSessionId = localStorage.getItem('medical_session_id');
//     if (!savedSessionId) {
//       const newSessionId = uuidv4();
//       localStorage.setItem('medical_session_id', newSessionId);
//       setSessionId(newSessionId);
//     } else {
//       setSessionId(savedSessionId);
//     }
//     const savedChat = localStorage.getItem('medical_chat_history');
//     if (savedChat) {
//       setMessages(JSON.parse(savedChat));
//     }
//   }, []);
//   // Save chat history to localStorage
//   useEffect(() => {
//     if (messages.length > 0) {
//       localStorage.setItem('medical_chat_history', JSON.stringify(messages));
//     }
//   }, [messages]);
//   // Scroll to bottom when messages update
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };
//   const formatTimestamp = () => {
//     const now = new Date();
//     return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };
//   const toggleSpeechRecognition = () => {
//     if (isListening) {
//       recognitionRef.current?.stop();
//       setIsListening(false);
//     } else {
//       recognitionRef.current?.start();
//       setIsListening(true);
//       setInputMessage('');
//     }
//   };
//   const clearConversation = () => {
//         setMessages([]);
//         const newSessionId = uuidv4();
//         localStorage.setItem('medical_session_id', newSessionId);
//         setSessionId(newSessionId);
//         localStorage.removeItem('medical_chat_history');
//       };
//       const handleRetry = async () => {
//             if (messages.length === 0) return;
//             const lastUserMessage = messages[messages.length - 1];
//             if (lastUserMessage.role !== 'user') return;
//             setError(null);
//             setIsLoading(true);
//             try {
//               const response = await sendMessageToBackend(lastUserMessage.content);
//               if (response.success) {
//                 setMessages(prev => [
//                   ...prev,
//                   {
//                     role: 'assistant',
//                     content: response.response,
//                     timestamp: formatTimestamp()
//                   }
//                 ]);
//               } else {
//                 setError(response.response);
//               }
//             } catch (error) {
//               const errorMessage = error instanceof Error ? error.message : 'Failed to retry message';
//               setError(errorMessage);
//             } finally {
//               setIsLoading(false);
//             }
//           };
//   const speakMessage = async (message: string, index: number, language?: string) => {
//     if (isSpeaking && currentSpeakingMessage === index) {
//       window.speechSynthesis.cancel();
//       setIsSpeaking(false);
//       setCurrentSpeakingMessage(null);
//       return;
//     }
//     const utterance = new SpeechSynthesisUtterance(message);
//     if (language) {
//       utterance.lang = language;
//     }
//     utterance.onend = () => {
//       setIsSpeaking(false);
//       setCurrentSpeakingMessage(null);
//     };
//     setIsSpeaking(true);
//     setCurrentSpeakingMessage(index);
//     window.speechSynthesis.speak(utterance);
//   };
//   const sendMessageToBackend = async (query: string) => {
//     const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT}`;
//     try {
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         credentials: 'include',
//         mode: 'cors',
//         body: JSON.stringify({ 
//           query,
//           session_id: sessionId
//         }),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || `Server error: ${response.status}`);
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('API Error:', error);
//       throw error;
//     }
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!inputMessage.trim() || isLoading) return;
//     const userMessage = inputMessage.trim();
//     setInputMessage('');
//     setIsLoading(true);
//     setError(null);
//     if (isListening) {
//       toggleSpeechRecognition();
//     }
//     const newUserMessage = {
//       role: 'user' as const,
//       content: userMessage,
//       timestamp: formatTimestamp()
//     };
//     setMessages(prev => [...prev, newUserMessage]);
//     try {
//       const response = await sendMessageToBackend(userMessage);
//       if (response.success) {
//         setMessages(prev => [
//           ...prev,
//           {
//             role: 'assistant',
//             content: response.response,
//             timestamp: formatTimestamp(),
//             language: response.language
//           }
//         ]);
//       } else {
//         setError(response.response);
//       }
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <div className="chatbot-container">
//       <div className="chatbot-header">
//         <div className="header-icon">👨‍⚕️</div>
//         <div className="header-text">
//           <h1>SmartCare Medical Assistant</h1>
//           <span className="connection-status">
//             {error ? 'Connection Error' : 'Connected'}
//           </span>
//         </div>
//         <button 
//           onClick={clearConversation} 
//           className="clear-button"
//           title="Clear conversation and start new session"
//         >
//           🗑️
//         </button>
//       </div>
//       <div className="messages-container">
//         {messages.length === 0 ? (
//           <div className="welcome-message">
//             <h2>Hello! 👋</h2>
//             <p>I'm SmartCare, your medical assistant. I can help you with medical-related questions.</p>
//             <p className="disclaimer">
//               Note: I provide general medical information only. Always consult with a healthcare 
//               professional for specific medical advice.
//             </p>
//           </div>
//         ) : (
//           messages.map((message, index) => (
//             <div
//               key={`${message.timestamp}-${index}`}
//               className={`message-wrapper ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
//             >
//               <div className="message">
//                 <div className="message-content">
//                   {message.content}
//                   {message.role === 'assistant' && (
//                     <button
//                       onClick={() => speakMessage(message.content, index, message.language)}
//                       className="speak-button"
//                       title={isSpeaking && currentSpeakingMessage === index ? "Stop speaking" : "Speak message"}
//                     >
//                       {isSpeaking && currentSpeakingMessage === index ? (
//                         <VolumeX className="w-4 h-4" />
//                       ) : (
//                         <Volume2 className="w-4 h-4" />
//                       )}
//                     </button>
//                   )}
//                 </div>
//                 <div className="message-timestamp">{message.timestamp}</div>
//               </div>
//             </div>
//           ))
//         )}
//         {isListening && (
//           <div className="listening-indicator">
//             <div className="listening-waves">
//               <span></span>
//               <span></span>
//               <span></span>
//               <span></span>
//               <span></span>
//             </div>
//             <p>Listening...</p>
//           </div>
//         )}
//         {isLoading && (
//           <div className="message-wrapper assistant-message">
//             <div className="message">
//               <div className="typing-indicator">
//                 <span></span>
//                 <span></span>
//                 <span></span>
//               </div>
//             </div>
//           </div>
//         )}
//         {error && (
//           <div className="error-message">
//             <p>{error}</p>
//             <button onClick={handleRetry} className="retry-button">
//               Try Again
//             </button>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//       <form onSubmit={handleSubmit} className="input-form">
//         <input
//           type="text"
//           value={inputMessage}
//           onChange={(e) => setInputMessage(e.target.value)}
//           placeholder="Type your medical question here..."
//           disabled={isLoading}
//           className="message-input"
//         />
//         <button
//           type="button"
//           onClick={toggleSpeechRecognition}
//           className={`mic-button ${isListening ? 'listening' : ''}`}
//           title={isListening ? "Stop listening" : "Start listening"}
//         >
//           {isListening ? (
//             <StopCircle className="w-5 h-5" />
//           ) : (
//             <Mic className="w-5 h-5" />
//           )}
//           <span >🎙️</span>
//         </button>
//         <button 
//           type="submit" 
//           disabled={!inputMessage.trim() || isLoading}
//           className="send-button"
//         >
//           {isLoading ? (
//             <span className="sending">Sending...</span>
//           ) : (
//             <span className="send-icon">➤</span>
//           )}
//         </button>
//       </form>
//     </div>
//   );
// };
// export default Chatbot;
import { useState, useRef, useEffect } from 'react';
import './css/Chatbot.css';
import { v4 as uuidv4 } from 'uuid';
import { Mic, StopCircle, Volume2, VolumeX } from 'lucide-react';
import { getChatbotResponse, getUserDetails } from '../utils/api';
import './css/Home.css';
export const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sessionId, setSessionId] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentSpeakingMessage, setCurrentSpeakingMessage] = useState(null);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const handleChatClick = () => {
        window.location.href = '/home';
    };
    // Initialize Web Speech API
    useEffect(() => {
        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map((result) => result[0])
                    .map(result => result.transcript)
                    .join('');
                setInputMessage(transcript);
            };
            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
        }
    }, []);
    // Initialize session ID and load chat history
    useEffect(() => {
        const savedSessionId = localStorage.getItem('medical_session_id');
        if (!savedSessionId) {
            const newSessionId = uuidv4();
            localStorage.setItem('medical_session_id', newSessionId);
            setSessionId(newSessionId);
        }
        else {
            setSessionId(savedSessionId);
        }
        const savedChat = localStorage.getItem('medical_chat_history');
        if (savedChat) {
            setMessages(JSON.parse(savedChat));
        }
        // Load user details
        getUserDetails().catch(console.error);
    }, []);
    // Save chat history to localStorage
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('medical_chat_history', JSON.stringify(messages));
        }
    }, [messages]);
    // Scroll to bottom when messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const formatTimestamp = () => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    const toggleSpeechRecognition = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        }
        else {
            recognitionRef.current?.start();
            setIsListening(true);
            setInputMessage('');
        }
    };
    const clearConversation = () => {
        setMessages([]);
        const newSessionId = uuidv4();
        localStorage.setItem('medical_session_id', newSessionId);
        setSessionId(newSessionId);
        localStorage.removeItem('medical_chat_history');
    };
    const handleRetry = async () => {
        if (messages.length === 0)
            return;
        const lastUserMessage = messages[messages.length - 1];
        if (lastUserMessage.role !== 'user')
            return;
        setError(null);
        setIsLoading(true);
        try {
            const response = await sendMessageToBackend(lastUserMessage.content);
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
            }
            else {
                setError(response.response);
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to retry message';
            setError(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    };
    const speakMessage = async (message, index, language) => {
        if (isSpeaking && currentSpeakingMessage === index) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setCurrentSpeakingMessage(null);
            return;
        }
        const utterance = new SpeechSynthesisUtterance(message);
        if (language) {
            utterance.lang = language;
        }
        utterance.onend = () => {
            setIsSpeaking(false);
            setCurrentSpeakingMessage(null);
        };
        setIsSpeaking(true);
        setCurrentSpeakingMessage(index);
        window.speechSynthesis.speak(utterance);
    };
    const sendMessageToBackend = async (query) => {
        const questionData = {
            query,
            session_id: sessionId
        };
        try {
            // First store the user's question
            // await storeUserQuestion(questionData);
            // Then get the chatbot response
            const response = await getChatbotResponse(questionData);
            return response;
        }
        catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isLoading)
            return;
        const userMessage = inputMessage.trim();
        setInputMessage('');
        setIsLoading(true);
        setError(null);
        if (isListening) {
            toggleSpeechRecognition();
        }
        const newUserMessage = {
            role: 'user',
            content: userMessage,
            timestamp: formatTimestamp()
        };
        setMessages(prev => [...prev, newUserMessage]);
        try {
            const response = await sendMessageToBackend(userMessage);
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
            }
            else {
                setError(response.response);
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
            setError(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "chatbot", children: [_jsxs("div", { className: "chatbot-container", children: [_jsxs("div", { className: "chatbot-header", children: [_jsx("div", { className: "header-icon", children: "\uD83D\uDC68\u200D\u2695\uFE0F" }), _jsxs("div", { className: "header-text", children: [_jsx("h1", { children: "SmartCare Medical Assistant" }), _jsx("span", { className: "connection-status", children: error ? 'Connection Error' : 'Connected' })] }), _jsx("button", { onClick: clearConversation, className: "clear-button", title: "Clear conversation and start new session", children: "\uD83D\uDDD1\uFE0F" })] }), _jsxs("div", { className: "messages-container", children: [messages.length === 0 ? (_jsxs("div", { className: "welcome-message", children: [_jsx("h2", { children: "Hello! \uD83D\uDC4B" }), _jsx("p", { children: "I'm SmartCare, your medical assistant. I can help you with medical-related questions." }), _jsx("p", { className: "disclaimer", children: "Note: I provide general medical information only. Always consult with a healthcare professional for specific medical advice." })] })) : (messages.map((message, index) => (_jsx("div", { className: `message-wrapper ${message.role === 'user' ? 'user-message' : 'assistant-message'}`, children: _jsxs("div", { className: "message", children: [_jsxs("div", { className: "message-content", children: [message.content, message.role === 'assistant' && (_jsx("button", { onClick: () => speakMessage(message.content, index, message.language), className: "speak-button", title: isSpeaking && currentSpeakingMessage === index ? "Stop speaking" : "Speak message", children: isSpeaking && currentSpeakingMessage === index ? (_jsx(VolumeX, { className: "w-4 h-4" })) : (_jsx(Volume2, { className: "w-4 h-4" })) }))] }), _jsx("div", { className: "message-timestamp", children: message.timestamp })] }) }, `${message.timestamp}-${index}`)))), isListening && (_jsxs("div", { className: "listening-indicator", children: [_jsxs("div", { className: "listening-waves", children: [_jsx("span", {}), _jsx("span", {}), _jsx("span", {}), _jsx("span", {}), _jsx("span", {})] }), _jsx("p", { children: "Listening..." })] })), isLoading && (_jsx("div", { className: "message-wrapper assistant-message", children: _jsx("div", { className: "message", children: _jsxs("div", { className: "typing-indicator", children: [_jsx("span", {}), _jsx("span", {}), _jsx("span", {})] }) }) })), error && (_jsxs("div", { className: "error-message", children: [_jsx("p", { children: error }), _jsx("button", { onClick: handleRetry, className: "retry-button", children: "Try Again" })] })), _jsx("div", { ref: messagesEndRef })] }), _jsxs("form", { onSubmit: handleSubmit, className: "input-form", children: [_jsx("input", { type: "text", value: inputMessage, onChange: (e) => setInputMessage(e.target.value), placeholder: "Type your medical question here...", disabled: isLoading, className: "message-input" }), _jsxs("button", { type: "button", onClick: toggleSpeechRecognition, className: `mic-button ${isListening ? 'listening' : ''}`, title: isListening ? "Stop listening" : "Start listening", children: [isListening ? (_jsx(StopCircle, { className: "w-5 h-5" })) : (_jsx(Mic, { className: "w-5 h-5" })), _jsx("span", { children: "\uD83C\uDF99\uFE0F" })] }), _jsx("button", { type: "submit", disabled: !inputMessage.trim() || isLoading, className: "send-button", children: isLoading ? (_jsx("span", { className: "sending", children: "Sending..." })) : (_jsx("span", { className: "send-icon", children: "\u27A4" })) })] })] }), _jsxs("div", { className: "chat-button-wrapper", children: [_jsx("div", { className: "chat-button-ripple" }), _jsxs("button", { className: `chat-button ${isHovered ? 'hovered' : ''}`, onClick: handleChatClick, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), "aria-label": "Open Chat", children: [_jsxs("div", { className: "chat-button-inner", children: [_jsx("div", { className: "chat-icon" }), _jsx("span", { className: "chat-tooltip", children: "Let's Chat!" })] }), _jsx("div", { className: "chat-button-glow" })] })] })] }));
};
export default Chatbot;
