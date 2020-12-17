import { country_list } from './countries.js';

const countriesList = document.getElementById('countries-list');




async function getInfectedCountriesvalue(item) {

    const {
        name,
        flag
    } = item;


    const countryStatistic = document.createElement('div');
    let confirmedCases = document.createElement('div');
    let countryName = document.createElement('div');


    countryStatistic.classList.add('country__list');
    confirmedCases.classList.add('country__list-confirmed-cases');
    countryName.classList.add('country__list-name');


    countryStatistic.append(confirmedCases, countryName);


    const url = `https://covid19.mathdro.id/api/countries/${name}/confirmed`;
    const res = await fetch(url);
    const data = await res.json();
    confirmedCases.textContent = data[0].confirmed;
    countryName.textContent = data[0].countryRegion;
    countriesList.append(countryStatistic);
    // console.log(confirmedCases, countryName);
    // console.log(`${data[0].confirmed}  ${data[0].countryRegion}`);
    countryName.style.background = `url(${flag})`;

}
getInfectedCountriesvalue();


const z = () => {
    country_list.forEach(element => countriesList.append(getInfectedCountriesvalue(element)))
};

z();