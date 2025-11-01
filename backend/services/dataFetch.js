const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const API_BASE_URL = process.env.API_BASE_URL;

async function fetchMGNREGAData(state, financialYear = '2024-25'){
  try {
      const url = `${API_BASE_URL}?api-key=${API_KEY}&format=json&limit=10000&filters[state_name]=${encodeURIComponent(state)}&filters[fin_year]=${financialYear}`;
      // console.log("URL: ", url);
      console.log(`Fetching MGNREGA data for ${state} (${financialYear})...`);
      const response = await axios.get(url, { timeout: 30000 });

      console.log(`Fetched ${response.data.count} records!`);
      return response.data;

  } catch (error){
      console.error('Error fetching data:',error.message);
      throw error;
  }
}

module.exports = { fetchMGNREGAData };