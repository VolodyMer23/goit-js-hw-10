'use strict';

import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchEl = document.querySelector('#search-box');
const countryInfoEl = document.querySelector('.country-info');
const countryListEl = document.querySelector('.country-list');

const cleanMarkup = ref => (ref.innerHTML = '');

const inputHandler = e => {
  const textInput = e.target.value.trim();

  if (!textInput) {
    cleanMarkup(countryListEl);
    cleanMarkup(countryInfoEl);
    return;
  }

  fetchCountries(textInput)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      cleanMarkup(countryListEl);
      cleanMarkup(countryInfoEl);
      Notify.failure('Oops, there is no country with that name');
    });
};

const renderMarkup = data => {
  if (data.length === 1) {
    cleanMarkup(countryListEl);
    const markupInfo = createInfoMarkup(data);
    countryInfoEl.innerHTML = markupInfo;
  } else {
    cleanMarkup(countryInfoEl);
    const markupList = createListMarkup(data);
    countryListEl.innerHTML = markupList;
  }
};

const createListMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li class='country-item'><img src="${flags.png}" alt="${name.official}" width="40" height="25"><span>  </span>${name.official}</li>`
    )
    .join('');
};

const createInfoMarkup = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><span><img src="${flags.png}" alt="${name.official}" height="25"></span>  ${name.official}</h1>
      <p class='country-text'><span class='country-text-bold'>Capital:</span> ${capital}</p>
      <p class='country-text'><span class='country-text-bold'>Population:</span> ${population}</p>
      <p class='country-text'><span class='country-text-bold'>Languages:</span> ${Object.values(
        languages
      )}</p>`
  ).join('');
};

searchEl.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
