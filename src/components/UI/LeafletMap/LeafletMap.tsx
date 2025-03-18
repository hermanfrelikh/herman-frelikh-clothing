import React, { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import styles from './LeafletMap.module.scss';

const position: [number, number] = [55.73006701689417, 37.56948505115052];

const MapEvents: React.FC<{ onMapClick: () => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: () => {
      onMapClick();
    },
  });

  return null;
};

const LeafletMap: React.FC = () => {
  const [isMapActive, setIsMapActive] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const handleMapClick = () => {
    setIsMapActive(true);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const mapElement = document.querySelector('.leaflet-container');
    if (mapElement && !mapElement.contains(event.target as Node)) {
      setIsMapActive(false);
    }
  };

  useEffect(() => {
    if (isMapActive) {
      document.addEventListener('click', handleOutsideClick);
      mapRef.current?.dragging.enable();
      mapRef.current?.scrollWheelZoom.enable();
    } else {
      document.removeEventListener('click', handleOutsideClick);
      mapRef.current?.dragging.disable();
      mapRef.current?.scrollWheelZoom.disable();
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isMapActive]);

  return (
    <div className={styles.map}>
      <MapContainer
        ref={mapRef}
        center={position}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        dragging={false}
        scrollWheelZoom={false}
      >
        <MapEvents onMapClick={handleMapClick} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
