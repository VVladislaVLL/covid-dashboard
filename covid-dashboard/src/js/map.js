const statKeys = ['NewConfirmed', 'TotalConfirmed', 'NewDeaths', 'TotalDeaths', 'NewRecovered', 'TotalRecovered'];
const circleOptions = {
  color: 'red',
  fill: true,
  fillColor: '#f03',
  fillOpacity: 0.5,
};
let countriesDataObject;
let Circles = [];

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

const southWest = L.latLng(-81, -175);
const northEast = L.latLng(84.5, 190);
const bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds);
map.on('drag', () => {
  map.panInsideBounds(bounds, { animate: false });
});

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
  Circles.forEach((circle) => map.removeLayer(circle));
  Circles = [];
  res.countriesData.forEach((elem) => {
    try {
      const circleCenter = elem.latlng;
      const sizeDevisor = getSizeDivisor(i);
      const key = i;

      const circle = L.circle(circleCenter, res.covidData.Countries
        .find((item) => item.Country === elem.name)[statKeys[key]] / sizeDevisor, circleOptions);
      circle.bindPopup(`${elem.name}<br> ${statKeys[key]}:${res.covidData.Countries
        .find((item) => item.Country === elem.name)[statKeys[key]]}`, {
        maxWidth: 'auto',
      });
      Circles.push(circle);
      circle.addTo(map);
    } catch (e) {
      console.warn('GET DATA', e);
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
  console.log(layer.feature.properties);
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
  this.div = L.DomUtil.create('div', 'info');
  this.update();
  return this.div;
};

info.update = function (props) {
  if (!props) {
    this.div.innerHTML = '<h4 >World Map</h4><br><p>Hover over a state</p>';
  } else {
    const arr = ['<h4 >World Map</h4>', `<b>${props.ADMIN}</b>`];

    let numberValues = [];
    const code = props.ISO_A3.slice(0, 2).toLowerCase();
    const code2 = props.ISO_A3.slice(0).toLowerCase();
    statKeys.forEach((field) => {
      try {
        if (props.ADMIN === 'Greenland'
          || props.ADMIN === 'Iran'
          || props.ADMIN === 'Democratic Republic of the Congo') {
          numberValues = Array(6).fill('-');
        } else {
          const value = countriesDataObject.covidData.Countries
            .find((item) => item.Country === props.ADMIN
              || item.CountryCode.toLowerCase() === code
              || item.CountryCode.toLowerCase() === code2)[field];
          numberValues.push(value);
        }
      } catch (e) {
        console.warn('HOVER', props.ADMIN, props.ISO_A3, code);
        numberValues = Array(6).fill('-');
      }
    });

    statKeys.forEach((field, i) => {
      if (numberValues[i] !== undefined) {
        arr.push(`${field}:${numberValues[i]}`);
      } else {
        arr.push(`${field}:-`);
      }
    });

    this.div.innerHTML = arr.join('<br>');
  }
};

info.addTo(map);
getBorders();

const select = document.querySelector('#select-field');
select.addEventListener('change', (event) => {
  const index = event.target.options[event.target.selectedIndex].value;
  createCircles(countriesDataObject, index);
});

const legend = L.control({ position: 'bottomleft' });

legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');
  const grades = [0, 100, 1000, 10000, 100000, 1000000, 10000000];

  div.innerHTML = '<h4>Legend</h4>';
  div.innerHTML += '<ul>';
  div.addEventListener('click', () => document.querySelector('#mapid').requestFullscreen());
  for (let i = 0; i < grades.length; i += 1) {
    div.innerHTML
      += `<li class="size${i}"><i style="background: red"></i><span>${
        grades[i]}${grades[i + 1] ? `&ndash;${grades[i + 1]}</span></li>` : '+'}`;
  }
  div.innerHTML += '</ul>';
  return div;
};

legend.addTo(map);

const divMap = document.querySelector('#mapid');
divMap.addEventListener('keypress', (e) => {
  if (e.keyCode === 111) {
    document.querySelector('#mapid').requestFullscreen();
  }
});
