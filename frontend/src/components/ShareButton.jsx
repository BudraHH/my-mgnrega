import { useLanguage } from '../hooks/useLanguage';
import { FiShare2 } from 'react-icons/fi';

export default function ShareButton({ district, state, workers }) {
    const { t, language } = useLanguage();

    const message = `🎯 *MGNREGA Update - ${state}/${district}*\n\n` +
        `📊 Active Workers: ${workers?.toLocaleString()}\n` +
        `📅 Data: Latest Month\n\n` +
        `View Dashboard: http://localhost:5173\n\n` +
        `#MGNREGA #Employment #Development`;

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
            <FiShare2 />
            {t('shareWhatsApp')}
        </a>
    );
}
