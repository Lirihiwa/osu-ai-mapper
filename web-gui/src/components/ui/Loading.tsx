import {LoadingOutlined} from "@ant-design/icons";
import { useTranslation } from 'react-i18next';

export default function Loading() {
    const { t } = useTranslation();

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center cursor-wait pointer-events-auto">
            <div className="flex flex-col items-center gap-4">
                <LoadingOutlined className="text-accent text-5xl animate-spin"/>
                <span className="text-accent font-bold uppercase tracking-[0.3em] animate-pulse">
                            {t('editor.processing')}
                </span>
            </div>
        </div>
    );
}