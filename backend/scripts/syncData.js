require('dotenv').config();
const pool = require('../config/database');
const { fetchMGNREGAData } = require('../services/dataFetch');
const { insertMGNREGAData } = require('../models/mgnregaModel');

const STATES = [
    // States
    'ANDHRA PRADESH',
    'ARUNACHAL PRADESH',
    'ASSAM',
    'BIHAR',
    'CHHATTISGARH',
    'GOA',
    'GUJARAT',
    'HARYANA',
    'HIMACHAL PRADESH',
    'JHARKHAND',
    'KARNATAKA',
    'KERALA',
    'MADHYA PRADESH',
    'MAHARASHTRA',
    'MANIPUR',
    'MEGHALAYA',
    'MIZORAM',
    'NAGALAND',
    'ODISHA',
    'PUNJAB',
    'RAJASTHAN',
    'SIKKIM',
    'TAMIL NADU',
    'TELANGANA',
    'TRIPURA',
    'UTTAR PRADESH',
    'UTTARAKHAND',
    'WEST BENGAL',

    // Union Territories
    'ANDAMAN AND NICOBAR ISLANDS',
    'CHANDIGARH',
    'DADRA AND NAGAR HAVELI AND DAMAN AND DIU',
    'DELHI',
    'JAMMU AND KASHMIR',
    'LADAKH',
    'LAKSHADWEEP',
    'PUDUCHERRY'
];

const FINANCIAL_YEARS = [
    '2024-2025',
    '2023-2024',
    '2022-2023',
    '2021-2022',
    '2020-2021',
    '2019-2020',
    '2018-2019',
];

async function syncAllData() {
    console.log('Starting data sync...');

    for(const state of STATES) {
        for (const year of FINANCIAL_YEARS) {
            try {
                console.log(`\n Fetching data for ${state}...`);
                const response = await fetchMGNREGAData(state, year);

                if(response.records && response.records.length > 0) {
                    console.log(`Got ${response.records.length} records for ${state}...`);
                    console.log("\n-------------------------\n");
                    console.log(response.records);
                    console.log("\n-------------------------\n");
                    for (const record of response.records) {
                        await insertMGNREGAData(record);
                    }
                    console.log(`Inserted ${response.records.length} records for ${state}...`);
                } else {
                    console.log(`No records found for ${state}...`);
                }
            } catch (error) {
                console.error(`Error syncing data for ${state}:`,error.message);
            }
        }
    }

    console.log(`\n Data sync complete!`);
    process.exit(0);
}

syncAllData().catch((error) => {
    console.error('Fatal error:',error);
    process.exit(1);
});