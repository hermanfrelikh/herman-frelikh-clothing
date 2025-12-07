// Favorites.tsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { clearFavoritesError } from '../../../redux/slices/favoritesSlice';
import { RootState } from '../../../redux/store';
import BackButton from '../../UI/BackButton';
import Products from '../../UI/Products';
import Search from '../../UI/Search';
import Sort from '../../UI/Sort';
import styles from './Favorites.module.scss';

export default function Favorites() {
  const dispatch = useDispatch();
  const favoritesState = useSelector(
    (state: RootState) => state.favoritesSlice,
  );
  const { items: favoritesProducts, loading, error } = favoritesState;

  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState('name-asc');

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearFavoritesError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredProducts = favoritesProducts.filter(item =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
    <div className={styles.favorites}>
      <div className={styles.favorites__backButton}>
        <BackButton />
      </div>

      <h2 className={styles.favorites__title}>Избранные</h2>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.favorites__search}>
        <Search onSearch={handleSearch} />
      </div>

      <div className={styles.favorites__sort}>
        <Sort onSortChange={setSortType} />
      </div>

      {loading ? (
        <p className={styles.loadingMessage}>Загрузка...</p>
      ) : sortedProducts.length === 0 ? (
        <p className={styles.emptyMessage}>
          {searchQuery
            ? 'Нет результатов по вашему запросу'
            : 'Список избранных товаров пуст'}
        </p>
      ) : (
        <Products products={sortedProducts.toReversed()} />
      )}
    </div>
  );
}
