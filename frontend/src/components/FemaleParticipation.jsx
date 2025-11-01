import { FiTrendingUp } from 'react-icons/fi';
import { useLanguage } from '../hooks/useLanguage';

export default function FemaleParticipation({ womenPersondays, totalPersondays }) {
    const { t } = useLanguage();

    const percentage = totalPersondays ? ((womenPersondays / totalPersondays) * 100).toFixed(1) : 0;

    return (
        <div className="bg-gradient-to-r from-pink-50 to-red-50 border-l-4 border-pink-500 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">👩‍💼</span>
                <h3 className="font-bold text-lg text-gray-900">{t('femaleParticipation')}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">{t('womenPersondays')}</p>
                    <p className="text-2xl font-bold text-pink-600">{womenPersondays?.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">{t('percentage')}</p>
                    <p className="text-2xl font-bold text-pink-600">{percentage}%</p>
                </div>
            </div>

            <p className="text-sm text-gray-600 mt-4 italic">
                💪 {t('femaleParticipationMsg')}
            </p>
        </div>
    );
}
