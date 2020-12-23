import { Keyboard } from './keyboard.js';

const input = document.querySelector('.use-keyboard-input');


input.addEventListener('input', (e) => searchCountry(e));


export function searchCountry(e) {
    const input = document.querySelector('.use-keyboard-input');
    let value = input.value.toLowerCase().trim();
    let list = document.querySelectorAll('.country__list');
    if (value != '') {
        list.forEach(element => {
            if (element.innerText.toLowerCase().search(value) == -1) {
                element.classList.add('hide');
            } else {
                element.classList.remove('hide');
            }
        });
    } else {
        list.forEach(element => {
            element.classList.remove('hide');
        });
    }
}