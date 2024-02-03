import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Convertor = () => {
  const [currencies, setCurrencies] = useState([]);
  const [base, setBase] = useState('USD');
  const [amount, setAmount] = useState('1');
  const [convertTo, setConvertTo] = useState('INR');
  const [result, setResult] = useState(null);
  const [date, setDate] = useState(null);
  const [conversionRate, setConversionRate] = useState(null);

  useEffect(() => {
    const getCurrencyList = async () => {
      try {
        const response = await axios.get(
          'https://currency-exchange.p.rapidapi.com/listquotes',
          {
            headers: {
              'X-RapidAPI-Key': 'c8b5bc7b14msh1b1fb8a5c347bcep198796jsnb77799704638',
              'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com',
            },
          }
        );

        console.log('Response:', response);
        const currencyList = response.data;
        setCurrencies(currencyList);
      } catch (error) {
        console.error('Error fetching currency list:', error);
      }
    };

    getCurrencyList();
  }, []);

  const getConversionRate = async (fromCurrency, toCurrency) => {
    const apiKey = 'c8b5bc7b14msh1b1fb8a5c347bcep198796jsnb77799704638';
    const options = {
      method: 'GET',
      url: 'https://currency-converter241.p.rapidapi.com/conversion_rate',
      params: {
        from: fromCurrency,
        to: toCurrency,
      },
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'currency-converter241.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      console.log('Conversion Rate Response:', response.data);

      if ('rate' in response.data) {
        const conversionRate = parseFloat(response.data.rate);
        return conversionRate;
      } else {
        console.error('Invalid response structure:', response.data);
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error fetching conversion rate:', error);
      throw error;
    }
  };

  useEffect(() => {
    const getCurrencyConversion = async () => {
      try {
        const conversionRate = await getConversionRate(base, convertTo);
        console.log('Conversion Rate:', conversionRate);

        if (!isNaN(amount) && base !== convertTo) {
          const convertedResult = (parseFloat(amount) * conversionRate).toFixed(3);
          setResult(convertedResult);
          setDate(new Date().toLocaleDateString());
        }
      } catch (error) {
        console.error('Error fetching conversion rate:', error);
      }
    };

    getCurrencyConversion();
  }, [amount, base, convertTo]);

  const handleChange = (e) => {
    setAmount(e.target.value);
    setResult(null);
    setDate(null);
  };

  const handleSwap = (e) => {
    e.preventDefault();
    setConvertTo(base);
    setBase(convertTo);
    setResult(null);
  };

  const handleConvert = async () => {
    try {
      const conversionRate = await getConversionRate(base, convertTo);
      console.log('Conversion Rate:', conversionRate);

      if (!isNaN(amount) && base !== convertTo) {
        const convertedResult = (parseFloat(amount) * conversionRate).toFixed(3);
        setResult(convertedResult);
        setDate(new Date().toLocaleDateString());
      }
    } catch (error) {
      console.error('Error fetching conversion rate:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8" style={{ padding: '30px', background: '#ececec' }}>
          <h1 className="mb-4">CURRENCY CONVERTER</h1>
          <div className="row align-items-center">
              <div className="col-lg-3 mb-4">
                <form className="form-inline">
                  <label htmlFor="amount">Amount</label>
                  <input type="number" name="amount" value={amount} onChange={handleChange} className="form-control form-control-lg"/>
                </form>
              </div>
              <div className="col-lg-3 mb-8">
                <form className="form-inline">
                  <select  name="base"  value={base}  onChange={(e) => setBase(e.target.value)}  className="form-control form-control-lg">
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </form>
              </div>
              <div className="col-lg-2 mb-8">
                <form className="form-inline">
                  <button className="btn btn-light rounded-circle" onClick={handleSwap} style={{ fontSize: '1.5em' }}>
                    &#8595;&#8593;
                  </button>
                </form>
              </div>
              <div className="col-lg-3 mb-8">
                <form className="form-inline">
                  <select  name="convertTo"  value={convertTo}  onChange={(e) => setConvertTo(e.target.value)} className="form-control form-control-lg">
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </form>
              </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-2">
                <h5>
                  {amount} {base} is equivalent to{' '}
                </h5>
                <h3>{result === null ? 'Calculating...' : result} {convertTo}</h3>
                <p>As of {date === null ? '' : date}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Convertor;
