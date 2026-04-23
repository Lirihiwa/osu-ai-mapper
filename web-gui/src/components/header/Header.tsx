import { useTranslation } from 'react-i18next';
import "flag-icons/css/flag-icons.min.css";

export const Header = () => {
    const { t, i18n } = useTranslation();

    const toggleLanguage = async () => {
        const newLang = i18n.language === 'ru' ? 'en' : 'ru';
        await i18n.changeLanguage(newLang);
    };

    return (
        <div className="flex items-center justify-between w-full">
            <div className="font-bold text-accent tracking-widest uppercase">
                {t('header.title')}
            </div>
            <div className="text-sm text-foreground-muted flex items-center gap-4">
                <button
                    onClick={toggleLanguage}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-xs uppercase transition-colors"
                >
                    <div className="flex flex-row w-12 items-center justify-center gap-x-2">
                        <span className={`fi fi-${i18n.language === 'ru' ? 'ru' : 'us'} rounded-xs`}></span>
                        {i18n.language}
                    </div>
                </button>
            </div>
        </div>
    );
};