import { useSelector } from 'react-redux';

import { RootState } from '../../../redux/store';
import Products from '../../UI/Products';
import styles from './Favorites.module.scss';

export default function Favorites() {
  const favoritesProducts = useSelector(
    (state: RootState) => state.favoritesSlice,
  );

  return (
    <div className={styles.favorites}>
      <h2 className={styles.favorites__title}>Избранные</h2>
      <Products products={favoritesProducts.toReversed()} />
    </div>
  );
}
