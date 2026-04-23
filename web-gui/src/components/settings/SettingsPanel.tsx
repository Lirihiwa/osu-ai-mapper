import { useSettingsStore } from '../../store/useSettingsStore';
import { SettingsTabs } from './SettingsTabs';
import { AITab } from './tabs/AITab';
import { DifficultyTab } from './tabs/difficulty/DifficultyTab.tsx';
import { TimingTab } from './tabs/TimingTab';
import { useTranslation } from 'react-i18next';
import {useState} from "react";
import {mapperApi} from "../../api/mapperApi.ts";
import {LoadingOutlined} from "@ant-design/icons";

export const SettingsPanel = () => {
    const { t } = useTranslation();
    const [isGenerating, setIsGenerating] = useState(false);

    const {
        activeTab,
        onsets, bpm, offset, gridSize,
        isRangeEnabled, startTime, endTime, timeUnit,
        setHitObjects
    } = useSettingsStore();

    // Достаем функцию генерации, которая просто возьмет всё из стора
    const handleGenerate = async () => {
        if (!onsets || onsets.length === 0) return alert("Analyze rhythm first");

        setIsGenerating(true);
        try {
            const parseTimeToInt = (val: string) => {
                const num = parseFloat(val) || 0;
                const ms = timeUnit === 'sec' ? num * 1000 : num;
                return Math.round(ms); // Гарантируем Integer
            };

            const payload: any = {
                onsets: onsets,
                bpm: parseFloat(bpm) || 120,
                offset: Math.round(parseFloat(offset) || 0), // В целое число
                grid_size: gridSize,
                start_time: isRangeEnabled ? parseTimeToInt(startTime) : 0,
            };

            if (isRangeEnabled) {
                payload.end_time = parseTimeToInt(endTime);
            }

            console.log("Sending payload:", payload);

            const data = await mapperApi.generateObjects(payload);
            setHitObjects(data.hit_objects);

        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-panel">
            <SettingsTabs /> {/* Пропсы больше не нужны! */}

            <div className="flex-1 p-6 overflow-y-auto">
                {activeTab === 'ai' && <AITab />}
                {activeTab === 'timing' && <TimingTab />}
                {activeTab === 'difficulty' && <DifficultyTab />}
            </div>

            <div className="p-4 border-t border-border bg-panel shrink-0">
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !onsets}
                    className="w-full py-3 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-accent-foreground font-bold uppercase tracking-widest transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(255,0,102,0.2)]"
                >
                    {isGenerating ? (
                        <div className="flex items-center justify-center gap-2">
                            <LoadingOutlined /> {t('settings.generating_status')}
                        </div>
                    ) : (
                        t('settings.generate_btn')
                    )}
                </button>
            </div>
        </div>
    );
};