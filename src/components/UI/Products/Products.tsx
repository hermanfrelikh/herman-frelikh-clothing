import { Product } from '../../../@types/Product';
import Card from '../Сard';
import styles from './Products.module.scss';

interface ProductsProps {
  products: Product[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  return (
    <div className={styles.products}>
      {products.map(item => (
        <Card
          key={item.id}
          image={item.images[0]}
          title={item.title}
          price={item.price}
          secondImage={item.images[1]}
        />
      ))}
    </div>
  );
};

export default Products;
