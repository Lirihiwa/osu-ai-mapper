import type { StateCreator } from 'zustand';
import type { FullStore } from '../useSettingsStore';

export const createMetadataSlice: StateCreator<FullStore, [["zustand/subscribeWithSelector", never], ["zustand/persist", unknown]], [], any> = (set) => ({
    title: 'New Map',
    artist: 'Unknown Artist',

    setTitle: (title) => set({ title }),
    setArtist: (artist) => set({ artist }),
});