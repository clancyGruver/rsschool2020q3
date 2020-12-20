import { useEffect, useRef } from "react";
import L from "leaflet";

const getColor = d => {
  if(d === 10) return '#008500';
  if(d === 40) return '#FFFF00';
  if(d === 70) return '#FF9200';
  if(d === 100) return '#FF0000';
};

const MapLegend = () => {
  const mapRef = useRef();

  useEffect(() => {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'legend');
      const grades = [0, 10, 40, 70, 100];
      let labels = [];
      let from;
      let to;

      for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
          '<i style="background:' +
            getColor(from + 1) +
            '"></i> ' +
            from +
            (to ? "&ndash;" + to : "+")
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    }
    legend.addTo(mapRef.current);

    return legend.remove();
  }, []);
  return null;
}

export default MapLegend;