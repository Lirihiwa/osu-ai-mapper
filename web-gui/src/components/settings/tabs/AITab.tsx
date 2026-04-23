import { useTranslation } from 'react-i18next';
import { Tooltip } from 'react-tooltip';
import type { GridSize, MapperStyle, TimeUnit } from '../types';
import { useSettingsStore } from "../../../store/useSettingsStore";
import { SliderField } from '../../ui/SliderField';
import { SectionTitle } from '../../ui/SectionTitle'; // Импортируем заголовок

export const AITab = () => {
    const { t } = useTranslation();
    const gridOptions: GridSize[] = [1, 2, 4, 8];

    const {
        threshold, setThreshold,
        gridSize, setGridSize,
        style, setStyle,
        isRangeEnabled, setIsRangeEnabled,
        startTime, setStartTime,
        endTime, setEndTime,
        timeUnit, setTimeUnit
    } = useSettingsStore();

    return (
        <div className="flex flex-col gap-10">
            {/* 1. Threshold (Используем общий компонент слайдера) */}
            <SliderField
                label={t('settings.ai.threshold')}
                value={threshold}
                onChange={setThreshold}
                tipId="threshold-tip"
                tipContent={t('settings.ai.threshold_tooltip')}
                min={0.1} max={0.9} step={0.05} precision={2}
            />

            {/* 2. Grid Snap (Используем UI заголовок) */}
            <div>
                <SectionTitle
                    label={t('settings.ai.grid_snap')}
                    tooltipId="grid-tip"
                    tooltipContent={t('settings.ai.grid_snap_tooltip')}
                />
                <div className="flex bg-studio border border-border p-1">
                    {gridOptions.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setGridSize(opt)}
                            className={`flex-1 py-1.5 text-xs font-mono transition-colors ${
                                gridSize === opt ? 'bg-accent text-accent-foreground' : 'hover:bg-white/5 text-foreground-muted'
                            }`}
                        >
                            1/{opt}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. Style */}
            <div>
                <SectionTitle
                    label={t('settings.ai.style')}
                    tooltipId="style-tip"
                    tooltipContent={t('settings.ai.style_tooltip')}
                />
                <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value as MapperStyle)}
                    className="w-full bg-studio border border-border p-2 text-sm text-foreground outline-none focus:border-accent transition-colors appearance-none cursor-pointer"
                >
                    <option value="balanced">{t('settings.ai.styles.balanced')}</option>
                    <option value="jumps">{t('settings.ai.styles.jumps')}</option>
                    <option value="streams">{t('settings.ai.styles.streams')}</option>
                </select>
            </div>

            {/* 4. Range */}
            <div className="flex flex-col gap-4">
                <SectionTitle
                    label={t('settings.ai.range.title')}
                    tooltipId="range-tip"
                    tooltipContent={t('settings.ai.range.tooltip')}
                >
                    <input
                        type="checkbox"
                        checked={isRangeEnabled}
                        onChange={(e) => setIsRangeEnabled(e.target.checked)}
                        className="w-4 h-4 accent-accent cursor-pointer"
                    />
                </SectionTitle>

                <div className={`flex flex-col gap-3 transition-opacity ${!isRangeEnabled ? 'opacity-40' : 'opacity-100'}`}>
                    <div className="flex justify-end mb-1">
                        <div className="flex border border-border bg-studio p-0.5">
                            {(['ms', 'sec'] as TimeUnit[]).map((u) => (
                                <button
                                    key={u}
                                    disabled={!isRangeEnabled}
                                    onClick={() => setTimeUnit(u)}
                                    className={`px-2 py-0.5 text-[10px] uppercase font-bold transition-colors ${
                                        timeUnit === u ? 'bg-accent text-accent-foreground' : 'text-foreground-muted hover:text-foreground'
                                    }`}
                                >
                                    {t(`settings.ai.range.unit_${u}`)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] uppercase text-foreground-muted font-bold">{t('settings.ai.range.start')}</span>
                            <input
                                type="text" disabled={!isRangeEnabled}
                                value={isRangeEnabled ? startTime : '--'}
                                onChange={(e) => setStartTime(e.target.value.replace(/[^0-9.]/g, ''))}
                                className="bg-studio border border-border p-2 text-sm font-mono text-accent outline-none focus:border-accent"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] uppercase text-foreground-muted font-bold">{t('settings.ai.range.end')}</span>
                            <input
                                type="text" disabled={!isRangeEnabled}
                                value={isRangeEnabled ? endTime : '--'}
                                onChange={(e) => setEndTime(e.target.value.replace(/[^0-9.]/g, ''))}
                                className="bg-studio border border-border p-2 text-sm font-mono text-accent outline-none focus:border-accent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tooltips (те, что не внутри SliderField) */}
            <Tooltip id="grid-tip" place="left" className="z-50 !bg-studio !border !border-border !text-foreground-muted !rounded-none !px-3 !py-2 !text-xs" />
            <Tooltip id="style-tip" place="left" className="z-50 !bg-studio !border !border-border !text-foreground-muted !rounded-none !px-3 !py-2 !text-xs" />
            <Tooltip id="range-tip" place="left" className="z-50 !bg-studio !border !border-border !text-foreground-muted !rounded-none !px-3 !py-2 !text-xs" />
        </div>
    );
};