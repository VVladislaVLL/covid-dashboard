// import countryBorders from './countries.json';
const statKeys = ['NewConfirmed', 'TotalConfirmed', 'NewDeaths', 'TotalDeaths', 'NewRecovered', 'TotalRecovered'];
const circleOptions = {
  color: 'red',
  fill: true,
  fillColor: '#f03',
  fillOpacity: 0.5,
};
let countriesDataObject;
let Circles = [];

// Enable map
const map = L.map('mapid', {
  fullscreenControl: true,
  fullscreenControlOptions: {
    position: 'topleft',
  },
}).setView([48.85661, 2.3515], 2);

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

const getSizeDivisor = (i) => {
  let sizeDivisor = 1;
  switch (+i) {
    case 0:
      sizeDivisor = 0.2;
      break;
    case 1:
      sizeDivisor = 10;
      break;
    case 2:
      sizeDivisor = 0.01;
      break;
    case 3:
      sizeDivisor = 0.3;
      break;
    case 4:
      sizeDivisor = 0.2;
      break;
    case 5:
      sizeDivisor = 10;
      break;
    default:
      break;
  }
  return sizeDivisor;
};

const createCircles = (res, i) => {
  console.log(i);
  Circles.forEach((circle) => map.removeLayer(circle));
  Circles = [];
  res.countriesData.forEach((elem) => {
    try {
      const circleCenter = elem.latlng;
      const sizeDevisor = getSizeDivisor(i);
      const key = i;

      const circle = L.circle(circleCenter, res.covidData.Countries
        .find((item) => item.Country === elem.name)[statKeys[key]] / sizeDevisor, circleOptions);
      circle.bindPopup(`${elem.name}\n ${statKeys[key]}:${res.covidData.Countries
        .find((item) => item.Country === elem.name)[statKeys[key]]}`, {
        maxWidth: 'auto',
      });
      Circles.push(circle);
      circle.addTo(map);
    } catch (e) {
      console.log(e);
    }
  });
};

getData().then((res) => {
  countriesDataObject = res;
  return res;
}).then((res) => createCircles(res, 1));

function styleBorders() {
  return {
    weight: 0.1,
    opacity: 0,
    color: 'white',
    dashArray: '1',
    fill: true,
    fillOpacity: 0,
  };
}

// Borders
let geojson;
const info = L.control();

function highlightCountry(e) {
  const layer = e.target;

  layer.setStyle({
    weight: 0.3,
    color: '#666',
    opacity: 1,
    dashArray: '',
    fillColor: '#FFF',
    fillOpacity: 0.1,
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
  info.update(layer.feature.properties);
}

function resetHighlightCountry(e) {
  geojson.resetStyle(e.target);
  info.update();
}
function zoomToCountry(e) {
  map.fitBounds(e.target.getBounds());
}

function onFeature(feature, layer) {
  layer.on({
    mouseover: highlightCountry,
    mouseout: resetHighlightCountry,
    click: zoomToCountry,
  });
}

async function getBorders() {
  await (await fetch('../src/js/countries.json', { method: 'GET' })).json().then((res) => {
    geojson = L.geoJson(res, {
      style: styleBorders,
      onEachFeature: onFeature,
    }).addTo(map);
  });
}

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  this._div.innerHTML = `<h4>US Population Density</h4>${props
    ? `<b>${props.name}</b><br />${props.density} people / mi<sup>2</sup>`
    : 'Hover over a state'}`;
};

info.addTo(map);
getBorders();

const select = document.querySelector('#select-field');
select.addEventListener('change', (event) => {
  const index = event.target.options[event.target.selectedIndex].value;
  createCircles(countriesDataObject, index);
});
