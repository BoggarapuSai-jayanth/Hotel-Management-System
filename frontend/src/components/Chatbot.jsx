import React, { useState } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send } from 'lucide-react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ text: "Hi! How can I help you with your booking today?", sender: 'bot' }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:5001/api/chat', { message: userMsg });
            setMessages(prev => [...prev, { text: res.data.reply, sender: 'bot' }]);
        } catch (err) {
            console.log('Chat API Error:', err);
            console.log(err.response.data);
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting to the server.", sender: 'bot' }]);
        }
        setLoading(false);
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition transform hover:scale-105 z-50 flex items-center justify-center h-16 w-16"
                >
                    <MessageSquare className="h-8 w-8" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100 flex-shrink-0" style={{ height: '500px' }}>
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
                        <div className="flex items-center space-x-2">
                            <MessageSquare className="h-5 w-5" />
                            <h3 className="font-semibold text-lg">Luxe AI Support</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-blue-100 hover:text-white transition">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-grow p-4 overflow-y-auto bg-slate-50 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-500 shadow-sm border border-gray-100 rounded-2xl rounded-tl-none px-4 py-2 text-sm flex space-x-1 items-center">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <form onSubmit={sendMessage} className="flex relative items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="w-full bg-slate-50 border border-gray-200 rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 p-2 hover:bg-blue-50 rounded-full transition disabled:opacity-50"
                            >
                                <Send className="h-5 w-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
