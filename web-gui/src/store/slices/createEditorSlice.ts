import type { StateCreator } from 'zustand';
import type { FullStore } from '../useSettingsStore';

export const createEditorSlice: StateCreator<FullStore, [["zustand/subscribeWithSelector", never], ["zustand/persist", unknown]], [], any> = (set) => ({
    isGenerating: false,
    isAnalyzingBPM: false,
    isAnalyzingOffset: false,
    onsets: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    hitObjects: [],

    setIsGenerating: (val) => set({ isGenerating: val }),
    setIsAnalyzingBPM: (val) => set({ isAnalyzingBPM: val }),
    setIsAnalyzingOffset: (val) => set({ isAnalyzingOffset: val }),
    setOnsets: (onsets) => set({ onsets }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setCurrentTime: (currentTime) => set({ currentTime }),
    setDuration: (duration) => set({ duration }),
    setHitObjects: (hitObjects) => set({ hitObjects }),
});