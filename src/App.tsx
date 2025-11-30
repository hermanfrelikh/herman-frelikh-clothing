import { Route, Routes } from 'react-router-dom';

import './App.scss';

import axios from 'axios';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Product } from './@types/Product';
import Cart from './components/pages/Cart';
import Favorites from './components/pages/Favorites';
import Layout from './components/pages/Layout';
import Login from './components/pages/Login';
import MainPage from './components/pages/MainPage';
import ProductPage from './components/pages/ProductPage';
import Profile from './components/pages/Profile';
import Registration from './components/pages/Registration';
import PrivateRoute from './components/PrivateRoute';
import GenderProduct from './components/UI/GenderProduct';
import PopularProducts from './components/UI/PopularProducts';
import { setProducts } from './redux/slices/productsSlice';
import { RootState } from './redux/store';

function App() {
  const products = useSelector((state: RootState) => state.productsSlice);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    axios
      .get('http://localhost:3002/api/products')
      .then(function (response) {
        dispatch(setProducts(response.data));
      })
      .catch(function (error) {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []);

  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
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

          <Route path="/favorites" element={<Favorites />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          {products.map((item: Product) => (
            <Route
              key={item.id}
              path={'/' + item.title.toLocaleLowerCase().replace(/ /g, '_')}
              element={<ProductPage product={item} />}
            />
          ))}
        </Route>
      </Route>

      <Route path="/registration" element={<Registration />} />
      <Route path="/login" element={<Login />} />

      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default App;
