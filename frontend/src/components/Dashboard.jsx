import MetricsCard from './MetricsCard';
import PerformanceChart from "./PerformanceChart.jsx";
import { FiCalendar, FiUsers, FiBriefcase, FiTrendingUp, FiCheckSquare } from 'react-icons/fi';
import { getStateAverage } from '../api/client';
import { useState, useEffect } from "react";
import { useLanguage } from '../hooks/useLanguage';
import FemaleParticipation from "./FemaleParticipation.jsx";
import ShareButton from "./ShareButton.jsx";
import PrintReport from "./PrintReport.jsx";
import {useNavigate} from "react-router-dom";


export default function Dashboard({ selectedDistrict, state, data, financialYear }) {
    const navigate = useNavigate();
    const { language, t } = useLanguage();

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-16 px-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900">{t('noDataAvailable')}</h3>
                <p className="mt-1 text-base text-gray-500">
                    {t('noPerformanceData')} {selectedDistrict} {t('in')} {financialYear}.
                </p>
            </div>
        );
    }

    const latestRecord = data[0];
    const previousMonth = data[1];
    const [stateAvg, setStateAvg] = useState(null);

    const getGrowth = (current, previous) => {
        if (!previous || previous === 0) return null;
        return ((current - previous) / previous) * 100;
    };

    useEffect(() => {
        const fetchAvg = async () => {
            try {
                const res = await getStateAverage(state, financialYear);
                setStateAvg(res.data);
            } catch (error) {
                console.error('Error fetching state average:', error);
            }
        };
        fetchAvg();
    }, [state, financialYear]);

    const handleCompare = () => {
        navigate('/compare');
    }
    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 space-y-8">
            {/* --- Dashboard Header --- */}
            <div className="flex flex-col md:flex-row justify-between items-start">
                <div>
                    <p className="text-sm md:text-xl font-semibold text-green-600">// {state} <span className="font-bold text-gray-900 tracking-tight">/ {selectedDistrict}</span></p>
                    <p className="text-sm text-gray-600 mt-2">
                        📅 {t('financialYear')}: <strong>{financialYear}</strong>
                    </p>
                </div>
                <button onClick={handleCompare}>compare</button>
                <p className="text-sm text-gray-500">
                    {t('lastUpdated')}: {new Date(latestRecord.updated_at || Date.now()).toLocaleString('en-IN')}
                </p>
            </div>

            <hr/>

            {/* --- Latest Metrics --- */}
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('latestMetrics')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <MetricsCard
                        icon={<FiUsers />}
                        label={t('activeWorkers')}
                        value={latestRecord.total_active_workers?.toLocaleString() || '0'}
                        tooltip={t('tooltipActiveWorkers')}
                        growthPercent={getGrowth(latestRecord.total_active_workers, previousMonth?.total_active_workers)}
                    />
                    <MetricsCard
                        icon={<FiBriefcase />}
                        label={t('householdsWorked')}
                        value={latestRecord.total_households_worked?.toLocaleString() || '0'}
                        tooltip={t('tooltipHouseholds')}
                        growthPercent={getGrowth(latestRecord.total_households_worked, previousMonth?.total_households_worked)}
                    />
                    <MetricsCard
                        icon={<FiTrendingUp />}
                        label={t('totalExpenditure')}
                        value={latestRecord.total_exp?.toLocaleString() || '0'}
                        unit="₹"
                        tooltip={t('tooltipExpenditure')}
                        growthPercent={getGrowth(latestRecord.total_exp, previousMonth?.total_exp)}
                    />
                    <MetricsCard
                        icon={<FiCalendar />}
                        label={t('avgDays')}
                        value={latestRecord.average_days_employment || 'N/A'}
                        tooltip={t('tooltipAvgDays')}
                        growthPercent={getGrowth(latestRecord.average_days_employment, previousMonth?.average_days_employment)}
                    />
                    <MetricsCard
                        icon={<FiCheckSquare />}
                        label={t('worksCompleted')}
                        value={latestRecord.number_of_completed_works?.toLocaleString() || '0'}
                        tooltip={t('tooltipWorks')}
                        growthPercent={getGrowth(latestRecord.number_of_completed_works, previousMonth?.number_of_completed_works)}
                    />
                    <MetricsCard
                        icon={<FiUsers/>}
                        label={t('womenPersondays')}
                        value={latestRecord.women_persondays?.toLocaleString() || '0'}
                        tooltip={t('tooltipWomen')}
                        growthPercent={getGrowth(latestRecord.women_persondays, previousMonth?.women_persondays)}
                    />
                </div>
            </div>

            <hr/>

            {/* --- Performance Chart --- */}
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('expenditureTrend')}</h3>
                <PerformanceChart data={data} />
            </div>

            <hr/>

            {/* --- Historical Data Table --- */}
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('historicalData')}</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className=" max-w-10/12 overflow-x-auto md:w-full">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">{t('month')}</th>
                            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">{t('year')}</th>
                            <th className="px-4 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">{t('workers')}</th>
                            <th className="px-4 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">{t('households')}</th>
                            <th className="px-4 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">{t('avgDaysHeader')}</th>
                            <th className="px-4 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">{t('expenditure')}</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {data.slice(0, 12).map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-gray-700">{row.month || 'N/A'}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-gray-500">{row.fin_year}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-right text-gray-700 font-medium">{row.total_active_workers?.toLocaleString() || '0'}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-right text-gray-700 font-medium">{row.total_households_worked?.toLocaleString() || '0'}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-right text-gray-700 font-medium">{row.average_days_employment || 'N/A'}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-right text-gray-700 font-medium">{row.total_exp?.toLocaleString() || '0'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- State Comparison --- */}
            {stateAvg && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mt-6">
                    <h4 className="font-semibold text-blue-900 mb-3">📊 {t('comparisonWithState')}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-blue-600">{t('workersVsAvg')}</p>
                            <p className="text-xl font-bold text-blue-900">
                                {stateAvg.avg_workers ? ((latestRecord.total_active_workers / stateAvg.avg_workers) * 100 - 100).toFixed(0) : '0'}%
                                {stateAvg.avg_workers && (latestRecord.total_active_workers / stateAvg.avg_workers) >= 1 ? ' 📈' : ' 📉'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-blue-600">{t('householdsVsAvg')}</p>
                            <p className="text-xl font-bold text-blue-900">
                                {stateAvg.avg_households ? ((latestRecord.total_households_worked / stateAvg.avg_households) * 100 - 100).toFixed(0) : '0'}%
                                {stateAvg.avg_households && (latestRecord.total_households_worked / stateAvg.avg_households) >= 1 ? ' 📈' : ' 📉'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-blue-600">{t('expenditureVsAvg')}</p>
                            <p className="text-xl font-bold text-blue-900">
                                {stateAvg.avg_expenditure ? ((latestRecord.total_exp / stateAvg.avg_expenditure) * 100 - 100).toFixed(0) : '0'}%
                                {stateAvg.avg_expenditure && (latestRecord.total_exp / stateAvg.avg_expenditure) >= 1 ? ' 📈' : ' 📉'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-blue-600">{t('daysVsAvg')}</p>
                            <p className="text-xl font-bold text-blue-900">
                                {stateAvg.avg_days ? ((latestRecord.average_days_employment / stateAvg.avg_days) * 100 - 100).toFixed(0) : '0'}%
                                {stateAvg.avg_days && (latestRecord.average_days_employment / stateAvg.avg_days) >= 1 ? ' 📈' : ' 📉'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {latestRecord.women_persondays && (
                <>
                    <hr/>
                    <FemaleParticipation
                        womenPersondays={latestRecord.women_persondays}
                        totalPersondays={latestRecord.total_active_workers}
                    />
                </>
            )}

            <div className="flex gap-4">
                <ShareButton district={selectedDistrict} state={state} workers={latestRecord.total_active_workers} />
                <PrintReport district={selectedDistrict} state={state} data={data} />
            </div>

        </div>
    );
}
