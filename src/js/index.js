import './../css/styles.css';
import fetchCountries from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { debounce } from 'lodash';

const DEBOUNCE_DELAY = 300;
const inputCountry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const cleanMarkup = ref => (ref.innerHTML = '');

inputCountry.addEventListener('input', debounce(renderList, DEBOUNCE_DELAY));

function renderList(e) {
  const userRequest = e.target.value.trim();

  if (!userRequest) {
    cleanMarkup(countryList);
    cleanMarkup(countryInfo);
    return;
  }

  fetchCountries(userRequest)
    .then(data => {
      console.log(data);
      if (data.length >= 10) {
        Notify.info('Too many matches found. Please enter a more specific name');
        return;
      }
      cleanMarkup(countryList);
      cleanMarkup(countryInfo);
      renderMarkup(data);
    })
    .catch(error => {
      console.log(error);
      cleanMarkup(countryList);
      cleanMarkup(countryInfo);
      Notify.failure('Oops, there is no country with that name');
    });
}

const createInfoMarkup = ({ name, capital, population, flags, languages }) => {
  if ('Russian Federation' === name.official) {
    name.official = 'RASHIZM';
  }
  return `
      <table>
        <thead>
          <tr>
            <th>
              <img src="${flags.svg}"
              alt="${name.official}"
              width="60" height="40">
            </th>
            <th class="bold head">${name.official}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Capital</td>
            <td class="bold">${capital}</td>
          </tr>
          <tr>
            <td>Population</td>
            <td class="bold">${population}</td>
          </tr>
          <tr>
            <td>Languages</td>
            <td class="bold">${Object.values(languages)}</td>
          </tr>
        <tbody>
      </table>`;
};

const createListMarkup = data => {
  return data
    .map(
      ({ flags, name }) =>
        `<li><img src="${flags.svg}" alt="${name.official}" width="60" height="40">${name.official}</li>`,
    )
    .join('');
};

const renderMarkup = data => {
  countryInfo.innerHTML = data.length === 1 ? createInfoMarkup(data[0]) : createListMarkup(data);
};
