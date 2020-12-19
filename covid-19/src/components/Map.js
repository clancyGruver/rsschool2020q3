import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default class Map extends React.Component {
  render() {
    const containerStyle = {height: '100%'};
    return (
      <MapContainer center={[51.505, -0.09]} zoom={3} scrollWheelZoom={false} style={containerStyle}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    );
  }
}