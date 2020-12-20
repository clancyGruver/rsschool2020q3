import React from 'react';
import { GeoJSON, MapContainer, CircleMarker, Tooltip } from 'react-leaflet';
import WorldData from 'geojson-world-map';
// import MapLegend from './MapLegend';

import 'leaflet/dist/leaflet.css';

export default class Map extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      colors:{
        none: {
          color: '#4a83ec',
          weight: 0.5,
          fillColor: "#008500",
          fillOpacity: 1,
        },
        low: {
          color: '#4a83ec',
          weight: 0.5,
          fillColor: "#FFFF00",
          fillOpacity: 1,
        },
        medium: {
          color: '#4a83ec',
          weight: 0.5,
          fillColor: "#FF9200",
          fillOpacity: 1,
        },
        high: {
          color: '#4a83ec',
          weight: 0.5,
          fillColor: "#FF0000",
          fillOpacity: 1,
        },
      },
    };
  }

  markers() {
    if (this.props.markers) {
      return this.props.markers.map(marker => (
        <CircleMarker
          center={marker.coords}
          radius={marker.radius}
        >
          <Tooltip>{marker.countryName}: {marker.value} {marker.paramName}</Tooltip>
        </CircleMarker>
        ));
    } else {
      return null;
    }
  }

  tooltipShow(e) {
    const layer = e.layer;
    const toolTipVal = `
      <h5>${layer.feature.properties.name}</h5>
      <h6>${layer.feature.properties.cases || ''} ${layer.feature.properties.paramName || ''}</h6>
    `;
    layer.bindTooltip(toolTipVal).openTooltip();
    layer.feature.geometry.style = {
      color: 'black',
      weight: 0.5,
      fillColor: "red",
      fillOpacity: 1,
    }
  }

  clickToFeature(e) {
    const layer = e.layer;
    this.props.updateCountry(layer.feature.properties.name);
  }

  mapHandlers() {
    return {
      click: (e) => this.clickToFeature(e),
      mouseover: (e) => this.tooltipShow(e),
    }
  }

  featureStyle(feature) {
    const flow = [ 'none', 'low', 'medium', 'high'];
    const scaleValues = this.props.scaleValues;
    for(let scaleParamIdx = 0; scaleParamIdx < flow.length; scaleParamIdx++) {
      const cases = feature.properties.cases;
      const currentScaleName = flow[scaleParamIdx];
      const previousScaleName = flow[scaleParamIdx - 1];
      if(scaleParamIdx === 0 && cases < scaleValues.none) return this.state.colors.none;
      if(scaleParamIdx === flow.length - 1 && cases >= scaleValues.high) return this.state.colors.high;
      if(scaleValues[previousScaleName] > cases && cases <= scaleValues[currentScaleName]) return this.state.colors[currentScaleName];
    }
    return {
      color: '#4a83ec',
      weight: 0.5,
      fillColor: "#1a1d62",
      fillOpacity: 1,
    };
  }

  getGeoJson() {
    const countryNames = {
      'United States': 'United States of America',
      'Czech Rep.': 'Czech Republic',
      'Bosnia and Herz.': 'Bosnia and Herzegovina',
      'W. Sahara': 'Western Sahara',
      'S. Sudan': 'South Sudan',
      'Central African Rep.': 'Central African Republic',
      'Eq. Guinea': 'Equatorial Guinea',
      'São Tomé and Principe': 'Sao Tome and Principe',
      'Congo': 'Congo (Brazzaville)',
      'Dem. Rep. Congo': 'Congo (Kinshasa)',
      'Falkland Is.': 'Falkland Islands (Malvinas)',
      'Korea': 'Korea (North)',
      'Dem. Rep. Korea': 'Korea (South)',
      'Solomon Is.': 'Solomon Islands',
    };
    const countryNamesArr = Object.keys(countryNames);
    if(!Array.isArray(this.props.markers) || this.props.markers.length === 0){
      return WorldData;
    }
    WorldData.features.forEach(feature => {
      const marker = this.props.markers.find(marker => {
        let propName = countryNamesArr.includes(feature.properties.name)
          ? countryNames[feature.properties.name]
          : feature.properties.name;
        const slugEquals = marker.countrySlug.toLowerCase() === propName.toLowerCase();
        const nameEquals = marker.countryName.toLowerCase() === propName.toLowerCase();
        return slugEquals || nameEquals;
      })
      if(!marker) return;
      feature.properties.cases = marker.value;
      feature.properties.paramName = marker.paramName;
    });
    return WorldData;
  }

  render() {
    const containerStyle = {height: '100%'};
    return (
      <MapContainer
        center={[51.505, -0.09]}
        zoom={0}
        style={containerStyle}
      >
        <GeoJSON
          data={this.getGeoJson()}
          style={(e) => this.featureStyle(e)}
          eventHandlers={this.mapHandlers()}
          key={`_${Math.random().toString(36).substr(2, 9)}`}
        >
        </GeoJSON>
      </MapContainer>
    );
  }
}