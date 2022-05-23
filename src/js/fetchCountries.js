export default function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,flags,capital,population,languages
`).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Error fetching data');
  });
}
