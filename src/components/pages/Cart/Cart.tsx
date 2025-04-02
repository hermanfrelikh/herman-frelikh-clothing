import { useSelector } from 'react-redux';

import { RootState } from '../../../redux/store';
import BackButton from '../../UI/BackButton';

export default function Cart() {
  const cartItems = useSelector((state: RootState) => state.cartSlice);
  return (
    <div>
      <h2>Корзина</h2>
      <BackButton />
      {cartItems.map(item => (
        <div key={item.id}>
          <h1>{item.title}</h1>
          <h1>{item.price}</h1>
          <h1>{item.size}</h1>
        </div>
      ))}
    </div>
  );
}
