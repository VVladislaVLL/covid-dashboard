const statKeys = ['NewConfirmed', 'TotalConfirmed', 'NewDeaths', 'TotalDeaths', 'NewRecovered', 'TotalRecovered'];
const map = L.map('mapid').setView([48.85661, 2.3515], 2);

L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}.png?access-token=TFQR9zv1KyJTfUK8Vw0OwfFweiwlFj9H6vuJgnEj9pgbzHt48nlceXqL5MIohZ67', {
  minZoom: 2,
  maxZoom: 7,
}).addTo(map);
map.attributionControl.addAttribution('<a href="https://www.jawg.io" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org" target="_blank">&copy; OpenStreetMap</a>&nbsp;contributors');

// Zone limitation
const southWest = L.latLng(-81, -175);
const northEast = L.latLng(84.5, 190);
const bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds);
map.on('drag', () => {
  map.panInsideBounds(bounds, { animate: false });
});

// get Data
async function getData() {
  const countriesData = await (await fetch('https://restcountries.eu/rest/v2', { method: 'GET', redirect: 'follow' })).json();
  const covidData = await (await fetch('https://api.covid19api.com/summary', { method: 'GET', redirect: 'follow' })).json();

  return { covidData, countriesData };
}

const createCircles = (res) => {
  res.countriesData.forEach((elem) => {
    try {
      const circleCenter = elem.latlng;
      const circleOptions = {
        color: 'red',
        fill: true,
        fillColor: '#f03',
        fillOpacity: 0.5,
      };
      const key = 1;
      const sizeDevisor = 8;
      const circle = L.circle(circleCenter, res.covidData.Countries
        .find((item) => item.Country === elem.name)[statKeys[key]] / sizeDevisor, circleOptions);
      circle.bindPopup(`${elem.name}\n ${statKeys[key]}:${res.covidData.Countries
        .find((item) => item.Country === elem.name)[statKeys[key]]}`, {
        maxWidth: 'auto',

      });
      circle.addTo(map);
    } catch (e) {
      console.log(e);
    }
  });
};
getData().then((res) => createCircles(res));
