const pool = require('../config/database');

// ✅ Insert MGNREGA data
async function insertMGNREGAData(data) {
    const query = `
        INSERT INTO mgnrega_data (
            fin_year, month, state_code, state_name, district_code, district_name,
            approved_labour_budget, average_wage_rate, average_days_employment,
            total_households_worked, total_individuals_worked, total_active_workers,
            total_active_job_cards, total_jobcards_issued, total_works_takenup,
            number_of_completed_works, number_of_ongoing_works, total_exp,
            wages, material_and_skilled_wages, total_adm_expenditure,
            sc_persondays, st_persondays, women_persondays, differently_abled_worked,
            total_hhs_100_days, persondays_central_liability,
            percent_category_b_works, percent_agriculture_works, percent_nrm_expenditure,
            percent_payments_15_days, remarks
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
                  $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
                  $29, $30, $31, $32)
            ON CONFLICT (fin_year, month, district_code) 
        DO UPDATE SET updated_at = CURRENT_TIMESTAMP
    `;

    const values = [
        data.fin_year, data.month, data.state_code, data.state_name, data.district_code,
        data.district_name, data.Approved_Labour_Budget, data.Average_Wage_rate_per_day_per_person,
        data.Average_days_of_employment_provided_per_Household, data.Total_Households_Worked,
        data.Total_Individuals_Worked, data.Total_No_of_Active_Workers, data.Total_No_of_Active_Job_Cards,
        data.Total_No_of_JobCards_issued, data.Total_No_of_Works_Takenup, data.Number_of_Completed_Works,
        data.Number_of_Ongoing_Works, data.Total_Exp, data.Wages, data.Material_and_skilled_Wages,
        data.Total_Adm_Expenditure, data.SC_persondays, data.ST_persondays, data.Women_Persondays,
        data.Differently_abled_persons_worked, data.Total_No_of_HHs_completed_100_Days_of_Wage_Employment,
        data.Persondays_of_Central_Liability_so_far, data.percent_of_Category_B_Works,
        data.percent_of_Expenditure_on_Agriculture_Allied_Works, data.percent_of_NRM_Expenditure,
        data.percentage_payments_gererated_within_15_days, data.Remarks
    ];

    return pool.query(query, values);
}

// ✅ FIXED: Get district data with fin_year parameter
async function getDistrictData(state, district, fin_year) {
    const query = `
        SELECT * FROM mgnrega_data
        WHERE state_name = $1
          AND district_name = $2
          AND fin_year = $3
        ORDER BY
            CASE
                WHEN month = 'APRIL' THEN 1
                WHEN month = 'MAY' THEN 2
                WHEN month = 'JUNE' THEN 3
                WHEN month = 'JULY' THEN 4
                WHEN month = 'AUGUST' THEN 5
                WHEN month = 'SEPTEMBER' THEN 6
                WHEN month = 'OCTOBER' THEN 7
                WHEN month = 'NOVEMBER' THEN 8
                WHEN month = 'DECEMBER' THEN 9
                WHEN month = 'JANUARY' THEN 10
                WHEN month = 'FEBRUARY' THEN 11
                WHEN month = 'MARCH' THEN 12
        END DESC
        LIMIT 100
    `;
    try {
        const result = await pool.query(query, [state, district, fin_year]);
        return result.rows;
    } catch (error) {
        console.error('Query error:', error.message);
        throw error;
    }
}

// ✅ Get state districts
async function getStateDistricts(state) {
    const query = `
        SELECT DISTINCT district_name FROM mgnrega_data
        WHERE state_name = $1
        ORDER BY district_name
    `;
    try {
        const result = await pool.query(query, [state]);
        return result.rows.map(row => row.district_name);
    } catch (error) {
        console.error('Query error:', error.message);
        throw error;
    }
}

// ✅ ADDED: Get state average with fin_year
async function getStateAverage(state, fin_year) {
    const query = `
        SELECT 
            AVG(total_active_workers) as avg_workers,
            AVG(total_households_worked) as avg_households,
            AVG(total_exp) as avg_expenditure,
            AVG(average_days_employment) as avg_days
        FROM mgnrega_data
        WHERE state_name = $1 AND fin_year = $2
    `;
    try {
        const result = await pool.query(query, [state, fin_year]);
        return result.rows[0];
    } catch (error) {
        console.error('Query error:', error.message);
        throw error;
    }
}

module.exports = {
    insertMGNREGAData,
    getDistrictData,
    getStateDistricts,
    getStateAverage // ✅ ADDED
};
