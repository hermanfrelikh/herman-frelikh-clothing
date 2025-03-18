import { Outlet } from 'react-router-dom';

import LeafletMap from '../../UI/LeafletMap';
import MainCarousel from '../../UI/MainCarousel';
import Search from '../../UI/Search';
import WomanMan from '../../UI/WomanMan';

export default function MainPage() {
  return (
    <>
      <MainCarousel />

      <WomanMan />
      <Search />
      <Outlet />
      <LeafletMap />
    </>
  );
}
