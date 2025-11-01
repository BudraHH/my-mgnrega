const { getDistrictData, getStateDistricts, getStateAverage } = require('../models/mgnregaModel');

async function getDistrict(req, res) {
    try {
        const { state, district, fin_year } = req.query;
        console.log("fin_year_____________", fin_year);
        if (!state || !district || !fin_year) {
            return res.status(400).json({ error: 'State, district, and fin_year required' });
        }

        const result = await getDistrictData(state, district, fin_year);
        console.log(`✅ Fetched ${result.length} records for ${district}, ${fin_year}`);

        res.json({ data: result });
    } catch (error) {
        console.error('Error fetching district data:', error);
        res.status(500).json({ error: error.message });
    }
}

// ✅ Get state districts
async function getStateList(req, res) {
    try {
        const state = req.sanitized?.state || req.query.state;

        if (!state) {
            return res.status(400).json({ error: 'State required' });
        }

        const districts = await getStateDistricts(state);
        res.json({ success: true, districts });
    } catch (error) {
        console.error('Error in getStateList:', error);
        res.status(500).json({ error: error.message });
    }
}

// ✅ FIXED: Uses model function with fin_year
async function getStateAvg(req, res) {
    try {
        const { state, fin_year } = req.query;

        if (!state || !fin_year) {
            return res.status(400).json({ error: 'State and fin_year required' });
        }

        const avg = await getStateAverage(state, fin_year);
        res.json(avg);
    } catch (error) {
        console.error('Error fetching state average:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getDistrict, getStateList, getStateAvg };
