export type TabType = 'difficulty' | 'timing' | 'ai';
export type GridSize = 1 | 2 | 4 | 8;
export type MapperStyle = 'balanced' | 'jumps' | 'streams';
export type TimeUnit = 'ms' | 'sec';
export type RangeType = 'full' | 'selection';

export interface SettingsState {
    // UI
    activeTab: TabType;

    // AI Settings
    threshold: number;
    gridSize: GridSize;
    style: MapperStyle;
    isRangeEnabled: boolean;
    startTime: string;
    endTime: string;
    timeUnit: TimeUnit;

    // Difficulty Settings
    ar: number;
    cs: number;
    od: number;
    hp: number;

    // Timing Settings (Новое)
    bpm: string;
    offset: string;
    isMetronomeEnabled: boolean;
}