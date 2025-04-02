import Rating from '@mui/material/Rating';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Product } from '../../../@types/Product';
import { removeCartItem, setCartItem } from '../../../redux/slices/cartSlice';
import {
  removeFavorites,
  setFavorites,
} from '../../../redux/slices/favoritesSlice';
import { RootState } from '../../../redux/store';
import BackButton from '../../UI/BackButton';
import ProductCarousel from '../../UI/ProductCarousel';
import styles from './ProductPage.module.scss';

interface ProductPageProps {
  product: Product;
}

const ProductPage: React.FC<ProductPageProps> = React.memo(({ product }) => {
  const [size, setSize] = useState<string>(product.sizes[0]);
  const [showFavoriteAlert, setShowFavoriteAlert] = useState<boolean>(false);
  const [showCartAlert, setShowCartAlert] = useState<boolean>(false);
  const favoritesProducts = useSelector(
    (state: RootState) => state.favoritesSlice,
  );
  const cartItems = useSelector((state: RootState) => state.cartSlice);
  const dispatch = useDispatch();

  const [isFavorite, setIsFavorite] = useState<boolean>(() =>
    favoritesProducts.some(
      (favProduct: Product) => favProduct.id === product.id,
    ),
  );
  const [inCart, setInCart] = useState<boolean>(() =>
    cartItems.some((cartItem: any) => cartItem.id === product.id),
  );

  useEffect(() => {
    setIsFavorite(
      favoritesProducts.some(
        (favProduct: Product) => favProduct.id === product.id,
      ),
    );
    setInCart(cartItems.some((cartItem: any) => cartItem.id === product.id));
  }, [favoritesProducts, cartItems, product.id]);

  const handleFavoriteClick = () => {
    if (!isFavorite) {
      dispatch(setFavorites(product));
    } else {
      dispatch(removeFavorites(product));
    }
    setIsFavorite(!isFavorite);
    setShowFavoriteAlert(true);
    setTimeout(() => setShowFavoriteAlert(false), 2000);
  };

  const handleCartClick = () => {
    if (!inCart) {
      dispatch(
        setCartItem({
          id: product.id,
          title: product.title,
          price: product.price,
          images: product.images,
          size: size,
          rating: product.rating,
          gender: product.gender,
          category: product.category,
        }),
      );
      setShowCartAlert(true);
      setTimeout(() => setShowCartAlert(false), 2000);
    } else {
      dispatch(
        removeCartItem({
          id: product.id,
          title: product.title,
          price: product.price,
          images: product.images,
          size: size,
          rating: product.rating,
          gender: product.gender,
          category: product.category,
        }),
      );
      setShowCartAlert(true);
      setTimeout(() => setShowCartAlert(false), 2000);
    }
    setInCart(!inCart);
  };

  return (
    <>
      <div className={styles.container}>
        <BackButton />
        <ProductCarousel product={product} />
        <div className={styles.container__info}>
          <h3 className={styles.container__title}>{product.title}</h3>
          <h5 className={styles.container__price}>{product.price + '$'}</h5>

          <Rating
            name="half-rating-read"
            defaultValue={product.rating}
            precision={0.1}
            readOnly
            className={styles.container__rating}
          />

          <select
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setSize(product.sizes[+e.target.value])
            }
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
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleFavoriteClick}
            style={{ marginRight: '20px' }}
          >
            {isFavorite ? 'Удалить из избранного' : 'В избранное'}
          </button>
          <button
            type="button"
            className={`btn ${inCart ? 'btn-danger' : 'btn-success'}`}
            onClick={handleCartClick}
          >
            {inCart ? 'Удалить из корзины' : 'В корзину'}
          </button>
          {showFavoriteAlert && (
            <div
              style={{ width: '270px' }}
              className={`alert alert-light ${styles.fadeInOut}`}
              role="alert"
            >
              {!isFavorite
                ? 'Товар удалён из избранных'
                : 'Товар добавлен в избранные'}
            </div>
          )}
          {showCartAlert && (
            <div
              style={{ width: '270px' }}
              className={`alert alert-${inCart ? 'success' : 'danger'} ${styles.fadeInOut}`}
              role="alert"
            >
              {!inCart ? 'Товар удалён из корзины' : 'Товар добавлен в корзину'}
            </div>
          )}
        </div>
      </div>
    </>
  );
});

export default ProductPage;
