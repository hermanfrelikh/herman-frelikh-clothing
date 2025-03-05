import { Map, Placemark, YMaps } from 'react-yandex-maps';

import styles from './YandexMap.module.scss';

export default function YandexMap() {
  return (
    <div className={styles.map}>
      <YMaps>
        <Map
          style={{ height: '100%', width: '100%' }}
          defaultState={{
            center: [55.73006701689417, 37.56948505115052],
            zoom: 12,
          }}
        >
          <Placemark geometry={[55.73006701689417, 37.56948505115052]} />
        </Map>
      </YMaps>
    </div>
  );
}
