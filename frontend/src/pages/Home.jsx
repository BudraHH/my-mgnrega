import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import SearchableSelect from '../components/SearchableSelect';
import { getDistricts, getDistrictData } from '../api/client';
import { FiMapPin, FiBarChart2, FiLoader, FiCalendar } from 'react-icons/fi';
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

const FINANCIAL_YEARS = [
    '2024-2025', '2023-2024', '2022-2023', '2021-2022', '2020-2021', '2019-2020',
    '2018-2019', '2017-2018', '2016-2017', '2015-2016', '2014-2015', '2013-2014'
];

const Spinner = () => (
    <div className="flex justify-center items-center p-4">
        <FiLoader className="animate-spin text-green-600 h-8 w-8" />
    </div>
);

const InitialPlaceholder = () => {
    const { t } = useLanguage();

    return (
        <div className="text-center py-16 px-6 bg-slate-50 rounded-lg border-2 border-dashed border-gray-300">
            <FiBarChart2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">{t('dashboardReady')}</h3>
            <p className="mt-1 text-base text-gray-500">{t('selectInfo')}</p>
        </div>
    );
};

export default function Home() {
    const { language, t } = useLanguage();

    const [state, setState] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [financialYear, setFinancialYear] = useState('2024-2025');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isInitial, setIsInitial] = useState(true);
    const [districtsLoading, setDistrictsLoading] = useState(false);

    useEffect(() => {
        if (!state) {
            setDistricts([]);
            return;
        }

        const loadDistricts = async () => {
            setDistrictsLoading(true);
            setSelectedDistrict('');
            setData(null);

            try {
                const res = await getDistricts(state);
                setDistricts(res.data.districts || []);
            } catch (error) {
                console.error('Error fetching districts:', error);
                alert(t('failedLoadDistricts'));
            } finally {
                setDistrictsLoading(false);
            }
        };

        loadDistricts();
    }, [state]); // ✅ ONLY state, NOT t

    useEffect(() => {
        if (selectedDistrict && state) {
            loadDistrictData();
        }
    }, [financialYear, selectedDistrict, state, t]);

    const handleStateSelection = (newState) => {
        setState(newState);
    };

    const loadDistrictData = async () => {
        if (!selectedDistrict) {
            alert(t('pleaseSelectDistrict'));
            return;
        }

        setIsInitial(false);
        setLoading(true);
        setData(null);

        try {
            const res = await getDistrictData(state, selectedDistrict, financialYear);
            setData(res.data.data || []);
        } catch (error) {
            console.error('Error fetching district data:', error);
            alert(t('failedLoadData'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* --- Control Panel --- */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">

                {/* State Selector */}
                <div>
                    <label className="text-base font-semibold text-gray-800 flex items-center mb-3">
                        <FiMapPin className="mr-2 text-green-600" />
                        {t('selectStateLabel')}
                    </label>
                    <SearchableSelect
                        options={STATES}
                        value={state}
                        onChange={handleStateSelection}
                        placeholder={t('typeOrSelectState')}
                    />
                </div>

                {/* District Selector */}
                <div className={`transition-opacity duration-500 ${state ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                    <label className="text-base font-semibold text-gray-800 flex items-center mb-3">
                        <FiBarChart2 className="mr-2 text-green-600" />
                        {t('selectDistrictLabel')}
                    </label>
                    <div className="sm:col-span-2">
                        <SearchableSelect
                            options={districts}
                            value={selectedDistrict}
                            onChange={setSelectedDistrict}
                            placeholder={districtsLoading ? t('loadingDistricts') : t('typeOrSelectDistrict')}
                            disabled={!state || districtsLoading}
                        />
                    </div>
                </div>

                {/* Financial Year Selector */}
                <div className={`transition-opacity duration-500 ${selectedDistrict ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                    <label className="text-base font-semibold text-gray-800 flex items-center mb-3">
                        <FiCalendar className="mr-2 text-green-600" />
                        {t('selectFinancialYearLabel')}
                    </label>
                    <select
                        value={financialYear}
                        onChange={(e) => setFinancialYear(e.target.value)}
                        disabled={!selectedDistrict}
                        className="w-full py-3 px-4 bg-white bg-gray-10 0 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-none focus:border-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        {FINANCIAL_YEARS.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-2">📝 {t('selectingYearNote')}</p>
                </div>
            </div>

            {/* --- Dashboard Display Area --- */}
            <div>
                {isInitial && <InitialPlaceholder />}
                {loading && !isInitial && <Spinner />}
                {data && !loading && (
                    <Dashboard
                        selectedDistrict={selectedDistrict}
                        state={state}
                        data={data}
                        financialYear={financialYear}
                    />
                )}
            </div>
        </div>
    );
}
