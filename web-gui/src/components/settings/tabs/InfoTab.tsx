import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { Tooltip } from 'react-tooltip';

export const InfoTab = () => {
    const { t } = useTranslation();
    const title = useSettingsStore((s) => s.title);
    const setTitle = useSettingsStore((s) => s.setTitle);
    const artist = useSettingsStore((s) => s.artist);
    const setArtist = useSettingsStore((s) => s.setArtist);

    const inputClass = "w-full bg-studio border border-border p-2 text-sm text-accent outline-none focus:border-accent transition-colors";

    return (
        <div className="flex flex-col gap-8">
            <div>
                <SectionTitle
                    label={t('settings.info.title')}
                    tooltipId="title-tip"
                    tooltipContent={t('settings.info.title_tip')}
                />
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={inputClass}
                />
            </div>

            <div>
                <SectionTitle
                    label={t('settings.info.artist')}
                    tooltipId="artist-tip"
                    tooltipContent={t('settings.info.artist_tip')}
                />
                <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className={inputClass}
                />
            </div>

            <Tooltip id="title-tip" place="left" className="z-50 !bg-studio !border !border-border !text-foreground-muted !rounded-none !px-3 !py-2 !text-xs !max-w-[200px]" />
            <Tooltip id="artist-tip" place="left" className="z-50 !bg-studio !border !border-border !text-foreground-muted !rounded-none !px-3 !py-2 !text-xs !max-w-[200px]" />
        </div>
    );
};