import { mapperApi } from '../api/mapperApi';
import { useSettingsStore } from '../store/useSettingsStore';

export const MapperService = {
    async uploadAudio(file: File) {
        const store = useSettingsStore.getState();
        store.setIsUploading(true);

        try {
            const data = await mapperApi.uploadAudio(file);
            store.setFile(data.file_id, data.filename);

            const rhythmData = await mapperApi.analyzeOnsets(data.file_id, store.threshold);
            store.setOnsets(rhythmData.onsets);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed");
        } finally {
            store.setIsUploading(false);
        }
    },

    async generateMap() {
        const store = useSettingsStore.getState();
        if (!store.onsets || store.onsets.length === 0) {
            alert("Analyze rhythm first");
            return;
        }

        store.setIsGenerating(true);
        try {
            const parseTimeToInt = (val: string) => {
                const num = parseFloat(val) || 0;
                const ms = store.timeUnit === 'sec' ? num * 1000 : num;
                return Math.round(ms);
            };

            const payload: any = {
                onsets: store.onsets,
                bpm: parseFloat(store.bpm) || 120,
                offset: Math.round(parseFloat(store.offset) || 0),
                grid_size: store.gridSize,
                start_time: store.isRangeEnabled ? parseTimeToInt(store.startTime) : 0,
            };

            if (store.isRangeEnabled) {
                payload.end_time = parseTimeToInt(store.endTime);
            }

            const data = await mapperApi.generateObjects(payload);
            store.setHitObjects(data.hit_objects);
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            store.setIsGenerating(false);
        }
    },

    async exportToOSZ() {
        const store = useSettingsStore.getState();
        if (!store.fileId || store.hitObjects.length === 0) {
            alert("Сначала загрузите аудио и сгенерируйте объекты!");
            return;
        }

        store.setIsExporting(true);
        try {
            const payload = {
                file_id: store.fileId,
                original_filename: store.filename,
                bpm: parseFloat(store.bpm) || 120,
                offset: parseInt(store.offset) || 0,
                title: store.title,
                artist: store.artist,
                creator: "AI Studio",
                ar: store.ar, hp: store.hp, od: store.od, cs: store.cs,
                hit_objects: store.hitObjects
            };

            const data = await mapperApi.packageToOSZ(payload);
            const downloadLink = `http://localhost:8000${data.download_url}`;

            const link = document.createElement('a');
            link.href = downloadLink;
            link.setAttribute('download', '');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
            alert("Ошибка при создании .osz пакеation");
        } finally {
            store.setIsExporting(false);
        }
    }
};