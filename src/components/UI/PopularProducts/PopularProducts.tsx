import React from 'react';

import { Product } from '../../../@types/Product';
import Card from '../Сard/Сard';
import styles from './PopularProducts.module.scss';

interface PopularProductsProps {
  popularProducts: Product[];
}

const PopularProducts: React.FC<PopularProductsProps> = ({
  popularProducts,
}) => {
  return (
    <div className={styles.popularProducts}>
      <h1 className={styles.popularProducts__title}>Популярные товары</h1>
      <div className={styles.popularProducts__container}>
        <div className={styles.popularProducts__products}>
          {popularProducts.map(item => (
            <Card
              key={item.id}
              image={item.images[0]}
              title={item.title}
              price={item.price}
              secondImage={item.images[1]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularProducts;
