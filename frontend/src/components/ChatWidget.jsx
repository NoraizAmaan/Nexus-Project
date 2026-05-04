import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PaperAirplaneIcon, XMarkIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';

const ChatWidget = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([
        { id: 1, text: t('chat.welcome'), sender: 'model' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Prepare history for API
            const history = messages.filter(m => m.id !== 1).map(m => ({
                sender: m.sender,
                text: m.text
            }));

            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            const response = await fetch(`${apiUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage.text, history })
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(prev => [...prev, { id: Date.now() + 1, text: data.reply, sender: 'model' }]);
            } else {
                setMessages(prev => [...prev, { id: Date.now() + 1, text: data.error || t('chat.error'), sender: 'model', isError: true }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: t('chat.error'), sender: 'model', isError: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] max-h-[80vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-slate-700 z-50 overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="bg-indigo-600 dark:bg-indigo-700 p-4 text-white flex justify-between items-center rounded-t-2xl shadow-md z-10">
                <div className="flex items-center space-x-2">
                    <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6 text-indigo-100" />
                    <h3 className="font-semibold text-lg">{t('chat.title')}</h3>
                </div>
                <button 
                    onClick={onClose}
                    className="text-indigo-200 hover:text-white transition-colors bg-indigo-800/30 hover:bg-indigo-800/50 p-1.5 rounded-full"
                    aria-label="Close chat"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-slate-900/50 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
                    >
                        <div 
                            className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                                msg.sender === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-br-sm' 
                                    : msg.isError 
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 rounded-bl-sm border border-red-200 dark:border-red-800/50'
                                        : 'bg-white text-gray-800 dark:bg-slate-700 dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-slate-600'
                            }`}
                        >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-bl-sm p-4 shadow-sm border border-gray-100 dark:border-slate-600 flex items-center space-x-2">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={t('chat.placeholder')}
                        disabled={isLoading}
                        className="w-full bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-white rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 transition-all border border-transparent focus:border-indigo-500/30 dark:focus:border-indigo-400/30 text-sm disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isLoading}
                        className="absolute right-1.5 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
                        aria-label={t('chat.send')}
                    >
                        <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWidget;
