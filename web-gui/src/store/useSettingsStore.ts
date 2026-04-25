import { create } from 'zustand';
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware';
import type {
    SettingsState, SettingsStateSetter,
    FileState, FileStateSetter,
    EditorState, EditorStateSetter,
    MetadataState, MetadataStateSetter,
} from '../components/settings/types';

import { createSettingsSlice } from './slices/createSettingsSlice';
import { createFileSlice } from './slices/createFileSlice';
import { createEditorSlice } from './slices/createEditorSlice';
import { createMetadataSlice } from './slices/createMetadataSlice';

export interface FullStore extends
    SettingsState, SettingsStateSetter,
    FileState, FileStateSetter,
    EditorState, EditorStateSetter,
    MetadataState, MetadataStateSetter {}

export const useSettingsStore = create<FullStore>()(
    subscribeWithSelector(
        persist(
            (...a) => ({
                ...createSettingsSlice(...a),
                ...createFileSlice(...a),
                ...createEditorSlice(...a),
                ...createMetadataSlice(...a),
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
                    title: state.title,
                    artist: state.artist,

                    onsets: state.onsets,
                    hitObjects: state.hitObjects,

                    currentTime: Math.floor(state.currentTime / 100) * 100,
                }),
            }
        )
    )
);