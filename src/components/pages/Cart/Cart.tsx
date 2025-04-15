import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CartItem } from '../../../@types/CartItem';
import { fetchCart, removeFromCart } from '../../../redux/slices/cartSlice';
import { AppDispatch, RootState } from '../../../redux/store';
import BackButton from '../../UI/BackButton';
import styles from './Cart.module.scss';

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const cartItems = useSelector(
    (state: RootState) => state.cartSlice.items,
  ) as CartItem[];
  console.log(cartItems);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0,
  );

  React.useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemoveFromCart = (itemId: number) => {
    dispatch(removeFromCart(itemId));
  };

  return (
    <div className={styles.cart}>
      <div className={styles.cart__backButton}>
        <BackButton />
      </div>
      <h2 className={styles.cart__title}>Корзина</h2>

      {cartItems.length > 0 ? (
        <>
          {cartItems.map(item => (
            <div
              className={styles.cart__item}
              key={item.product_id + item.size}
            >
              <img
                onClick={() =>
                  navigate(
                    `/${item.title?.toLocaleLowerCase().replace(/ /g, '_')}`,
                  )
                }
                style={{ width: '200px' }}
                src={item.images?.[0] || null}
                className="img-thumbnail"
                alt={item.title || 'Product'}
              />

              <div className={styles.cart__infoItem}>
                <h3>{item.title || 'No Title'}</h3>
                <h4>{item.price + '$'}</h4>
                <h4>Размер: {item.size}</h4>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  Удалить из корзины
                </button>
              </div>
            </div>
          ))}

          <h2 className="total">Итоговая цена: {totalPrice.toFixed(2)}$</h2>
        </>
      ) : (
        <p>Корзина пуста.</p>
      )}
    </div>
  );
}
