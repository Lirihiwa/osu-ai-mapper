import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FileAddOutlined, SaveOutlined, LoadingOutlined } from "@ant-design/icons";
import { useSettingsStore } from '../../store/useSettingsStore';
import {MapperService} from "../../services/MapperService.ts";

const BUTTON_CLASS = "w-10 h-10 rounded-none hover:bg-accent/20 hover:border hover:border-accent hover:text-accent flex items-center justify-center text-foreground-muted cursor-pointer transition-all border border-transparent";

export const Toolbar = () => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { isUploading, isExporting, filename } = useSettingsStore();

    const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) await MapperService.uploadAudio(file);
    };

    return (
        <div className="flex flex-col gap-4">
            <input type="file" ref={fileInputRef} onChange={onFileChange} accept="audio/*" className="hidden" />

            <div
                className={`${BUTTON_CLASS} ${isUploading ? 'cursor-wait opacity-50' : ''}`}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                title={filename ? filename : t('toolbar.create') }
            >
                {isUploading ? <LoadingOutlined /> : <FileAddOutlined />}
            </div>

            <div
                className={`${BUTTON_CLASS} ${isExporting ? 'opacity-50 cursor-wait' : ''}`}
                onClick={() => !isExporting && MapperService.exportToOSZ()}
                title={t('toolbar.export')}
            >
                {isExporting ? <LoadingOutlined /> : <SaveOutlined />}
            </div>
        </div>
    );
};