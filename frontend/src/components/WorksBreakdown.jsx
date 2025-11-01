import { useLanguage } from '../hooks/useLanguage';

export default function WorksBreakdown({ worksData }) {
    const { t } = useLanguage();

    const categories = [
        { name: t('roads'), value: worksData?.roads || 0, color: 'bg-blue-500' },
        { name: t('waterWorks'), value: worksData?.water || 0, color: 'bg-cyan-500' },
        { name: t('soilConservation'), value: worksData?.soil || 0, color: 'bg-green-500' },
        { name: t('irrigation'), value: worksData?.irrigation || 0, color: 'bg-purple-500' }
    ];

    const total = categories.reduce((sum, cat) => sum + cat.value, 0);

    return (
        <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-4">{t('worksBreakdown')}</h3>

            <div className="space-y-4">
                {categories.map((cat) => (
                    <div key={cat.name}>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">{cat.name}</span>
                            <span className="text-sm font-bold text-gray-900">{cat.value}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className={`${cat.color} h-3 rounded-full`}
                                style={{ width: `${total ? (cat.value / total) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
