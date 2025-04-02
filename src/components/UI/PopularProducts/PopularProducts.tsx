import React from 'react';

import { Product } from '../../../@types/Product';
import Products from '../Products';
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
        <Products products={popularProducts} />
      </div>
    </div>
  );
};

export default PopularProducts;
