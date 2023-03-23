'use strict';

const BASE_URL = 'https://restcountries.com/v3.1/name/';
const properties = 'fields=name,capital,population,flags,languages';

export const fetchCountries = countryName =>
  fetch(`${BASE_URL}${countryName}?${properties}`).then(
    res => {
      if (!res.ok) {
        throw new Error(response.status);
      }

      return res.json();
    }
  );