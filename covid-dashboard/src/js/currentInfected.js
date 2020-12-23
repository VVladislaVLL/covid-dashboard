const globalCasesBlock = document.getElementById('global-cases');
const currentInfected = document.createElement('div');
globalCasesBlock.append(currentInfected);
currentInfected.classList.add('current__infected');


async function getInfectedvalue() {
    const url = `https://covid19.mathdro.id/api`;
    const res = await fetch(url);
    const data = await res.json();
    currentInfected.textContent = data.confirmed.value;
}

getInfectedvalue();