import React from 'react';

import { Product } from '../../../@types/Product';
import Card from '../Сard';
import styles from './Products.module.scss';

interface ProductsProps {
  products: Product[]; // Массив товаров
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  // Проверяем, есть ли товары в массиве
  if (!products || products.length === 0) {
    return <p className={styles.emptyMessage}>Список пуст</p>;
  }

  return (
    <div className={styles.products}>
      {/* Отображаем карточки товаров */}
      {products.map(item => (
        <Card
          key={item.id}
          image={
            Array.isArray(item.images) && item.images.length > 0
              ? item.images[0]
              : null
          }
          title={item.title}
          price={item.price}
          secondImage={
            Array.isArray(item.images) && item.images.length > 1
              ? item.images[1]
              : ''
          }
        />
      ))}
    </div>
  );
};

export default Products;
