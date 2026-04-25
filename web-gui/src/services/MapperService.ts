import { mapperApi } from '../api/mapperApi';
import { useSettingsStore } from '../store/useSettingsStore';
import { toast } from 'sonner';

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
            toast.error("Upload error");
        } finally {
            store.setIsUploading(false);
        }
    },

    async generateMap() {
        const store = useSettingsStore.getState();
        if (!store.onsets || store.onsets.length === 0) {
            toast.error("Analyze rhythm first");
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
            toast.error("Error");
        } finally {
            store.setIsGenerating(false);
        }
    },

    async exportToOSZ() {
        const store = useSettingsStore.getState();
        if (!store.fileId || store.hitObjects.length === 0) {
            toast.message("Сначала загрузите аудио и сгенерируйте объекты!");
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
            const downloadLink = `${import.meta.env.VITE_API_URL}${data.download_url}`;

            const link = document.createElement('a');
            link.href = downloadLink;
            link.setAttribute('download', '');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error(`Ошибка при создании .osz пакета`);
            console.error("Ошибка при создании .osz пакета: ", error);
        } finally {
            store.setIsExporting(false);
        }
    }
};