DROP TABLE IF EXISTS mgnrega_data;

CREATE TABLE mgnrega_data (
                              id SERIAL PRIMARY KEY,
                              fin_year VARCHAR(10),
                              month VARCHAR(20),
                              state_code VARCHAR(5),
                              state_name VARCHAR(100),
                              district_code VARCHAR(5),
                              district_name VARCHAR(100),

    -- Key metrics - CHANGED TO NUMERIC
                              approved_labour_budget NUMERIC,
                              average_wage_rate NUMERIC,
                              average_days_employment NUMERIC,
                              total_households_worked NUMERIC,
                              total_individuals_worked NUMERIC,
                              total_active_workers NUMERIC,
                              total_active_job_cards NUMERIC,
                              total_jobcards_issued NUMERIC,

    -- Works
                              total_works_takenup NUMERIC,
                              number_of_completed_works NUMERIC,
                              number_of_ongoing_works NUMERIC,

    -- Expenditure
                              total_exp NUMERIC,
                              wages NUMERIC,
                              material_and_skilled_wages NUMERIC,
                              total_adm_expenditure NUMERIC,

    -- Social categories
                              sc_persondays NUMERIC,
                              st_persondays NUMERIC,
                              women_persondays NUMERIC,
                              differently_abled_worked NUMERIC,

    -- Completion metrics
                              total_hhs_100_days NUMERIC,
                              persondays_central_liability NUMERIC,

    -- Percentages
                              percent_category_b_works NUMERIC,
                              percent_agriculture_works NUMERIC,
                              percent_nrm_expenditure NUMERIC,
                              percent_payments_15_days NUMERIC,

                              remarks TEXT,

    -- Metadata
                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                              UNIQUE(fin_year, month, district_code)
);

CREATE INDEX idx_state_name ON mgnrega_data(state_name);
CREATE INDEX idx_district_name ON mgnrega_data(district_name);
CREATE INDEX idx_fin_year ON mgnrega_data(fin_year);
CREATE INDEX idx_month ON mgnrega_data(month);
