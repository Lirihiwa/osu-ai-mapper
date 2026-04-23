import { create } from 'zustand';
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware';
import type { TabType, GridSize, MapperStyle, TimeUnit, SettingsState } from '../components/settings/types';

export interface HitObject {
    x: number;
    y: number;
    time: number;
    new_combo: boolean;
}

interface FullStore extends SettingsState {
    fileId: string | null;
    filename: string | null;
    isUploading: boolean;
    isAnalyzingBPM: boolean;
    isAnalyzingOffset: boolean;
    onsets: number[] | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    hitObjects: HitObject[];

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
    setFile: (id: string, name: string) => void;
    setIsUploading: (val: boolean) => void;
    resetFile: () => void;
    setIsAnalyzingBPM: (val: boolean) => void;
    setIsAnalyzingOffset: (val: boolean) => void;
    setOnsets: (val: number[] | null) => void;
    setIsPlaying: (val: boolean) => void;
    setCurrentTime: (val: number) => void;
    setDuration: (val: number) => void;
    setHitObjects: (objects: HitObject[]) => void;
}

export const useSettingsStore = create<FullStore>()(
    subscribeWithSelector(
        persist(
            (set) => ({
                // Defaults
                activeTab: 'ai',
                threshold: 0.3,
                gridSize: 4,
                style: 'balanced',
                isRangeEnabled: false,
                startTime: '0',
                endTime: '1000',
                timeUnit: 'ms',
                ar: 9,
                cs: 4,
                od: 8,
                hp: 5,
                bpm: '120',
                offset: '0',
                isMetronomeEnabled: false,
                fileId: null,
                filename: null,
                isUploading: false,
                isAnalyzingBPM: false,
                isAnalyzingOffset: false,
                onsets: null,
                isPlaying: false,
                currentTime: 0,
                duration: 0,
                hitObjects: [],

                // Actions
                setActiveTab: (activeTab) => set({ activeTab }),
                setThreshold: (threshold) => set({ threshold, onsets: null }),
                setGridSize: (gridSize) => set({ gridSize }),
                setStyle: (style) => set({ style }),
                setIsRangeEnabled: (isRangeEnabled) => set({ isRangeEnabled }),
                setStartTime: (startTime) => set({ startTime }),
                setEndTime: (endTime) => set({ endTime }),
                setTimeUnit: (timeUnit) => set({ timeUnit }),
                setAR: (ar) => set({ ar }),
                setCS: (cs) => set({ cs }),
                setOD: (od) => set({ od }),
                setHP: (hp) => set({ hp }),
                setBPM: (bpm) => set({ bpm }),
                setOffset: (offset) => set({ offset }),
                setIsMetronomeEnabled: (isMetronomeEnabled) => set({ isMetronomeEnabled }),
                setFile: (fileId, filename) => set({
                    fileId, filename, isUploading: false, onsets: null,
                    currentTime: 0, isPlaying: false
                }),
                setIsUploading: (isUploading) => set({ isUploading }),
                resetFile: () => set({ fileId: null, filename: null }),
                setIsAnalyzingBPM: (val) => set({ isAnalyzingBPM: val }),
                setIsAnalyzingOffset: (val) => set({ isAnalyzingOffset: val }),
                setOnsets: (onsets) => set({ onsets }),
                setIsPlaying: (isPlaying) => set({ isPlaying }),
                setCurrentTime: (currentTime) => set({ currentTime }),
                setDuration: (duration) => set({ duration }),
                setHitObjects: (objects) => set({ hitObjects: objects }),
            }),
            {
                name: 'osu-ai-mapper-storage',
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({
                    activeTab: state.activeTab,
                    threshold: state.threshold,
                    gridSize: state.gridSize,
                    style: state.style,
                    isRangeEnabled: state.isRangeEnabled,
                    startTime: state.startTime,
                    endTime: state.endTime,
                    timeUnit: state.timeUnit,
                    ar: state.ar,
                    cs: state.cs,
                    od: state.od,
                    hp: state.hp,
                    bpm: state.bpm,
                    offset: state.offset,
                    isMetronomeEnabled: state.isMetronomeEnabled,
                    fileId: state.fileId,
                    filename: state.filename,
                }),
            }
        )
    )
);