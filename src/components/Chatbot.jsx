import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import { mockSneakers } from '../data/mockData';

const API_URL = '';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="M21 21l-4.35-4.35"></path>
  </svg>
);

const CompareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 3h5v5M8 3H3v5M3 16v5h5M21 16v5h-5M3 12h18"></path>
  </svg>
);

const SizeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22M18 2v4M18 6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12z"></path>
  </svg>
);

const PromoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const HandIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tab-icon">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const ProductIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tab-icon">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const HelpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tab-icon">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

function Chatbot({ onAddToCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      type: 'welcome',
      text: 'Xin chao!',
      subtext: 'Toi la tro ly cua Sneaker Store. Toi co the giup ban tim giay ung y!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const categories = [
    { id: 'all', name: 'Tat ca' },
    { id: 'Running', name: 'Chay bo' },
    { id: 'Casual', name: 'Casual' },
    { id: 'Sneakers', name: 'Sneaker' },
    { id: 'Sale', name: 'Giam gia' }
  ];

  const filteredProducts = selectedCategory === 'all'
    ? mockSneakers
    : mockSneakers.filter(p => p.category === selectedCategory);

  const quickActions = [
    { id: 'search', text: 'Tim kiem giay', icon: SearchIcon, color: '#667eea' },
    { id: 'compare', text: 'So sanh san pham', icon: CompareIcon, color: '#f093fb' },
    { id: 'size', text: 'Huong dan chon size', icon: SizeIcon, color: '#4facfe' },
    { id: 'promo', text: 'Khuyen mai hien co', icon: PromoIcon, color: '#43e97b' }
  ];

  const handleProductSelect = async (product) => {
    setMessages(prev => [...prev, {
      sender: 'user',
      type: 'product-query',
      text: `Cho toi xem: ${product.name}`,
      product
    }]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        sender: 'bot',
        type: 'product-info',
        product,
        actions: [
          { label: 'Them vao gio', action: 'add-cart' },
          { label: 'Xem chi tiet', action: 'view-detail' },
          { label: 'Hoi them', action: 'ask-more' }
        ]
      }]);
    }, 800);
  };

  const handleQuickAction = (action) => {
    const actionTexts = {
      search: 'Toi muon tim giay',
      compare: 'So sanh cac dong giay Nike va Adidas',
      size: 'Huong dan chon size giay',
      promo: 'Cac khuyen mai hien tai la gi?'
    };

    setMessages(prev => [...prev, {
      sender: 'user',
      type: 'action',
      text: actionTexts[action]
    }]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      const responses = {
        search: {
          text: 'Toi se giup ban tim giay!',
          subtext: 'Ban co the duyet danh sach san pham hoac mo ta giay ban muon tim.'
        },
        compare: {
          text: 'So sanh Nike vs Adidas:',
          details: [
            '**Nike**: Thien ve cong nghe Air Max, phong cach the thao manh me, phu hop van dong',
            '**Adidas**: Noi tieng voi Boost foam, thiet ke sleek, phu hop ca di pho lan gym',
            '**Goi y**: Ca hai deu chat luong cao, hay chon theo phong cach ca nhan cua ban!'
          ]
        },
        size: {
          text: 'Huong dan chon size giay:',
          details: [
            'Do chan vao cuoi ngay (chan se no ra)',
            'Chieu dai stopa = size giay (cm)',
            '**Size chart**: US 7=25cm, US 8=26cm, US 9=27cm, US 10=28cm, US 11=29cm',
            'Neu between sizes, chon size lon hon mot chut de thoai mai hon'
          ]
        },
        promo: {
          text: 'Khuyen mai hien tai:',
          details: [
            '**Giam 20%** voi ma: SNEAKER20',
            '**Freeship** cho don tu 500k',
            '**Buy 2 get 1** phu kien cho don tu 1 trieu',
            'Khuyen mai den het thang nay!'
          ]
        }
      };

      const response = responses[action];
      setMessages(prev => [...prev, {
        sender: 'bot',
        type: 'response',
        ...response
      }]);
    }, 1000);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(async () => {
      setIsTyping(false);

      try {
        const response = await fetch(`${API_URL}/api/products/search?q=${encodeURIComponent(input)}`);
        const products = await response.json();

        if (products.length > 0) {
          setMessages(prev => [...prev, {
            sender: 'bot',
            type: 'search-results',
            query: input,
            products: products.slice(0, 3)
          }]);
        } else {
          // Try Claude AI when no products found
          try {
            const chatResponse = await fetch(`${API_URL}/api/chat`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: input })
            });
            const chatData = await chatResponse.json();

            if (chatData.reply) {
              setMessages(prev => [...prev, {
                sender: 'bot',
                type: 'ai-response',
                text: chatData.reply
              }]);
            } else {
              throw new Error('No AI response');
            }
          } catch (aiError) {
            // Fallback message when AI fails
            setMessages(prev => [...prev, {
              sender: 'bot',
              type: 'no-results',
              text: 'Hmm, toi khong tim thay san pham nao phu hop.',
              suggestion: 'Thu mo ta khac hoac duyet san pham theo danh muc nhe!'
            }]);
          }
        }
      } catch (error) {
        // Try local search as fallback
        const searchTerm = input.toLowerCase();
        const matchedProducts = mockSneakers.filter(p =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.brand.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm)
        );

        if (matchedProducts.length > 0) {
          setMessages(prev => [...prev, {
            sender: 'bot',
            type: 'search-results',
            query: input,
            products: matchedProducts.slice(0, 3)
          }]);
        } else {
          // Try Claude AI as final fallback
          try {
            const chatResponse = await fetch(`${API_URL}/api/chat`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: input })
            });
            const chatData = await chatResponse.json();

            if (chatData.reply) {
              setMessages(prev => [...prev, {
                sender: 'bot',
                type: 'ai-response',
                text: chatData.reply
              }]);
            } else {
              throw new Error('No AI response');
            }
          } catch (aiError) {
            setMessages(prev => [...prev, {
              sender: 'bot',
              type: 'no-results',
              text: 'Hmm, toi khong tim thay san pham nao phu hop.',
              suggestion: 'Thu mo ta khac hoac duyet san pham theo danh muc nhe!'
            }]);
          }
        }
      }
    }, 1200);
  };

  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
      setMessages(prev => [...prev, {
        sender: 'bot',
        type: 'success',
        text: `Da them **${product.name}** vao gio hang!`,
        subtext: 'Ban co the tiep tuc mua sam hoac den gio hang de thanh toan.'
      }]);
    }
  };

  const renderMessage = (msg, index) => {
    switch (msg.type) {
      case 'welcome':
        return (
          <div key={index} className="message bot welcome">
            <div className="message-content">
              <div className="welcome-icon">
                <HandIcon />
              </div>
              <div className="welcome-text">
                <p className="main-text">{msg.text}</p>
                <p className="sub-text">{msg.subtext}</p>
              </div>
            </div>
          </div>
        );

      case 'product-query':
        return (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-content">
              <p>{msg.text}</p>
              {msg.product && (
                <div className="product-query-card">
                  <img src={msg.product.image} alt={msg.product.name} />
                  <div className="product-query-info">
                    <span className="brand">{msg.product.brand}</span>
                    <span className="name">{msg.product.name}</span>
                    <span className="price">
                      {msg.product.salePrice
                        ? <><span className="original">{msg.product.price.toLocaleString()}d</span> {msg.product.salePrice.toLocaleString()}d</>
                        : `${msg.product.price?.toLocaleString()}d`
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'product-info':
        return (
          <div key={index} className="message bot product-info">
            <div className="message-content">
              <div className="product-detail-card">
                <img src={msg.product.image} alt={msg.product.name} />
                <div className="product-detail-info">
                  <span className="product-brand">{msg.product.brand}</span>
                  <h4>{msg.product.name}</h4>
                  <p className="product-desc">{msg.product.description}</p>
                  <div className="product-meta">
                    <span className="price">
                      {msg.product.salePrice
                        ? <><span className="sale-price">{msg.product.salePrice.toLocaleString()}d</span><span className="original-price">{msg.product.price.toLocaleString()}d</span></>
                        : `${msg.product.price?.toLocaleString()}d`
                      }
                    </span>
                    <span className="rating">
                      <StarIcon />
                      {msg.product.rating} ({msg.product.reviews})
                    </span>
                  </div>
                  <div className="product-sizes">
                    <span>Size:</span>
                    <div className="sizes-list">
                      {msg.product.sizes?.map(size => (
                        <span key={size} className="size-chip">{size}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {msg.actions && (
                <div className="product-actions">
                  {msg.actions.map((action, i) => (
                    <button
                      key={i}
                      className={`action-btn ${action.action === 'add-cart' ? 'primary' : ''}`}
                      onClick={() => action.action === 'add-cart' ? handleAddToCart(msg.product) : null}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'search-results':
        return (
          <div key={index} className="message bot search-results">
            <div className="message-content">
              <p>Tim thay san pham cho "{msg.query}":</p>
              <div className="search-results-list">
                {msg.products.map((p, i) => (
                  <div key={i} className="search-result-item" onClick={() => handleProductSelect(p)}>
                    <img src={p.image} alt={p.name} />
                    <div className="result-info">
                      <span className="brand">{p.brand}</span>
                      <span className="name">{p.name}</span>
                      <span className="price">
                        {p.salePrice
                          ? <><span className="sale">{p.salePrice.toLocaleString()}d</span><span className="original">{p.price.toLocaleString()}d</span></>
                          : `${p.price?.toLocaleString()}d`
                        }
                      </span>
                    </div>
                    <span className="view-btn">Xem &rarr;</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'response':
        return (
          <div key={index} className="message bot response">
            <div className="message-content">
              <p className="main-text">{msg.text}</p>
              {msg.details && (
                <div className="details-list">
                  {msg.details.map((detail, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: detail.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  ))}
                </div>
              )}
              {msg.subtext && <p className="sub-text">{msg.subtext}</p>}
            </div>
          </div>
        );

      case 'no-results':
        return (
          <div key={index} className="message bot no-results">
            <div className="message-content">
              <p>{msg.text}</p>
              <p className="sub-text">{msg.suggestion}</p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div key={index} className="message bot success">
            <div className="message-content">
              <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              <p className="sub-text">{msg.subtext}</p>
            </div>
          </div>
        );

      case 'action':
        return (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-content">
              <p>{msg.text}</p>
            </div>
          </div>
        );

      default:
        return (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-content">
              <p>{msg.text}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-info">
              <div className="avatar">S</div>
              <div className="header-text">
                <span className="name">Sneaker Store</span>
                <span className="status">
                  <span className="online-dot"></span>
                  Đang trực tuyến
                </span>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="chatbot-tabs">
            <button
              className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <ChatIcon />
              Trò chuyện
            </button>
            <button
              className={`tab ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <ProductIcon />
              San pham
            </button>
            <button
              className={`tab ${activeTab === 'help' ? 'active' : ''}`}
              onClick={() => setActiveTab('help')}
            >
              <HelpIcon />
              Ho tro
            </button>
          </div>

          {activeTab === 'chat' && (
            <>
              <div className="chatbot-messages">
                {messages.map((msg, index) => renderMessage(msg, index))}

                {isTyping && (
                  <div className="message bot typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="chatbot-input-container">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Nhắn tin hỏi về sản phẩm..."
                />
                <button className="send-btn" onClick={handleSend}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </>
          )}

          {activeTab === 'products' && (
            <div className="products-browser">
              <div className="category-filter">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                      {product.isNew && <span className="badge new">Moi</span>}
                      {product.salePrice && <span className="badge sale">Giảm</span>}
                    </div>
                    <div className="product-info">
                      <span className="brand">{product.brand}</span>
                      <h4>{product.name}</h4>
                      <div className="price-row">
                        <span className="price">
                          {product.salePrice
                            ? <><span className="sale">{product.salePrice.toLocaleString()}d</span> <span className="original">{product.price.toLocaleString()}d</span></>
                            : `${product.price?.toLocaleString()}d`
                          }
                        </span>
                      </div>
                      <div className="product-card-actions">
                        <button className="ask-btn" onClick={() => handleProductSelect(product)}>
                          Hoi ngay
                        </button>
                        <button className="cart-btn" onClick={() => handleAddToCart(product)}>
                          <CartIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="help-section">
              <div className="help-header">
                <h3>Tôi có thể giúp gì?</h3>
                <p>Chọn một hành động nhanh hoặc nhắn tin để được hỗ trợ</p>
              </div>

              <div className="quick-actions">
                {quickActions.map(action => (
                  <button
                    key={action.id}
                    className="quick-action-btn"
                    onClick={() => handleQuickAction(action.id)}
                    style={{ '--action-color': action.color }}
                  >
                    <span className="action-icon">
                      <action.icon />
                    </span>
                    <span className="action-text">{action.text}</span>
                  </button>
                ))}
              </div>

              <div className="faq-section">
                <h4>Câu hỏi thường gặp</h4>
                <div className="faq-list">
                  <details>
                    <summary>Chính sách đổi trả như thế nào?</summary>
                    <p>Đổi trả trong 30 ngày với sản phẩm chưa sử dụng, còn nguyên tem mác. Liên hệ chat để được hỗ trợ.</p>
                  </details>
                  <details>
                    <summary>Thời gian giao hàng bao lâu?</summary>
                    <p>Nội thành: 1-2 ngày. Ngoại thành: 3-5 ngày. Miễn phí vận chuyển cho đơn từ 500k.</p>
                  </details>
                  <details>
                    <summary>Hỗ trợ những hình thức thanh toán nào?</summary>
                    <p>Thanh toán COD (nhận hàng rồi trả tiền), Chuyển khoản ngân hàng, Ví điện tử (Momo, ZaloPay).</p>
                  </details>
                  <details>
                    <summary>Làm sao biết giày chính hãng?</summary>
                    <p>Tất cả sản phẩm tại Sneaker Store đều là hàng chính hãng 100%, có bill đó và bảo hành 6 tháng.</p>
                  </details>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <div className="toggle-content">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className="notification-dot"></span>
          </div>
        )}
      </button>
    </div>
  );
}

export default Chatbot;
