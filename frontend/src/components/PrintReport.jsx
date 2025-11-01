import { useLanguage } from '../hooks/useLanguage';
import { FiPrinter } from 'react-icons/fi';

export default function PrintReport({ district, state, data }) {
    const { t } = useLanguage();

    const handlePrint = () => {
        window.print();
    };

    return (
        <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
            <FiPrinter />
            {t('printReport')}
        </button>
    );
}
