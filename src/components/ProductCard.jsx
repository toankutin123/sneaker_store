import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product, layout = 'grid' }) => {
  const { addToCart } = useCart();

  const productId = product.id || product._id;
  const defaultSize = product.sizes?.[0] || '9';
  const isNew = product.isNew || product.isNewRelease;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, defaultSize);
  };

  const cardClasses = `product-card ${layout === 'horizontal' ? 'card-horizontal' : ''}`;

  return (
    <div className={cardClasses}>
      <Link to={`/product/${productId}`}>
        <div className="card-image-wrap">
          <img src={product.image} alt={product.name} className="card-image" loading="lazy" />

          {isNew && <span className="badge new-badge">Mới</span>}
          {product.salePrice && <span className="badge sale-badge">Giảm</span>}
          {product.isBestSeller && <span className="badge best-badge">Hot</span>}

          <button className="quick-add-btn" onClick={handleQuickAdd}>
            <ShoppingBag size={18} />
            Thêm vào giỏ
          </button>
        </div>

        <div className="card-info">
          <span className="card-brand">{product.brand}</span>
          <h3 className="card-title">{product.name}</h3>

          <div className="card-meta">
            <div className="card-rating">
              <Star size={14} fill="currentColor" strokeWidth={0} />
              <span>{Number(product.rating).toFixed(1)}</span>
              <span className="meta-count">({product.reviews || 0})</span>
            </div>
            <div className="card-sold">Đã bán {product.sold || 0}</div>
          </div>

          <div className="card-price">
            {product.salePrice ? (
              <>
                <span className="price-sale">${Number(product.salePrice).toFixed(2)}</span>
                <span className="price-original">${Number(product.price).toFixed(2)}</span>
              </>
            ) : (
              <span className="price-current">${Number(product.price).toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
