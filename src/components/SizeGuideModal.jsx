import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Send, ChevronDown, Ruler, Footprints, Sparkles } from 'lucide-react';
import './SizeGuideModal.css';

const API_URL = '';

const sizeChartData = [
  { us: '6', eu: '38', cm: '24', inch: '9.5' },
  { us: '7', eu: '39', cm: '25', inch: '9.8' },
  { us: '8', eu: '40', cm: '26', inch: '10.2' },
  { us: '9', eu: '41', cm: '27', inch: '10.6' },
  { us: '10', eu: '42', cm: '28', inch: '11' },
  { us: '11', eu: '43', cm: '29', inch: '11.4' },
  { us: '12', eu: '44', cm: '30', inch: '11.8' },
  { us: '13', eu: '45', cm: '31', inch: '12.2' },
];

const SizeGuideModal = ({ isOpen, onClose, product = null }) => {
  const [activeTab, setActiveTab] = useState('chart');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Xin chào! Tôi là trợ lý AI của Sneaker Store.',
      subtext: 'Tôi có thể giúp bạn chọn size giày phù hợp. Bạn cần tư vấn gì?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickQuestions = [
    'Chân tôi 26cm nên đi size bao nhiêu?',
    'Nike Air Max chạy size nào?',
    'Hướng dẫn đo chân tại nhà',
    'Giày sneakers vs Running size khác nhau không?'
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Build context with product info if available
    let contextPrompt = input;
    if (product) {
      contextPrompt = `Sản phẩm khách đang xem: ${product.name} (${product.brand}). Brand: ${product.brand}. Sizes available: ${product.sizes?.join(', ') || 'N/A'}. Câu hỏi: ${input}`;
    }

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: contextPrompt })
      });
      const data = await response.json();

      if (data.reply) {
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: data.reply
        }]);
      } else {
        throw new Error('No AI response');
      }
    } catch (error) {
      // Fallback responses
      const fallbackResponses = {
        'size': 'Để chọn size giày chính xác, bạn nên đo chân vào cuối ngày (khi chân nở to nhất). Đo chiều dài từ gót đến ngón dài nhất, rồi đối chiếu với bảng size của chúng tôi. Nếu nằm giữa 2 size, tôi khuyên bạn chọn size lớn hơn một chút để thoải mái hơn.',
        '26cm': 'Với chân 26cm, bạn nên chọn US 9 / EU 42. Tuy nhiên, tùy thuộc vào form giày (wide/narrow) và thương hiệu, bạn có thể cần US 8.5 hoặc US 9.5. Hãy kiểm tra reviews từ khách hàng khác để biết thêm chi tiết!',
        'nike': 'Giày Nike thường có form hơi nhỏ. Với Nike, tôi khuyên bạn chọn size lớn hơn 0.5 so với size thường. Ví dụ: nếu bạn đi US 9 thường, hãy thử US 9.5 cho Nike.',
        'đo': 'Cách đo chân chính xác:\n1. Chuẩn bị tờ giấy A4, đặt sát tường\n2. Đặt chân lên giấy, gót chạm tường\n3. Đánh dấu điểm dài nhất của ngón chân\n4. Đo khoảng cách từ mép giấy đến dấu\n5. Làm tương tự với chân kia (vì 2 chân thường không đều nhau)'
      };

      let response = fallbackResponses['size'];
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('26cm') || lowerInput.includes('26 cm')) {
        response = fallbackResponses['26cm'];
      } else if (lowerInput.includes('nike')) {
        response = fallbackResponses['nike'];
      } else if (lowerInput.includes('đo') || lowerInput.includes('hướng dẫn') || lowerInput.includes('đo chân')) {
        response = fallbackResponses['đo'];
      }

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: response
      }]);
    }

    setIsTyping(false);
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    handleSend();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="size-guide-overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="size-guide-modal"
        >
          {/* Header */}
          <div className="sg-header">
            <div className="sg-title">
              <Ruler size={22} />
              <h2>Hướng dẫn chọn Size</h2>
            </div>
            <button className="sg-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="sg-tabs">
            <button
              className={`sg-tab ${activeTab === 'chart' ? 'active' : ''}`}
              onClick={() => setActiveTab('chart')}
            >
              <Footprints size={16} />
              Bảng Size
            </button>
            <button
              className={`sg-tab ${activeTab === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              <Sparkles size={16} />
              AI Tư vấn
            </button>
          </div>

          {/* Content */}
          <div className="sg-content">
            {activeTab === 'chart' && (
              <div className="sg-chart-section">
                {product && (
                  <div className="sg-product-info">
                    <img src={product.image} alt={product.name} />
                    <div>
                      <span className="product-brand">{product.brand}</span>
                      <h4>{product.name}</h4>
                      <span className="product-sizes">
                        Sizes: {product.sizes?.join(', ') || 'All sizes available'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="size-chart">
                  <h3>Bảng chuyển đổi Size</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>US</th>
                        <th>EU</th>
                        <th>CM</th>
                        <th>INCH</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeChartData.map((row) => (
                        <tr key={row.us}>
                          <td className="size-us">{row.us}</td>
                          <td>{row.eu}</td>
                          <td>{row.cm}</td>
                          <td>{row.inch}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="size-tips">
                  <h4>Mẹo chọn size</h4>
                  <ul>
                    <li>Đo chân vào <strong>cuối ngày</strong> (chân sẽ nở to hơn)</li>
                    <li>Đo <strong>cả 2 chân</strong> và chọn size theo chân lớn hơn</li>
                    <li>Nếu nằm giữa 2 size → chọn <strong>size lớn hơn</strong></li>
                    <li>Với form giày <strong>athletic/running</strong>: thêm 0.5 size</li>
                    <li>Luôn đọc <strong>reviews</strong> về fit của sản phẩm</li>
                  </ul>
                </div>

                <button
                  className="sg-ai-btn"
                  onClick={() => setActiveTab('ai')}
                >
                  <Bot size={18} />
                  Hỏi AI để được tư vấn chính xác hơn
                </button>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="sg-ai-section">
                {product && (
                  <div className="sg-product-info sg-product-small">
                    <img src={product.image} alt={product.name} />
                    <div>
                      <h4>{product.name}</h4>
                      <span>{product.sizes?.join(', ')}</span>
                    </div>
                  </div>
                )}

                <div className="sg-chat">
                  <div className="sg-messages">
                    {messages.map((msg, index) => (
                      <div key={index} className={`sg-message ${msg.sender}`}>
                        <div className="sg-message-content">
                          <p>{msg.text}</p>
                          {msg.subtext && <p className="sg-subtext">{msg.subtext}</p>}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="sg-message bot">
                        <div className="sg-message-content">
                          <div className="sg-typing">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="sg-quick-questions">
                    <p>Hỏi nhanh:</p>
                    <div className="sg-quick-btns">
                      {quickQuestions.map((q, i) => (
                        <button key={i} onClick={() => handleQuickQuestion(q)}>
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sg-input-area">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Hỏi về size giày..."
                    />
                    <button onClick={handleSend} disabled={!input.trim()}>
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SizeGuideModal;
