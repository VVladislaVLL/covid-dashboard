import { country_list } from './countries.js';
import { all } from './search.js';
import { Keyboard } from './keyboard.js';


const countriesList = document.querySelector('.countries-list');
let newArr = [];
let recoveredArr = [];
const fullscreenButton = document.querySelector('.countries-list__btn');

const contrySortLow = document.querySelector('.countries-sort-low');
const contrySortHigh = document.querySelector('.countries-sort-high');
const countrySortByName = document.querySelector('.sort-by-name-from-A');
const countrySortByNameFromZ = document.querySelector('.sort-by-name-from-Z');
const keys = ['confirmed', 'recovered', 'deaths'];


const select = document.querySelector('#select-field-category');

select.addEventListener('change', (event) => {
    const index = +event.target.options[event.target.selectedIndex].value;
    const countryList = document.querySelectorAll('.country__list');
    for (let i = 0; i < countryList.length; i++) {
        countryList[i].remove();
    };

    newArr.forEach(elem => writeCountryInfo(elem, keys[index]));
});

contrySortLow.addEventListener('click', () => {
    const removeArr = document.querySelectorAll('.country__list');
    const index = +select.options[select.selectedIndex].value;

    sortLow(true, keys[index]);
    for (let i = 0; i < removeArr.length; i++) {
        removeArr[i].remove();
    }
    newArr.forEach(elem => writeCountryInfo(elem, keys[index]));
});


contrySortHigh.addEventListener('click', () => {
    const removeArr = document.querySelectorAll('.country__list');
    const index = +select.options[select.selectedIndex].value;

    sortHigh(true, keys[index]);
    for (let i = 0; i < removeArr.length; i++) {
        removeArr[i].remove();
    }
    newArr.forEach(elem => writeCountryInfo(elem, keys[index]));
});


countrySortByName.addEventListener('click', () => {
    const removeArr = document.querySelectorAll('.country__list');
    const index = +select.options[select.selectedIndex].value;
    sortByNameFromZ(true);
    for (let i = 0; i < removeArr.length; i++) {
        removeArr[i].remove();
    }
    newArr.forEach(elem => writeCountryInfo(elem, keys[index]));
});


countrySortByNameFromZ.addEventListener('click', () => {
    const removeArr = document.querySelectorAll('.country__list');
    const index = +select.options[select.selectedIndex].value;

    sortByName(true);
    for (let i = 0; i < removeArr.length; i++) {
        removeArr[i].remove();
    }
    newArr.forEach(elem => writeCountryInfo(elem, keys[index]));
});



fullscreenButton.addEventListener('click', () => {
    countriesList.classList.toggle('fullscreen');
});






const getFullStatistic = (data) => {
    let sum = 0;
    data.forEach(({ confirmed }) => {
        sum += confirmed;
    });

    return sum;
}

const getFullStatisticAboutRecovered = (data) => {
    let sum = 0;
    data.forEach(({ recovered }) => {
        sum += recovered;
    });
    return sum;
}

const getFullStatisticAboutDeaths = (data) => {
    let sum = 0;
    data.forEach(({ deaths }) => {
        sum += deaths;
    });
    return sum;
}



const writeCountryInfo = (obj, field /* { name, flag, confirmed } */ ) => {

    const countryStatistic = document.createElement('div');
    let confirmedCases = document.createElement('div');
    let countryName = document.createElement('div');
    let countryFlag = document.createElement('div');


    countryStatistic.classList.add('country__list');
    confirmedCases.classList.add('country__list-confirmed-cases');
    countryName.classList.add('country__list-name');
    countryFlag.classList.add('country__list-flag');

    countryStatistic.append(confirmedCases, countryName, countryFlag);


    // confirmedCases.textContent = confirmed;
    confirmedCases.textContent = obj[field];
    // countryName.textContent = name;
    countryName.textContent = obj.name;
    countriesList.append(countryStatistic);
    countryFlag.style.cssText = `background:url(${obj.flag}); background-position: center;
    background-size: contain;
    background-repeat: no-repeat; `;


}

async function getInfectedCountriesvalue(item) {

    const {
        name,
        flag
    } = item;

    const url = `https://covid19.mathdro.id/api/countries/${name}/confirmed`;
    const res = await fetch(url);
    const data = await res.json();

    let i = 0;


    const dataItem = {
        name: name,
        flag: flag,
        confirmed: getFullStatistic(data),
        recovered: getFullStatisticAboutRecovered(data),
        deaths: getFullStatisticAboutDeaths(data)
    }


    newArr.push(dataItem);

    writeCountryInfo(dataItem, 'confirmed');
};


function sortLow(flag, str) {
    if (flag) {
        // newArr = newArr.sort((a, b) => a.confirmed - b.confirmed);
        newArr = newArr.sort((a, b) => a[str] - b[str]);
    }
}

function sortHigh(flag, str) {
    if (flag) {
        // newArr = newArr.sort((a, b) => b.confirmed - a.confirmed);
        newArr = newArr.sort((a, b) => b[str] - a[str]);
    }
}

function sortByName(flag) {
    if (flag) {
        newArr = newArr.sort((a, b) => a.name.localeCompare(b.name));
    }
}

function sortByNameFromZ(flag) {
    if (flag) {
        newArr = newArr.sort((a, b) => b.name.localeCompare(a.name));
    }
}

const createInfectedCountriesValue = () => {
    country_list.forEach(element => getInfectedCountriesvalue(element));
}

createInfectedCountriesValue();







const headers = document.querySelectorAll("[data-name='spoiler-title']");

headers.forEach(function(item) {
    item.addEventListener("click", headerClick);
});

function headerClick() {
    this.nextElementSibling.classList.toggle("spoiler-body");
}

const confirmed = document.querySelector('.confirmed');
const recovered = document.querySelector('.recovered');
const deaths = document.querySelector('.deaths');
const tested = document.querySelector('.tested');