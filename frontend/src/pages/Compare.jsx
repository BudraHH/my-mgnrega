import { useState, useEffect } from 'react';
import { FiUsers, FiBarChart2 } from 'react-icons/fi';
import SearchableSelect from '../components/SearchableSelect';
import { getDistricts, getDistrictData } from '../api/client';
import { useLanguage } from '../hooks/useLanguage';

const STATES = [
    'ANDHRA PRADESH', 'ARUNACHAL PRADESH', 'ASSAM', 'BIHAR', 'CHHATTISGARH', 'GOA', 'GUJARAT',
    'HARYANA', 'HIMACHAL PRADESH', 'JHARKHAND', 'KARNATAKA', 'KERALA', 'MADHYA PRADESH',
    'MAHARASHTRA', 'MANIPUR', 'MEGHALAYA', 'MIZORAM', 'NAGALAND', 'ODISHA', 'PUNJAB',
    'RAJASTHAN', 'SIKKIM', 'TAMIL NADU', 'TELANGANA', 'TRIPURA', 'UTTAR PRADESH',
    'UTTARAKHAND', 'WEST BENGAL', 'ANDAMAN AND NICOBAR ISLANDS', 'CHANDIGARH',
    'DADRA AND NAGAR HAVELI AND DAMAN AND DIU', 'DELHI', 'JAMMU AND KASHMIR', 'LADAKH',
    'LAKSHADWEEP', 'PUDUCHERRY'
];

const FINANCIAL_YEARS = ['2024-2025', '2023-2024', '2022-2023', '2021-2022', '2020-2021'];

// ✅ Reusable Selection Panel Component
const SelectionPanel = ({
                            title, titleColor, state, onStateChange, districts, district, onDistrictChange,
                            year, onYearChange, isDisabled = false, t
                        }) => (
    <div className={`space-y-4 p-4 rounded-lg ${isDisabled ? 'bg-gray-50' : ''}`}>
        <h2 className={`text-lg font-bold ${titleColor}`}>{title}</h2>
        <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">{t('selectStateLabel')}</label>
            <SearchableSelect
                options={STATES}
                value={state}
                onChange={onStateChange}
                placeholder={t('typeOrSelectState')}
                disabled={isDisabled}
            />
        </div>
        <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">{t('selectDistrictLabel')}</label>
            <SearchableSelect
                options={districts}
                value={district}
                onChange={onDistrictChange}
                placeholder={t('typeOrSelectDistrict')}
                disabled={isDisabled || !state}
            />
        </div>
        <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">{t('selectFinancialYearLabel')}</label>
            <SearchableSelect
                options={FINANCIAL_YEARS}
                value={year}
                onChange={onYearChange}
                placeholder="Select year..."
                disabled={isDisabled}
            />
        </div>
    </div>
);

// ✅ Metric Row Component
const MetricRow = ({ label, val1, val2, isHigherBetter = true }) => {
    const formatValue = (val) => val?.toLocaleString() ?? 'N/A';
    const difference = (val1 ?? 0) - (val2 ?? 0);
    const isPositive = difference > 0;
    const isNegative = difference < 0;

    let diffColor = 'text-gray-500';
    if ((isPositive && isHigherBetter) || (isNegative && !isHigherBetter)) {
        diffColor = 'text-green-600';
    } else if ((isNegative && isHigherBetter) || (isPositive && !isHigherBetter)) {
        diffColor = 'text-red-600';
    }

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-4 font-semibold text-gray-800">{label}</td>
            <td className="px-4 py-4 text-center font-medium text-gray-700">{formatValue(val1)}</td>
            <td className="px-4 py-4 text-center font-medium text-gray-700">{formatValue(val2)}</td>
            <td className={`px-4 py-4 text-center font-bold ${diffColor}`}>
                {difference !== 0 ? `${isPositive ? '+' : ''}${formatValue(difference)}` : '—'}
            </td>
        </tr>
    );
};

export default function Compare() {
    const { t } = useLanguage();

    // ✅ State Management
    const [comparisonType, setComparisonType] = useState('different-districts');
    const [state1, setState1] = useState('');
    const [districts1, setDistricts1] = useState([]);
    const [district1, setDistrict1] = useState('');
    const [year1, setYear1] = useState('2024-2025');
    const [state2, setState2] = useState('');
    const [districts2, setDistricts2] = useState([]);
    const [district2, setDistrict2] = useState('');
    const [year2, setYear2] = useState('2023-2024');
    const [data1, setData1] = useState(null);
    const [data2, setData2] = useState(null);
    const [loading, setLoading] = useState(false);

    // ✅ Load districts for State 1
    useEffect(() => {
        if (!state1) {
            setDistricts1([]);
            return;
        }
        const loadDist = async () => {
            try {
                const res = await getDistricts(state1);
                setDistricts1(res.data.districts || []);
                setDistrict1('');
            } catch (error) {
                console.error('Error loading districts:', error);
            }
        };
        loadDist();
    }, [state1]);

    // ✅ Load districts for State 2
    useEffect(() => {
        if (!state2 || comparisonType === 'same-district') {
            setDistricts2([]);
            return;
        }
        const loadDist = async () => {
            try {
                const res = await getDistricts(state2);
                setDistricts2(res.data.districts || []);
                setDistrict2('');
            } catch (error) {
                console.error('Error loading districts:', error);
            }
        };
        loadDist();
    }, [state2, comparisonType]);

    // ✅ Auto-sync State 2 when comparison type is "same-district"
    useEffect(() => {
        if (comparisonType === 'same-district') {
            setState2(state1);
            setDistrict2(district1);
            setDistricts2(districts1);
        }
    }, [comparisonType, state1, district1, districts1]);

    // ✅ Fetch Comparison Data
    const fetchComparison = async () => {
        if (!district1 || !year1 || !year2) {
            alert(t('pleaseSelectDistrict'));
            return;
        }

        if (comparisonType === 'different-districts' && !district2) {
            alert(t('pleaseSelectDistrict'));
            return;
        }

        setLoading(true);
        try {
            const [res1, res2] = await Promise.all([
                getDistrictData(state1, district1, year1),
                getDistrictData(
                    comparisonType === 'same-district' ? state1 : state2,
                    comparisonType === 'same-district' ? district1 : district2,
                    year2
                )
            ]);
            setData1(res1.data.data?.[0]);
            setData2(res2.data.data?.[0]);
        } catch (error) {
            console.error('Error fetching comparison:', error);
            alert(t('failedLoadData'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* --- Header --- */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
                    <FiBarChart2 className="mr-3 text-green-600" />
                    {t('compare')}
                </h1>
                <p className="text-gray-600">{t('comparisonDesc')}</p>
            </div>

            {/* --- Control Panel --- */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                {/* Comparison Type Toggle */}
                <div className="mb-6">
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">{t('comparisonType')}:</label>
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-full md:w-auto">
                        <button
                            onClick={() => setComparisonType('different-districts')}
                            className={`flex-1 md:flex-none px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                                comparisonType === 'different-districts'
                                    ? 'bg-white shadow text-green-600'
                                    : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            🔄 {t('differentDistricts')}
                        </button>
                        <button
                            onClick={() => setComparisonType('same-district')}
                            className={`flex-1 md:flex-none px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                                comparisonType === 'same-district'
                                    ? 'bg-white shadow text-green-600'
                                    : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            📅 {t('sameDistrict')}
                        </button>
                    </div>
                </div>

                {/* Selection Grids */}
                <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-start">
                    {/* Baseline Selection */}
                    <div className="md:col-span-5">
                        <SelectionPanel
                            title={t('baseline')}
                            titleColor="text-blue-600"
                            state={state1}
                            onStateChange={setState1}
                            districts={districts1}
                            district={district1}
                            onDistrictChange={setDistrict1}
                            year={year1}
                            onYearChange={setYear1}
                            t={t}
                        />
                    </div>

                    {/* VS Divider */}
                    <div className="hidden md:flex flex-col items-center justify-center pt-12">
                        <span className="text-gray-400 font-bold text-lg">VS</span>
                        <div className="h-24 w-px bg-gray-200 my-2"></div>
                    </div>

                    {/* Comparison Selection */}
                    <div className="md:col-span-5">
                        <SelectionPanel
                            title={t('comparison')}
                            titleColor="text-purple-600"
                            state={comparisonType === 'same-district' ? state1 : state2}
                            onStateChange={setState2}
                            districts={comparisonType === 'same-district' ? districts1 : districts2}
                            district={comparisonType === 'same-district' ? district1 : district2}
                            onDistrictChange={setDistrict2}
                            year={year2}
                            onYearChange={setYear2}
                            isDisabled={comparisonType === 'same-district'}
                            t={t}
                        />
                    </div>
                </div>

                {/* Compare Button */}
                <div className="mt-6">
                    <button
                        onClick={fetchComparison}
                        disabled={
                            loading ||
                            !district1 ||
                            !year1 ||
                            !year2 ||
                            (comparisonType === 'different-districts' && !district2)
                        }
                        className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? `⏳ ${t('loading')}...` : `🔍 ${t('runComparison')}`}
                    </button>
                </div>
            </div>

            {/* --- Results Panel --- */}
            {data1 && data2 && !loading && (
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 {t('comparisonResults')}</h2>
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">{t('metric')}</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 uppercase">{t('baseline')}</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 uppercase">{t('comparison')}</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 uppercase">{t('difference')}</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white">
                            <MetricRow
                                label={t('activeWorkers')}
                                val1={data1.total_active_workers}
                                val2={data2.total_active_workers}
                            />
                            <MetricRow
                                label={t('householdsWorked')}
                                val1={data1.total_households_worked}
                                val2={data2.total_households_worked}
                            />
                            <MetricRow
                                label={t('totalExpenditure')}
                                val1={data1.total_exp}
                                val2={data2.total_exp}
                            />
                            <MetricRow
                                label={t('avgDays')}
                                val1={Math.round(data1.average_days_employment * 10) / 10}
                                val2={Math.round(data2.average_days_employment * 10) / 10}
                            />
                            <MetricRow
                                label={t('worksCompleted')}
                                val1={data1.number_of_completed_works}
                                val2={data2.number_of_completed_works}
                            />
                            <MetricRow
                                label={t('womenPersondays')}
                                val1={data1.women_persondays}
                                val2={data2.women_persondays}
                            />
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Cards */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <h3 className="font-bold text-blue-900 mb-2">📍 {t('baseline')}</h3>
                            <p className="text-sm text-blue-700">
                                {comparisonType === 'same-district'
                                    ? `${district1} (${year1})`
                                    : `${district1}, ${state1} (${year1})`}
                            </p>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                            <h3 className="font-bold text-purple-900 mb-2">📍 {t('comparison')}</h3>
                            <p className="text-sm text-purple-700">
                                {comparisonType === 'same-district'
                                    ? `${district1} (${year2})`
                                    : `${district2}, ${state2} (${year2})`}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Empty State --- */}
            {!data1 || !data2 || loading ? (
                <div className="text-center py-12 text-gray-500">
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
                            <span className="ml-3">{t('loading')}</span>
                        </div>
                    ) : (
                        <p>{t('selectInfo')}</p>
                    )}
                </div>
            ) : null}
        </div>
    );
}
