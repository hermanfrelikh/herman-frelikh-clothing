import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Product } from '../../../@types/Product';
import { addToCart, removeFromCart } from '../../../redux/slices/cartSlice';
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

  const dispatch = useDispatch<AppDispatch>();

  // Получаем данные корзины из Redux
  const cartItems = useSelector((state: RootState) => state.cartSlice.items);

  // Проверяем, есть ли товар с выбранным размером в корзине
  const isItemInCart = cartItems.some(
    item => item.product_id === product.id && item.size === size,
  );

  // Отслеживаем изменения в данных корзины
  useEffect(() => {
    console.log('Cart items updated:', cartItems); // Логируем для отладки
  }, [cartItems]);

  // Обработчик добавления/удаления товара из корзины
  const handleCartClick = () => {
    if (isItemInCart) {
      // Если товар уже в корзине, удаляем его
      const cartItem = cartItems.find(
        item => item.product_id === product.id && item.size === size,
      );
      if (cartItem) {
        dispatch(removeFromCart(cartItem.id));
        setShowCartAlert(true);
        setTimeout(() => setShowCartAlert(false), 2000);
      }
    } else {
      // Если товара нет в корзине, добавляем его
      dispatch(
        addToCart({
          product_id: product.id,
          size,
          quantity: 1,
        }),
      );
      setShowCartAlert(true);
      setTimeout(() => setShowCartAlert(false), 2000);
    }
  };

  return (
    <div className={styles.container}>
      {/* Кнопка "Назад" */}
      <BackButton />

      {/* Карусель изображений продукта */}
      <ProductCarousel product={product} />

      {/* Информация о продукте */}
      <div className={styles.container__info}>
        <h3 className={styles.container__title}>{product.title}</h3>
        <h5 className={styles.container__price}>{product.price + '$'}</h5>

        {/* Рейтинг продукта */}
        <div className={styles.container__rating}>
          <span>Рейтинг: </span>
          <span>{product.rating}</span>
        </div>

        {/* Выбор размера */}
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

        {/* Кнопка добавления/удаления из корзины */}
        <button
          type="button"
          className={`btn ${isItemInCart ? 'btn-danger' : 'btn-success'}`}
          onClick={handleCartClick}
        >
          {isItemInCart ? 'Удалить из корзины' : 'В корзину'}
        </button>

        {/* Уведомление о добавлении/удалении из корзины */}
        {showCartAlert && (
          <div
            style={{ width: '270px' }}
            className={`alert ${isItemInCart ? 'alert-danger' : 'alert-success'} ${
              styles.fadeInOut
            }`}
            role="alert"
          >
            {isItemInCart
              ? 'Товар удален из корзины'
              : 'Товар добавлен в корзину'}
          </div>
        )}
      </div>
    </div>
  );
});

export default ProductPage;
