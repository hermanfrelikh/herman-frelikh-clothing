import React, { useState } from 'react';

import { Product } from '../../../@types/Product';
import styles from './ProductPage.module.scss';

interface ProductPageProps {
  product: Product;
}

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const [size, setSize] = useState<string>(product.sizes[0]);

  return (
    <>
      <div className={styles.container}>
        <p>{product.title}</p>
        <p>{product.price + '$'}</p>
        <p>{product.rating}</p>
        <select
          onChange={e => setSize(product.sizes[e.target.value])}
          style={{ width: '110px' }}
          className="form-select form-select-lg mb-3"
          aria-label="Large select example"
        >
          {product.sizes.map((size, index) => (
            <option key={index} value={index}>
              {size}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-secondary">
          В избранное
        </button>
        <button type="button" className="btn btn-success">
          В корзину
        </button>
        <div
          style={{ width: '270px' }}
          className="alert alert-light"
          role="alert"
        >
          Товар добавлен в избранные
        </div>
        <div
          style={{ width: '270px' }}
          className="alert alert-success"
          role="alert"
        >
          Товар добавлен в корзину
        </div>
        <div
          className={`carousel slide ${styles.container__slider}`}
          id="carouselExampleIndicators"
        >
          <div className="carousel-indicators">
            {product.images.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={index}
                className={index === 0 ? 'active' : ''}
                aria-current={index === 0 ? 'true' : undefined}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
          <div className="carousel-inner">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? 'active' : ''}`}
              >
                <img
                  src={image}
                  className="d-block w-100"
                  alt={`${product.title} Slide ${index + 1}`}
                />
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
