interface Data {
  conversion_rates: Record<string, number>;
}

class FetchWrapper {
  baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  get(endpoint: string): Promise<Data> {
    return fetch(this.baseURL + endpoint).then((response) => response.json());
  }

  put(endpoint: string, body: any): Promise<any> {
    return this._send('put', endpoint, body);
  }

  post(endpoint: string, body: any): Promise<any> {
    return this._send('post', endpoint, body);
  }

  delete(endpoint: string, body: any): Promise<any> {
    return this._send('delete', endpoint, body);
  }

  _send(method: string, endpoint: string, body: any): Promise<any> {
    return fetch(this.baseURL + endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((response) => response.json());
  }
}

//TODO
/* The goal of this project is to show the user the conversion rate between 2 currency pairs.
  The currency chosen on the left is the base currency and the currency chosen on the right is the target currency.
  The app starts at 1 USD = 1 USD.
  
  The API you need to use in this challenge is exchangerate-api.com.*/

//Notes:
// Sign up for a free account on exchange <a href="https://www.exchangerate-api.com/">https://www.exchangerate-api.com/</a>
// Copy the example request
// Please check the documentation link, read Standard Requests documentation
// Sending a GET request to <a href="https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD">https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD</a>
// Above will give you exchange rate comapred to USD

// TODO: WRITE YOUR TYPESCRIPT CODE HERE

// A global variable that references the HTML select element with the id base-currency
const baseCurrency = document.getElementById('base-currency') as HTMLSelectElement;

// A global variable that references the HTML select element with the id target-currency
const targetCurrency = document.getElementById('target-currency') as HTMLSelectElement;

// A global variable that references the HTML paragraph element with the id conversion-result
const conversionResult = document.getElementById('conversion-result') as HTMLParagraphElement;

// A global variable that stores the conversion rates for each currency pair as an array of arrays
const conversionRates: [string, string, number][] = [];

// A constant that stores the API key for authentication
const API_KEY = import.meta.env.VITE_API_KEY;

// An instance of the FetchWrapper class with the base URL of the API
const baseURL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;
const fetchWrapper = new FetchWrapper(baseURL);

// A call to the get method of the API instance with the endpoint that requests the latest conversion rates for the USD currency
fetchWrapper.get('USD')
  .then(data => {
    console.log('Conversion rates for USD:', data.conversion_rates);
    // Example: Accessing conversion rate for EUR
    console.log('1 USD =', data.conversion_rates.EUR, 'EUR');
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

  
async function getConversionRates(base: string) {
  try {
    const data = await fetchWrapper.get(base);
    
    // Assign the conversion_rates property of the response data to the rates variable
    const rates = data.conversion_rates;
    
    console.log(`Conversion rates for ${base}:`, rates);
    
    // Return the rates object
    return rates;
  } catch (error) {
    console.error('Error fetching data:', error);
    return {}; 
  }
}

// Add an event listener to the base element that invokes the getConversionRates function when the user selects a new value
// Add an event listener to the target element that invokes the getConversionRates function when the user selects a new value
baseCurrency.addEventListener('change', updateConversionResult);
targetCurrency.addEventListener('change', updateConversionResult);

// A function that performs the currency conversion and updates the UI
// Iterate over the rates array and find the rate that matches the target currency value
// If the currency name matches the target currency value
// Assign the conversion rate to the textContent property of the result element, which displays it on the web page

function updateConversionResult() {
  const base = baseCurrency.value;
  const target = targetCurrency.value;

  getConversionRates(base)
    .then((rates) => {
      if (rates && rates[target]) {
        const conversionRate = rates[target];
        conversionResult.textContent = conversionRate.toFixed(4);  // Display up to 4 decimal places
      } else {
        conversionResult.textContent = "Rate not available";
      }
    });
}

