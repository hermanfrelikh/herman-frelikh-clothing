import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Product } from '../../../@types/Product';
import { addToCart } from '../../../redux/slices/cartSlice';
import {
  addToFavorites,
  removeFromFavorites,
} from '../../../redux/slices/favoritesSlice';
import { AppDispatch, RootState } from '../../../redux/store';
import BackButton from '../../UI/BackButton';
import ProductCarousel from '../../UI/ProductCarousel';
import styles from './ProductPage.module.scss';

interface ProductPageProps {
  product: Product;
}

const ProductPage: React.FC<ProductPageProps> = React.memo(({ product }) => {
  const [size, setSize] = useState<string>(product.sizes[0]);
  const [showCartAlert, setShowCartAlert] = useState<boolean>(false);
  const [showFavoritesAlert, setShowFavoritesAlert] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const favorites = useSelector(
    (state: RootState) => state.favoritesSlice.items,
  );

  const isFavorite = Array.isArray(favorites)
    ? favorites.some(item => item.id === product.id)
    : false;

  const handleCartClick = () => {
    dispatch(
      addToCart({
        product_id: product.id,
        size,
        quantity: 1,
        title: product.title,
        price: product.price,
        images: product.images,
      }),
    );
    setShowCartAlert(true);
    setTimeout(() => setShowCartAlert(false), 2000);
  };

  const handleFavoritesClick = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product.id));
    } else {
      dispatch(addToFavorites(product));
    }
    setShowFavoritesAlert(true);
    setTimeout(() => setShowFavoritesAlert(false), 2000);
  };

  return (
    <div className={styles.container}>
      <BackButton />

      <ProductCarousel product={product} />

      <div className={styles.container__info}>
        <h3 className={styles.container__title}>{product.title}</h3>
        <h5 className={styles.container__price}>{product.price + '$'}</h5>

        <div className={styles.container__rating}>
          <span>Рейтинг: </span>
          <span>{product.rating}</span>
        </div>

        <select
          value={product.sizes.indexOf(size)}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setSize(product.sizes[+e.target.value])
          }
          style={{ width: '110px' }}
          className="form-select form-select-lg mb-3"
          aria-label="Large select example"
        >
          {product.sizes.map((sizeOption, index) => (
            <option key={index} value={index}>
              {sizeOption}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="btn btn-success"
          onClick={handleCartClick}
        >
          Добавить в корзину
        </button>

        <button
          type="button"
          className={`btn ${isFavorite ? 'btn-danger' : 'btn-primary'} ms-2`}
          onClick={handleFavoritesClick}
        >
          {isFavorite ? 'Удалить из избранных' : 'Добавить в избранные'}
        </button>
        {showCartAlert && (
          <div
            style={{ width: '270px' }}
            className="alert alert-success fadeInOut"
            role="alert"
          >
            Товар добавлен в корзину
          </div>
        )}

        {showFavoritesAlert && (
          <div
            style={{ width: '270px' }}
            className={`alert ${
              isFavorite ? 'alert-success' : 'alert-danger'
            } fadeInOut`}
            role="alert"
          >
            {isFavorite
              ? 'Товар добавлен в избранные'
              : 'Товар удален из избранных'}
          </div>
        )}
      </div>
    </div>
  );
});

export default ProductPage;
