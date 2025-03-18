import { useSelector } from 'react-redux';

import { Product } from '../../../@types/Product';
import { RootState } from '../../../redux/store';
import Card from '../Сard';

interface GenderProductProps {
  gender: string;
}

const GenderProduct: React.FC<GenderProductProps> = ({ gender }) => {
  const products: Product[] = useSelector(
    (state: RootState) => state.productsSlice,
  );
  return (
    <>
      {gender === 'man' ? (
        <div>
          <h2>Мужская одежда</h2>

          {[...products]
            .filter(item => item.gender === 'man')
            .map((item: Product) => (
              <Card
                key={item.id}
                image={item.images[0]}
                title={item.title}
                price={item.price}
                secondImage={item.images[1]}
              />
            ))}
        </div>
      ) : (
        <div>
          <h2>Женская одежда</h2>
          {[...products]
            .filter((item: Product) => item.gender === 'woman')
            .map((item: Product) => (
              <Card
                key={item.id}
                image={item.images[0]}
                title={item.title}
                price={item.price}
                secondImage={item.images[1]}
              />
            ))}
        </div>
      )}
    </>
  );
};
export default GenderProduct;
