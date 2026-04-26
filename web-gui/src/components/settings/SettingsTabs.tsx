import { useTranslation } from 'react-i18next';
import type {TabType} from './types';
import {useSettingsStore} from "../../store/useSettingsStore.ts";

export const SettingsTabs = () => {
    const { t } = useTranslation();
    const tabs: TabType[] = ['info', 'difficulty', 'timing', 'ai'];

    const activeTab = useSettingsStore((state) => state.activeTab);
    const setActiveTab = useSettingsStore((state) => state.setActiveTab);

    return (
        <div className="flex w-full bg-studio border-b border-border shrink-0">
            {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                            flex-1 py-3 text-[0.7rem] uppercase tracking-wider font-bold transition-colors
                            border-r border-border last:border-r-0
                            ${isActive
                            ? 'bg-panel text-accent border-b-2 border-b-accent'
                            : 'bg-studio text-foreground-muted hover:bg-white/5 hover:text-foreground border-b-2 border-b-transparent'
                        }
                        `}
                    >
                        {t(`settings.tabs.${tab}`)}
                    </button>
                );
            })}
        </div>
    );
};