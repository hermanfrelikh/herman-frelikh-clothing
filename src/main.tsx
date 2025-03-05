import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx';

import './index.scss';

import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
