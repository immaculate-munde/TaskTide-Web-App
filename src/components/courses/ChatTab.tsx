import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { UserRole } from '../../lib/supabase';
import { Send, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
interface ChatTabProps {
  courseId: string;
  userRole: UserRole;
}
interface Message {
  id: number;
  content: string;
  sender: string;
  senderRole: UserRole;
  timestamp: string;
}
const ChatTab: React.FC<ChatTabProps> = ({
  courseId,
  userRole
}) => {
  const {
    user
  } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an actual Supabase query with realtime subscription
        // This is just mock data for the example
        setMessages([{
          id: 1,
          content: 'Welcome to the course chat! Feel free to ask questions here.',
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
          content: "The first assignment will be due on November 20th. I'll post more details next week.",
          sender: 'Dr. Smith',
          senderRole: 'Lecturer',
          timestamp: '2023-11-05T09:20:00Z'
        }, {
          id: 4,
          content: 'Will we need to form groups for the project?',
          sender: 'Emily Brown',
          senderRole: 'Student',
          timestamp: '2023-11-05T10:05:00Z'
        }, {
          id: 5,
          content: 'Yes, groups of 3-4 students will be required for the final project.',
          sender: 'Dr. Smith',
          senderRole: 'Lecturer',
          timestamp: '2023-11-05T10:10:00Z'
        }]);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
    // In a real app, set up Supabase realtime subscription here
    // const subscription = supabase
    //   .channel('course-chat')
    //   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, handleNewMessage)
    //   .subscribe()
    //
    // return () => {
    //   subscription.unsubscribe()
    // }
  }, [courseId]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
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
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  const handleDeleteMessage = async (messageId: number) => {
    try {
      // In a real app, this would be an actual Supabase delete
      // This is just a mock for the example
      setMessages(messages.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };
  const canModerateMessages = userRole === 'Lecturer' || userRole === 'ClassRep' || userRole === 'Admin';
  return <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto mb-4 bg-secondary-50 dark:bg-secondary-700 rounded-xl p-4">
        {isLoading ? <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
          </div> : messages.length === 0 ? <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare size={36} className="mx-auto text-secondary-400" />
              <p className="mt-2 text-secondary-500 dark:text-secondary-400">
                No messages yet
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Be the first to send a message!
              </p>
            </div>
          </div> : <div className="space-y-4">
            {messages.map(message => {
          const isOwnMessage = message.sender === user?.display_name || message.sender === 'You';
          const formattedTime = format(new Date(message.timestamp), 'MMM d, h:mm a');
          return <div key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${isOwnMessage ? 'bg-primary-600 text-white' : 'bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100'} rounded-2xl px-4 py-3 shadow-sm`}>
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
                    <div className={`flex items-center justify-between mt-1 text-xs ${isOwnMessage ? 'text-primary-200' : 'text-secondary-500 dark:text-secondary-400'}`}>
                      <span>{formattedTime}</span>
                      {(isOwnMessage || canModerateMessages) && <button onClick={() => handleDeleteMessage(message.id)} className={`ml-2 ${isOwnMessage ? 'text-primary-200 hover:text-white' : 'text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200'}`}>
                          <Trash2 size={14} />
                        </button>}
                    </div>
                  </div>
                </div>;
        })}
            <div ref={messagesEndRef} />
          </div>}
      </div>
      <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
        <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type your message..." className="flex-1 px-4 py-3 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100" />
        <button type="submit" disabled={!newMessage.trim()} className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
          <Send size={20} />
        </button>
      </form>
    </div>;
};
import { MessageSquare } from 'lucide-react';
export default ChatTab;