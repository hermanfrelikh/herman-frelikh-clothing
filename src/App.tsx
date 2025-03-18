import { Route, Routes } from 'react-router-dom';

import './App.scss';

import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Product } from './@types/Product';
import Cart from './components/pages/Cart';
import Layout from './components/pages/Layout';
import MainPage from './components/pages/MainPage';
import ProductPage from './components/pages/ProductPage';
import Profile from './components/pages/Profile';
import GenderProduct from './components/UI/GenderProduct';
import PopularProducts from './components/UI/PopularProducts';
import { setProducts } from './redux/slices/ProductsSlice';
import { RootState } from './redux/store';

function App() {
  const products = useSelector((state: RootState) => state.productsSlice);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        dispatch(setProducts(data));
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []);
  console.log(products);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {products.map((item: Product) => (
          <Route
            key={item.id}
            path={'/' + item.title.toLocaleLowerCase().replace(/ /g, '_')}
            element={<ProductPage product={item} />}
          />
        ))}
        <Route path="/" element={<MainPage />}>
          <Route
            path="/"
            element={
              <PopularProducts
                popularProducts={[...products]
                  .sort((a: Product, b: Product) => b.rating - a.rating)
                  .slice(0, 10)}
              />
            }
          />
          <Route path="/woman" element={<GenderProduct gender={'woman'} />} />
          <Route path="/man" element={<GenderProduct gender={'man'} />} />
        </Route>
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<h1>404</h1>} />
        <Route path="/woman" element={<GenderProduct gender={'woman'} />} />
        <Route path="/man" element={<GenderProduct gender={'man'} />} />
      </Route>

      <Route path="login" element={<h1>login</h1>} />
      <Route path="registration" element={<h1>404</h1>} />
    </Routes>
  );
}

export default App;
