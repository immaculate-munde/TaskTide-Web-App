import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Send, Search, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  type: 'course' | 'group' | 'direct';
}
interface Message {
  id: number;
  content: string;
  sender: string;
  senderRole: string;
  timestamp: string;
}
const Messages: React.FC = () => {
  const {
    user
  } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an actual Supabase query
        // This is just mock data for the example
        setChats([{
          id: 1,
          name: 'CS101: Introduction to Computer Science',
          lastMessage: 'Dr. Smith: The assignment deadline has been extended to Friday.',
          lastMessageTime: '2023-11-05T14:30:00Z',
          unread: 2,
          type: 'course'
        }, {
          id: 2,
          name: 'Team Alpha',
          lastMessage: 'Jane: When should we meet to discuss the project?',
          lastMessageTime: '2023-11-05T10:15:00Z',
          unread: 0,
          type: 'group'
        }, {
          id: 3,
          name: 'Dr. Smith',
          lastMessage: 'Let me know if you have any questions about the lecture.',
          lastMessageTime: '2023-11-04T16:45:00Z',
          unread: 0,
          type: 'direct'
        }, {
          id: 4,
          name: 'WD200: Web Development',
          lastMessage: "Prof. Johnson: Don't forget to submit your projects by Monday.",
          lastMessageTime: '2023-11-03T11:20:00Z',
          unread: 0,
          type: 'course'
        }, {
          id: 5,
          name: 'Database Wizards',
          lastMessage: "Michael: I've pushed the schema changes to the repo.",
          lastMessageTime: '2023-11-02T09:10:00Z',
          unread: 0,
          type: 'group'
        }]);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChats();
  }, []);
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
      // Mark as read
      setChats(chats.map(chat => chat.id === selectedChat.id ? {
        ...chat,
        unread: 0
      } : chat));
    }
  }, [selectedChat]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const fetchMessages = async (chatId: number) => {
    try {
      // In a real app, this would be an actual Supabase query
      // This is just mock data for the example
      if (chatId === 1) {
        setMessages([{
          id: 1,
          content: 'Welcome to the CS101 course chat! Feel free to ask questions here.',
          sender: 'Dr. Smith',
          senderRole: 'Lecturer',
          timestamp: '2023-11-05T09:00:00Z'
        }, {
          id: 2,
          content: 'When is the first assignment due?',
          sender: 'John Doe',
          senderRole: 'Student',
          timestamp: '2023-11-05T09:15:00Z'
        }, {
          id: 3,
          content: 'The first assignment will be due on November 20th.',
          sender: 'Dr. Smith',
          senderRole: 'Lecturer',
          timestamp: '2023-11-05T09:20:00Z'
        }, {
          id: 4,
          content: "I've posted more details in the course resources section.",
          sender: 'Dr. Smith',
          senderRole: 'Lecturer',
          timestamp: '2023-11-05T09:21:00Z'
        }, {
          id: 5,
          content: 'Thank you, Dr. Smith!',
          sender: 'John Doe',
          senderRole: 'Student',
          timestamp: '2023-11-05T09:25:00Z'
        }, {
          id: 6,
          content: 'The assignment deadline has been extended to Friday.',
          sender: 'Dr. Smith',
          senderRole: 'Lecturer',
          timestamp: '2023-11-05T14:30:00Z'
        }]);
      } else if (chatId === 2) {
        setMessages([{
          id: 1,
          content: "Hey team, how's the progress on the project?",
          sender: 'You',
          senderRole: user?.role || 'Student',
          timestamp: '2023-11-04T15:00:00Z'
        }, {
          id: 2,
          content: "I've completed the first part. Working on the second now.",
          sender: 'John',
          senderRole: 'Student',
          timestamp: '2023-11-04T15:10:00Z'
        }, {
          id: 3,
          content: "I'm still researching for my section. Should be done by tomorrow.",
          sender: 'Sarah',
          senderRole: 'Student',
          timestamp: '2023-11-04T15:15:00Z'
        }, {
          id: 4,
          content: 'When should we meet to discuss the project?',
          sender: 'Jane',
          senderRole: 'Student',
          timestamp: '2023-11-05T10:15:00Z'
        }]);
      } else {
        setMessages([{
          id: 1,
          content: 'Hello! This is a new conversation.',
          sender: 'System',
          senderRole: 'System',
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    try {
      // In a real app, this would be an actual Supabase insert
      // This is just a mock for the example
      const newMsg: Message = {
        id: messages.length + 1,
        content: newMessage,
        sender: user?.display_name || 'You',
        senderRole: user?.role || 'Student',
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      // Update last message in chat list
      setChats(chats.map(chat => chat.id === selectedChat.id ? {
        ...chat,
        lastMessage: `You: ${newMessage}`,
        lastMessageTime: new Date().toISOString()
      } : chat));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  const handleStartNewChat = () => {
    // In a real app, this would create a new chat in the database
    // This is just a mock for the example
    setShowNewChatModal(false);
  };
  const filteredChats = chats.filter(chat => chat.name.toLowerCase().includes(searchQuery.toLowerCase()));
  return <div className="h-[calc(100vh-12rem)] flex flex-col md:flex-row bg-white dark:bg-secondary-800 rounded-2xl shadow-soft overflow-hidden">
      {/* Chat List */}
      <div className="w-full md:w-80 border-r border-secondary-200 dark:border-secondary-700 flex flex-col">
        <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
              Messages
            </h2>
            <button onClick={() => setShowNewChatModal(true)} className="p-1 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-700">
              <Plus size={20} />
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-secondary-400" />
            </div>
            <input type="text" placeholder="Search chats..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isLoading ? <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
            </div> : filteredChats.length === 0 ? <div className="text-center py-8">
              <p className="text-secondary-500 dark:text-secondary-400">
                No chats found
              </p>
            </div> : <div>
              {filteredChats.map(chat => <div key={chat.id} onClick={() => setSelectedChat(chat)} className={`p-4 cursor-pointer ${selectedChat?.id === chat.id ? 'bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-secondary-50 dark:hover:bg-secondary-750'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${chat.type === 'course' ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300' : chat.type === 'group' ? 'bg-accent-100 dark:bg-accent-800 text-accent-700 dark:text-accent-300' : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300'}`}>
                        <span className="font-medium text-sm">
                          {chat.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3 overflow-hidden">
                        <p className="font-medium text-secondary-900 dark:text-secondary-100 truncate">
                          {chat.name}
                        </p>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400 truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-secondary-500 dark:text-secondary-400">
                        {format(new Date(chat.lastMessageTime), 'h:mm a')}
                      </span>
                      {chat.unread > 0 && <span className="mt-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-600 text-white text-xs font-medium">
                          {chat.unread}
                        </span>}
                    </div>
                  </div>
                </div>)}
            </div>}
        </div>
      </div>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? <>
            <div className="p-4 border-b border-secondary-200 dark:border-secondary-700 flex items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${selectedChat.type === 'course' ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300' : selectedChat.type === 'group' ? 'bg-accent-100 dark:bg-accent-800 text-accent-700 dark:text-accent-300' : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300'}`}>
                <span className="font-medium text-sm">
                  {selectedChat.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
                  {selectedChat.name}
                </h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  {selectedChat.type === 'course' ? 'Course Chat' : selectedChat.type === 'group' ? 'Group Chat' : 'Direct Message'}
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => {
            const isOwnMessage = message.sender === user?.display_name || message.sender === 'You';
            const formattedTime = format(new Date(message.timestamp), 'h:mm a');
            return <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] ${isOwnMessage ? 'bg-primary-600 text-white' : 'bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100'} rounded-2xl px-4 py-3 shadow-sm`}>
                      {!isOwnMessage && <div className="flex items-center mb-1">
                          <div className="h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center mr-2">
                            <span className="text-xs font-medium text-primary-700 dark:text-primary-300">
                              {message.sender[0]}
                            </span>
                          </div>
                          <span className="font-medium text-sm">
                            {message.sender}
                          </span>
                          <span className={`text-xs ml-2 ${isOwnMessage ? 'text-primary-200' : 'text-secondary-500 dark:text-secondary-400'}`}>
                            {message.senderRole}
                          </span>
                        </div>}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div className={`text-right mt-1 text-xs ${isOwnMessage ? 'text-primary-200' : 'text-secondary-500 dark:text-secondary-400'}`}>
                        {formattedTime}
                      </div>
                    </div>
                  </div>;
          })}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type your message..." className="flex-1 px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" />
                <button type="submit" disabled={!newMessage.trim()} className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send size={20} />
                </button>
              </form>
            </div>
          </> : <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto text-secondary-400" />
              <h3 className="mt-4 text-lg font-medium text-secondary-900 dark:text-secondary-100">
                Select a chat to start messaging
              </h3>
              <p className="mt-2 text-secondary-500 dark:text-secondary-400">
                Choose from your existing conversations or start a new one
              </p>
              <button onClick={() => setShowNewChatModal(true)} className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                <Plus size={18} className="mr-2" />
                New Chat
              </button>
            </div>
          </div>}
      </div>
      {/* New Chat Modal */}
      {showNewChatModal && <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity bg-secondary-900 bg-opacity-75" onClick={() => setShowNewChatModal(false)}></div>
            <div className="relative inline-block w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-secondary-800 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                  Start New Chat
                </h3>
                <button onClick={() => setShowNewChatModal(false)} className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="chatType" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Chat Type
                  </label>
                  <select id="chatType" className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100">
                    <option value="direct">Direct Message</option>
                    <option value="group">Group Chat</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Recipient / Group Members
                  </label>
                  <input type="text" id="recipient" className="mt-1 block w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" placeholder="Search for users..." />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button onClick={() => setShowNewChatModal(false)} className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-700 rounded-xl hover:bg-secondary-200 dark:hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500">
                    Cancel
                  </button>
                  <button onClick={handleStartNewChat} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                    Start Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};
import { MessageSquare } from 'lucide-react';
export default Messages;