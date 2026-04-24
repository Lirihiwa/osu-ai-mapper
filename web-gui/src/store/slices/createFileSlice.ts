import type { StateCreator } from 'zustand';
import type { FullStore } from '../useSettingsStore';

export const createFileSlice: StateCreator<FullStore, [["zustand/subscribeWithSelector", never], ["zustand/persist", unknown]], [], any> = (set) => ({
    fileId: null,
    filename: null,
    isUploading: false,
    isExporting: false,

    setFile: (fileId, filename) => set({
        fileId, filename, isUploading: false, onsets: null,
        currentTime: 0, isPlaying: false
    }),
    setIsUploading: (isUploading) => set({ isUploading }),
    setIsExporting: (isExporting) => set({ isExporting }),
    resetFile: () => set({ fileId: null, filename: null, onsets: null, hitObjects: [] }),
});