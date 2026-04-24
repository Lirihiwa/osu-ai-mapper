import { useSettingsStore } from '../../store/useSettingsStore';
import { SettingsTabs } from './SettingsTabs';
import { AITab } from './tabs/AITab';
import { DifficultyTab } from './tabs/difficulty/DifficultyTab.tsx';
import { TimingTab } from './tabs/TimingTab';
import { useTranslation } from 'react-i18next';
import { LoadingOutlined } from "@ant-design/icons";
import { MapperService } from "../../services/MapperService.ts";

export const SettingsPanel = () => {
    const { t } = useTranslation();
    const { activeTab, onsets, isGenerating } = useSettingsStore();

    return (
        <div className="flex flex-col h-full bg-panel">
            <SettingsTabs />
            <div className="flex-1 p-6 overflow-y-auto">
                {activeTab === 'ai' && <AITab />}
                {activeTab === 'timing' && <TimingTab />}
                {activeTab === 'difficulty' && <DifficultyTab />}
            </div>
            <div className="p-4 border-t border-border bg-panel shrink-0">
                <button
                    onClick={() => MapperService.generateMap()}
                    disabled={isGenerating || !onsets}
                    className="w-full py-3 bg-accent hover:bg-accent/90 disabled:opacity-50"
                >
                    {isGenerating ? <LoadingOutlined /> : t('settings.generate_btn')}
                </button>
            </div>
        </div>
    );
};