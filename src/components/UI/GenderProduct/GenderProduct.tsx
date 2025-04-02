import { useDispatch, useSelector } from 'react-redux';

import { Product } from '../../../@types/Product';
import { setCategories } from '../../../redux/slices/categoriesSlice';
import { RootState } from '../../../redux/store';
import BackButton from '../BackButton';
import Products from '../Products';
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

  return (
    <>
      {gender === 'man' ? (
        <div className={styles.container}>
          <h2 className={styles.container__title}>Мужская одежда</h2>
          <BackButton />
          <div className={styles.container__categories}>
            {manCategories.map(item => {
              if (category === item) {
                return (
                  <div
                    className={styles.container__category__active}
                    key={item}
                  >
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
            {category === 'All' ? (
              <>
                <Products
                  products={[...products].filter(item => item.gender === 'man')}
                />
              </>
            ) : (
              <>
                <Products
                  products={[...products].filter(
                    item => item.gender === 'man' && item.category === category,
                  )}
                />
              </>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <h2 className={styles.container__title}>Женская одежда</h2>
          <BackButton />
          <div className={styles.container__categories}>
            {womanCategories.map(item => {
              if (category === item) {
                return (
                  <div
                    className={styles.container__category__active}
                    key={item}
                  >
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
            {category === 'All' ? (
              <>
                <Products
                  products={[...products].filter(
                    item => item.gender === 'woman',
                  )}
                />
              </>
            ) : (
              <>
                <Products
                  products={[...products].filter(
                    item =>
                      item.gender === 'woman' && item.category === category,
                  )}
                />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default GenderProduct;
