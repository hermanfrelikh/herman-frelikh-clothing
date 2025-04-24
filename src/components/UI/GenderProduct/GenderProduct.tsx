import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Product } from '../../../@types/Product';
import { setCategories } from '../../../redux/slices/categoriesSlice';
import { RootState } from '../../../redux/store';
import BackButton from '../BackButton';
import Products from '../Products';
import Search from '../Search';
import Sort from '../Sort'; // Добавляем компонент Sort
import styles from './GenderProduct.module.scss';

interface GenderProductProps {
  gender: string;
}

const manCategories = ['All', 'Tops', 'Joggers', 'Shorts'];
const womanCategories = ['All', 'Dresses', 'Swim'];

const GenderProduct: React.FC<GenderProductProps> = ({ gender }) => {
  const category = useSelector((state: RootState) => state.categoriesSlice);
  const dispatch = useDispatch();

  const products: Product[] = useSelector(
    (state: RootState) => state.productsSlice,
  );

  // Состояние для поискового запроса
  const [searchQuery, setSearchQuery] = useState('');

  // Состояние для типа сортировки
  const [sortType, setSortType] = useState('name-asc');

  // Функция для обновления поискового запроса
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Фильтрация продуктов по категории и поисковому запросу
  const filteredProducts = products
    .filter(item => item.gender === gender)
    .filter(item => category === 'All' || item.category === category)
    .filter(item =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  // Функция для сортировки продуктов
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortType) {
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating-asc':
        return a.rating - b.rating;
      case 'rating-desc':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.container__title}>
        {gender === 'man' ? 'Мужская одежда' : 'Женская одежда'}
      </h2>
      <BackButton />
      <div className={styles.container__categories}>
        {(gender === 'man' ? manCategories : womanCategories).map(item => {
          if (category === item) {
            return (
              <div className={styles.container__category__active} key={item}>
                {item}
              </div>
            );
          }
          return (
            <div
              onClick={() => dispatch(setCategories(item))}
              className={styles.container__category}
              key={item}
            >
              {item}
            </div>
          );
        })}
      </div>
      <div className={styles.container__products}>
        {/* Передаем функцию для обновления поискового запроса */}
        <Search onSearch={handleSearch} />
        {/* Компонент сортировки */}
        <Sort onSortChange={setSortType} />
        <Products products={sortedProducts} />
      </div>
    </div>
  );
};

export default GenderProduct;
