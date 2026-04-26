export type TabType = 'difficulty' | 'timing' | 'ai' | 'info';
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

    // Timing Settings
    bpm: string;
    offset: string;
    isMetronomeEnabled: boolean;
}

export interface FileState {
    fileId: string | null;
    filename: string | null;
    isUploading: boolean;
    isExporting: boolean;
}

export interface HitObject {
    x: number;
    y: number;
    time: number;
    new_combo: boolean;
}

export interface EditorState {
    isGenerating: boolean;
    isAnalyzingBPM: boolean;
    isAnalyzingOffset: boolean;
    onsets: number[] | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    hitObjects: HitObject[];
    isAppBusy: boolean;
}

export interface MetadataState {
    title: string;
    artist: string;
}

export interface SettingsStateSetter {
    setActiveTab: (tab: TabType) => void;

    setThreshold: (val: number) => void;
    setGridSize: (val: GridSize) => void;
    setStyle: (val: MapperStyle) => void;
    setIsRangeEnabled: (val: boolean) => void;
    setStartTime: (val: string) => void;
    setEndTime: (val: string) => void;
    setTimeUnit: (val: TimeUnit) => void;

    setAR: (val: number) => void;
    setCS: (val: number) => void;
    setOD: (val: number) => void;
    setHP: (val: number) => void;

    setBPM: (val: string) => void;
    setOffset: (val: string) => void;
    setIsMetronomeEnabled: (val: boolean) => void;
}

export interface FileStateSetter {
    setFile: (id: string, name: string) => void;
    setIsUploading: (val: boolean) => void;
    setIsExporting: (val: boolean) => void;
    resetFile: () => void;
}

export interface EditorStateSetter {
    setIsGenerating: (val: boolean) => void;
    setIsAnalyzingBPM: (val: boolean) => void;
    setIsAnalyzingOffset: (val: boolean) => void;
    setOnsets: (val: number[] | null) => void;
    setIsPlaying: (val: boolean) => void;
    setCurrentTime: (val: number) => void;
    setDuration: (val: number) => void;
    setHitObjects: (objects: HitObject[]) => void;
    setIsAppBusy: (val: boolean) => void;
}

export interface MetadataStateSetter {
    setTitle: (val: string) => void;
    setArtist: (val: string) => void;
}