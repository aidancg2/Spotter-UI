import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Smile, Paperclip, Camera, MoreVertical, Flame, Users } from 'lucide-react';

interface ChatProps {
  chatId: string;
  chatName: string;
  chatAvatar: string;
  isGroup: boolean;
  members?: number;
  streak?: number;
  onBack: () => void;
  onProfileClick?: () => void;
}

interface Message {
  id: string;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export function Chat({ chatId, chatName, chatAvatar, isGroup, members, streak, onBack, onProfileClick }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: chatName,
      senderAvatar: chatAvatar,
      content: isGroup ? "Hey everyone! Who's hitting the gym today?" : "Hey! Ready for our workout session?",
      timestamp: '10:30 AM',
      isOwn: false,
    },
    {
      id: '2',
      sender: 'You',
      senderAvatar: '👤',
      content: isGroup ? "I'm in! Planning to go at 6pm" : "Yeah! Let's do it at 6pm today",
      timestamp: '10:32 AM',
      isOwn: true,
    },
    {
      id: '3',
      sender: isGroup ? 'Marcus Johnson' : chatName,
      senderAvatar: isGroup ? '💪' : chatAvatar,
      content: isGroup ? "Count me in too! 💪" : "Perfect! See you at Gold's Gym?",
      timestamp: '10:35 AM',
      isOwn: false,
    },
  ]);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'You',
        senderAvatar: '👤',
        content: messageInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-neutral-900 border-b border-neutral-800 p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <button 
            onClick={onProfileClick}
            className="flex items-center gap-3 flex-1 hover:bg-neutral-800 rounded-lg p-2 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
              isGroup ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 'bg-gradient-to-br from-cyan-500 to-blue-600'
            }`}>
              {chatAvatar}
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold flex items-center gap-2">
                {chatName}
                {streak && (
                  <div className="flex items-center gap-1 text-xs text-orange-400">
                    <Flame size={14} />
                    <span>{streak}</span>
                  </div>
                )}
              </div>
              {isGroup && members && (
                <div className="text-xs text-neutral-400 flex items-center gap-1">
                  <Users size={12} />
                  {members} members
                </div>
              )}
              {!isGroup && (
                <div className="text-xs text-green-500">Active now</div>
              )}
            </div>
          </button>

          <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.isOwn ? 'flex-row-reverse' : ''}`}
          >
            {!message.isOwn && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                isGroup ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-gradient-to-br from-cyan-500 to-blue-600'
              }`}>
                {message.senderAvatar}
              </div>
            )}
            <div className={`flex flex-col ${message.isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
              {!message.isOwn && isGroup && (
                <div className="text-xs text-neutral-400 mb-1 px-2">{message.sender}</div>
              )}
              <div
                className={`px-4 py-2 rounded-2xl ${
                  message.isOwn
                    ? 'bg-cyan-500 text-white'
                    : 'bg-neutral-800 text-white'
                }`}
              >
                {message.content}
              </div>
              <div className="text-xs text-neutral-500 mt-1 px-2">{message.timestamp}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-neutral-900 border-t border-neutral-800 p-4">
        <div className="flex items-end gap-2">
          <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
            <Camera size={20} className="text-neutral-400" />
          </button>
          <button className="p-2 hover:bg-neutral-800 rounded-lg transition-colors">
            <Paperclip size={20} className="text-neutral-400" />
          </button>
          
          <div className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl flex items-center px-3 py-2">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 bg-transparent outline-none resize-none max-h-24"
            />
            <button className="p-1 hover:bg-neutral-700 rounded-lg transition-colors">
              <Smile size={20} className="text-neutral-400" />
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className={`p-3 rounded-lg transition-colors ${
              messageInput.trim()
                ? 'bg-cyan-500 hover:bg-cyan-600'
                : 'bg-neutral-800 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
