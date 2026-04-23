import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../../../store/useSettingsStore';
import { SliderField } from '../../../ui/SliderField'; // Импортируем наш новый UI компонент

export const DifficultyTab = () => {
    const { t } = useTranslation();
    const { ar, setAR, cs, setCS, od, setOD, hp, setHP } = useSettingsStore();

    return (
        <div className="flex flex-col gap-10">
            <SliderField
                label={t('settings.difficulty.ar')} value={ar} onChange={setAR}
                tipId="ar-tip" tipContent={t('settings.difficulty.ar_tip')}
            />
            <SliderField
                label={t('settings.difficulty.cs')} value={cs} onChange={setCS}
                tipId="cs-tip" tipContent={t('settings.difficulty.cs_tip')}
            />
            <SliderField
                label={t('settings.difficulty.od')} value={od} onChange={setOD}
                tipId="od-tip" tipContent={t('settings.difficulty.od_tip')}
            />
            <SliderField
                label={t('settings.difficulty.hp')} value={hp} onChange={setHP}
                tipId="hp-tip" tipContent={t('settings.difficulty.hp_tip')}
            />
        </div>
    );
};