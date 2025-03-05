import { Route, Routes } from 'react-router-dom';

import './App.scss';

import Cart from './components/pages/Cart';
import Layout from './components/pages/Layout';
import MainPage from './components/pages/MainPage';
import Profile from './components/pages/Profile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<h1>404</h1>} />
      </Route>

      <Route path="login" element={<h1>login</h1>} />
      <Route path="registration" element={<h1>404</h1>} />
    </Routes>
  );
}

export default App;
