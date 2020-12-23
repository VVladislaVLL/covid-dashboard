// const url
const urlByCountry = 'https://disease.sh/v3/covid-19/countries';

const infoTable = document.querySelector('#info-table');

const state = {
    dataCountryInfo: null, 
    allPeriod: true,
    absValue: true,
    confirmed: true,
    recovered: false,
    deaths: false,
};

async function getDataByCountry() {
    const countriesDataInJSON = await fetch(urlByCountry);
    state.dataCountryInfo = await countriesDataInJSON.json();
    createDataStructure(state.dataCountryInfo);
}

const createDataStructure = (countriesDataArray) => {
    countriesDataArray.forEach((element) => {
      element.totalConfirmedAverage = Math.round(element.casesPerOneMillion * 10) / 100;
      element.totalDeathsAverage = Math.round(element.deathsPerOneMillion * 10) / 100;
      element.totalRecoveredAverage = Math.round(element.recoveredPerOneMillion * 10) / 100;
      if (element.population === 0) {
        element.todayConfirmedAverage = 0;
        element.todayDeathsAverage = 0;
        element.todayRecoveredAverage = 0;
      } else {
        element.todayConfirmedAverage = Math.round((element.todayCases
          / (element.population / 100000)) * 100) / 100;
        element.todayDeathsAverage = Math.round((element.todayDeaths
          / (element.population / 100000)) * 100) / 100;
        element.todayRecoveredAverage = Math.round((element.todayRecovered
          / (element.population / 100000)) * 100) / 100;
      }
    });
    sortCountryDataByDefault();
};

const sortCountryDataByDefault = () => {
    const array = [];
    const tableDisplayData = state.dataCountryInfo;
    tableDisplayData.sort((a, b) => {
      if (a.cases < b.cases) { return 1; }
      if (a.cases > b.cases) { return -1; }
      return 0;
    });
    tableDisplayData.forEach((element) => {
      const obj = {
        data: element.cases,
        name: element.country,
        flag: element.countryInfo.flag,
        id: element.countryInfo._id,
        iso: element.countryInfo.iso3,
      };
      array.push(obj);
    });
    createTable(array);
};

const sortCountryDataByClick = () => {
  const array = [];
  const tableDisplayData = state.dataCountryInfo;
  const period = state.allPeriod;
  const value = state.absValue;
  const confirmed = state.confirmed;
  const deaths = state.deaths;
  const recovered = state.recovered;
  let paramName = 'cases';

  if (period === true && value === true && confirmed === true) {
    paramName = 'cases';
  } else if (period === false && value === true && confirmed === true) {
    paramName = 'todayCases';
  } else if (period === true && value === false && confirmed === true) {
    paramName = 'totalConfirmedAverage';
  } else if (period === false && value === false && confirmed === true) {
    paramName = 'todayConfirmedAverage';
  } else if (period === true && value === true && deaths === true) {
    paramName = 'deaths';
  } else if (period === false && value === true && deaths === true) {
    paramName = 'todayDeaths';
  } else if (period === true && value === false && deaths === true) {
    paramName = 'totalDeathsAverage';
  } else if (period === false && value === false && deaths === true) {
    paramName = 'todayDeathsAverage';
  } else if (period === true && value === true && recovered === true) {
    paramName = 'recovered';
  } else if (period === false && value === true && recovered === true) {
    paramName = 'todayRecovered';
  } else if (period === true && value === false && recovered === true) {
    paramName = 'totalRecoveredAverage';
  } else if (period === false && value === false && recovered === true) {
    paramName = 'todayRecoveredAverage';
  }

  tableDisplayData.sort((a, b) => {
    if (a[paramName] < b[paramName]) { return 1; }
    if (a[paramName] > b[paramName]) { return -1; }
    return 0;
  });
  tableDisplayData.forEach((element) => {
    const obj = {
      data: element[paramName],
      name: element.country,
      flag: element.countryInfo.flag,
    };
    array.push(obj);
  });
  createTable(array);
};

const createTable = (dataForCreation) => {
    if (document.querySelector('#countries__table')) {
      document.querySelector('#countries__table').remove();
    }
  
    const table = document.createElement('table');
    table.id = 'countries__table';
    infoTable.appendChild(table);
  
    dataForCreation.forEach((element) => {
      const row = document.createElement('tr');
      row.classList.add('countries__table-row');
      table.appendChild(row);
  
      const cellWithData = document.createElement('td');
      cellWithData.classList.add('countries__table-cell', 'data');
      cellWithData.innerText = element.data.toLocaleString();
      row.appendChild(cellWithData);
  
      const cellWithName = document.createElement('td');
      cellWithName.classList.add('countries__table-cell', 'data');
      cellWithName.innerText = element.name;
      row.appendChild(cellWithName);
  
      const cellWithFlag = document.createElement('td');
      cellWithFlag.classList.add('countries__table-cell', 'flag');
      row.appendChild(cellWithFlag);
  
      const flagImage = document.createElement('img');
      flagImage.classList.add('flag-image');
      flagImage.src = element.flag;
      cellWithFlag.appendChild(flagImage);
    });
    
  };

const firstPageLoad = () => {
    getDataByCountry();
};

firstPageLoad();

// Table buttons
const buttonCountriesAllPeriod = document.querySelector('.button__all-period-countries');
const buttonCountriesToday = document.querySelector('.button__last-day-countries');
const buttonCountriesAbs = document.querySelector('.button__abs-countries');
const buttonCountriesPerPopulation = document.querySelector('.button__per-population-countries');
const buttonCountriesConfirmed = document.querySelector('.button__confirmed-countries');
const buttonCountriesRecovered = document.querySelector('.button__recovered-countries');
const buttonCountriesDeaths = document.querySelector('.button__deaths-countries');

const buttonAllPeriodAddSelect = () => {
  buttonCountriesAllPeriod.classList.add('select');
  buttonCountriesToday.classList.remove('select');
};

const buttonTodaySelect = () => {
  buttonCountriesAllPeriod.classList.remove('select');
  buttonCountriesToday.classList.add('select');
};

const buttonAbsAddSelect = () => {
  buttonCountriesAbs.classList.add('select');
  buttonCountriesPerPopulation.classList.remove('select');
};

const buttonPopulationAddSelect = () => {
  buttonCountriesAbs.classList.remove('select');
  buttonCountriesPerPopulation.classList.add('select');
};

const buttonConfirmAddSelect = () => {
  buttonCountriesConfirmed.classList.add('select');
  buttonCountriesRecovered.classList.remove('select');
  buttonCountriesDeaths.classList.remove('select');
};

const buttonRecoverAddSelect = () => {
  buttonCountriesConfirmed.classList.remove('select');
  buttonCountriesRecovered.classList.add('select');
  buttonCountriesDeaths.classList.remove('select');
};

const buttonDeathAddSelect = () => {
  buttonCountriesConfirmed.classList.remove('select');
  buttonCountriesRecovered.classList.remove('select');
  buttonCountriesDeaths.classList.add('select');
};

const changeDataInAllModules = (event) => {
  if (event.target === buttonCountriesAllPeriod) {
    state.allPeriod = true;
    buttonAllPeriodAddSelect();
    sortCountryDataByClick();
  } else if (event.target === buttonCountriesToday) {
    state.allPeriod = false;
    buttonTodaySelect();
    sortCountryDataByClick();
  } else if (event.target === buttonCountriesAbs) {
    state.absValue = true;
    buttonAbsAddSelect();
    sortCountryDataByClick();
  } else if (event.target === buttonCountriesPerPopulation) {
    state.absValue = false;
    buttonPopulationAddSelect();
    sortCountryDataByClick();
  } else if (event.target === buttonCountriesConfirmed) {
    state.confirmed = true;
    state.recovered = false;
    state.deaths = false;
    buttonConfirmAddSelect();
    sortCountryDataByClick();
  } else if (event.target === buttonCountriesRecovered) {
    state.confirmed = false;
    state.recovered = true;
    state.deaths = false;
    buttonRecoverAddSelect();
    sortCountryDataByClick();
  } else if (event.target === buttonCountriesDeaths) {
    state.confirmed = false;
    state.recovered = false;
    state.deaths = true;
    buttonDeathAddSelect();
    sortCountryDataByClick();
  } 
};

infoTable.addEventListener('click', (event) => changeDataInAllModules(event));