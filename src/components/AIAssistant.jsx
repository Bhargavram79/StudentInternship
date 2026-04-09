import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import { chatWithAi } from '../services/api';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm the InternHub AI Assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput('');
        setLoading(true);

        try {
            const res = await chatWithAi(userMsg);
            setMessages(prev => [...prev, { text: res.reply || "Sorry, I couldn't understand that.", isBot: true }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Error connecting to AI Server. Make sure the API key is configured in backend.", isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-assistant-wrapper" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 10000 }}>
            {!isOpen ? (
                <button 
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        backgroundColor: '#4361ee', color: 'white',
                        border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                    <FiMessageSquare size={28} />
                </button>
            ) : (
                <div style={{
                    width: '350px', height: '500px', backgroundColor: 'white',
                    borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    border: '1px solid #e2e8f0', fontFamily: 'inherit'
                }}>
                    <div style={{
                        padding: '16px', backgroundColor: '#4361ee', color: 'white',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiMessageSquare /> InternHub AI
                        </h3>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <FiX size={20} />
                        </button>
                    </div>

                    <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#f8fafc' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                                maxWidth: '85%', padding: '10px 14px',
                                borderRadius: '12px', fontSize: '14px', lineHeight: '1.5',
                                backgroundColor: msg.isBot ? '#e2e8f0' : '#4361ee',
                                color: msg.isBot ? '#1e293b' : 'white',
                                borderBottomLeftRadius: msg.isBot ? '4px' : '12px',
                                borderBottomRightRadius: msg.isBot ? '12px' : '4px',
                                wordBreak: 'break-word'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: 'flex-start', padding: '10px 14px', borderRadius: '12px', backgroundColor: '#e2e8f0', color: '#64748b', fontSize: '14px' }}>
                                AI is typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid #e2e8f0', padding: '10px', backgroundColor: 'white' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '20px', marginRight: '8px' }}
                        />
                        <button type="submit" disabled={loading} style={{
                            background: '#4361ee', color: 'white', border: 'none',
                            borderRadius: '50%', width: '36px', height: '36px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                        }}>
                            <FiSend size={16} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AIAssistant;
