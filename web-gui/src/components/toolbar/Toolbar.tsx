import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FileAddOutlined, SaveOutlined, LoadingOutlined } from "@ant-design/icons";
import { useSettingsStore } from '../../store/useSettingsStore';
import {mapperApi} from "../../api/mapperApi.ts";

const BUTTON_CLASS = "w-10 h-10 rounded-none hover:bg-accent/20 hover:border hover:border-accent hover:text-accent flex items-center justify-center text-foreground-muted cursor-pointer transition-all border border-transparent";

export const Toolbar = () => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { isUploading, setIsUploading, setFile, filename } = useSettingsStore();

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const data = await mapperApi.uploadAudio(file);
            setFile(data.file_id, data.filename);

            const rhythmData = await mapperApi.analyzeOnsets(data.file_id, 0.3);
            useSettingsStore.getState().setOnsets(rhythmData.onsets);

        } catch (error) {
            alert("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                accept="audio/*"
                className="hidden"
            />

            <div
                className={`${BUTTON_CLASS} ${isUploading ? 'cursor-wait opacity-50' : ''}`}
                title={filename ? `${t("toolbar.create")} (${filename})` : t("toolbar.create")}
                onClick={!isUploading ? handleUploadClick : undefined}
            >
                {isUploading ? <LoadingOutlined /> : <FileAddOutlined />}
            </div>

            <div className={BUTTON_CLASS} title={t("toolbar.export")}>
                <SaveOutlined />
            </div>
        </div>
    );
};