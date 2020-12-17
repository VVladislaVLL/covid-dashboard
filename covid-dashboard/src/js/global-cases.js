// get Data
async function getData() {
  const countriesData = await (await fetch('https://restcountries.eu/rest/v2',
    { method: 'GET', redirect: 'follow' })).json();
  const covidData = await (await fetch('https://api.covid19api.com/summary',
    { method: 'GET', redirect: 'follow' })).json();
  return { covidData, countriesData };
}

const setGlobalCases = (res) => {
  document.querySelector('.global-cases_number').textContent = res.covidData.Global.TotalConfirmed;
};

getData().then((res) => setGlobalCases(res)).catch((e) => console.error(e));
