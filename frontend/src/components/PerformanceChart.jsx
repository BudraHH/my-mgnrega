export default function PerformanceChart({ data }) {
    if (!data || data.length === 0) return null;

    // --- START: SORTING & DATA PREPARATION LOGIC ---

    const monthMap = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER' ];

    /**
     * Determines the correct calendar year for a given month within a financial year.
     * For FY "2023-2024", Jan/Feb/Mar are in 2024, while Apr-Dec are in 2023.
     */
    const getCalendarYear = (finYear, month) => {
        if (!finYear || !month) return null;

        const monthIndex = monthMap[month.toUpperCase()];
        if (monthIndex === undefined) return null;

        const yearParts = String(finYear).split('-');
        const startYear = parseInt(yearParts[0], 10);
        const endYear = parseInt(yearParts[1], 10) || startYear;

        // January, February, March (indices 0, 1, 2) belong to the end year of the FY.
        return monthIndex < 3 ? endYear : startYear;
    };

    // Create a new array and sort it chronologically (oldest to newest)
    const chartData = [...data.slice(0, 12)].sort((a, b) => {
        try {
            const dateA = new Date(getCalendarYear(a.fin_year, a.month), monthMap[(a.month || '').toUpperCase()]);
            const dateB = new Date(getCalendarYear(b.fin_year, b.month), monthMap[(b.month || '').toUpperCase()]);
            return dateA - dateB;
        } catch {
            return 0;
        }
    });

    // --- END: LOGIC ---

    const maxVal = Math.max(...chartData.map(d => d.total_exp || 0));
    const topOfYAxis = Math.ceil(maxVal / 1000) * 1000;

    return (
        <div className="w-full overflow-x-auto">
            {/* Chart Area */}
            <div className="flex items-end h-64 space-x-2 md:space-x-4">
                {/* Y-Axis Labels */}
                <div className="h-full flex flex-col justify-between text-right text-xs text-gray-500 pr-2">
                    <span>{topOfYAxis.toLocaleString()}</span>
                    <span>0</span>
                </div>

                {/* Chart Bars */}
                <div className="flex-1 h-full flex items-end space-x-1 md:space-x-2 border-l border-b border-gray-200 pl-1">
                    {chartData.map((record, idx) => {
                        const heightPercentage = topOfYAxis > 0 ? (record.total_exp / topOfYAxis) * 100 : 0;
                        return (
                            <div key={idx} className="relative flex-1 h-full flex items-end justify-center group">
                                {/* Custom Tooltip */}
                                <div className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <p className="font-bold">{record.month} {record.fin_year}</p>
                                    <p>Expenditure: ₹{record.total_exp?.toLocaleString() || '0'}</p>
                                </div>
                                {/* The Bar */}
                                <div
                                    className="w-full bg-green-400 rounded-t-md group-hover:bg-green-500 transition-colors duration-200"
                                    style={{ height: `${heightPercentage}%` }}
                                ></div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- X-Axis Labels (MODIFIED) --- */}
            <div className="flex pt-2 pl-12">
                {chartData.map((record, idx) => {
                    const calendarYear = getCalendarYear(record.fin_year, record.month);
                    const yearLabel = calendarYear ? `'${String(calendarYear).slice(-2)}` : '';

                    return (
                        <div key={idx} className="flex-1 text-center text-xs text-gray-500">
                            {/* Combines Month Abbreviation with Year Label */}
                            <span>{record.month?.slice(0, 3)}</span>
                            <span className="block">{yearLabel}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}