import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { SectionTitle } from '../../ui/SectionTitle';
import { Tooltip } from 'react-tooltip';
import {SearchOutlined, CustomerServiceOutlined, LoadingOutlined} from '@ant-design/icons';
import {mapperApi} from "../../../api/mapperApi.ts";
import {toast} from "sonner";
import {NumberInput} from "../../ui/NumberInput.tsx";

export const TimingTab = () => {
    const { t } = useTranslation();

    const {
        fileId, bpm, setBPM, offset, setOffset,
        threshold, onsets, setOnsets,
        isMetronomeEnabled, setIsMetronomeEnabled,
        isAnalyzingBPM, setIsAnalyzingBPM,
        isAnalyzingOffset, setIsAnalyzingOffset
    } = useSettingsStore();

    const handleDetectBPM = async () => {
        if (!fileId) return toast.error("Сначала загрузите аудио файл");

        setIsAnalyzingBPM(true);
        try {
            const data = await mapperApi.analyzeBPM(fileId);
            const detectedBpm = data.estimated_bpm.mean.toString();
            setBPM(detectedBpm);
        } catch (error) {
            console.error(error);
            toast.error("Ошибка анализа BPM");
        } finally {
            setIsAnalyzingBPM(false);
        }
    };

    const handleDetectOffset = async () => {
        if (!fileId) return toast.error("Upload file first");

        setIsAnalyzingOffset(true);
        try {
            let currentOnsets = onsets;

            if (!currentOnsets) {
                console.log("Onsets cache empty. Running AI analysis...");
                const rhythmData = await mapperApi.analyzeOnsets(fileId, threshold);
                currentOnsets = rhythmData.onsets;
                setOnsets(currentOnsets);
            } else {
                console.log("Using cached onsets data");
            }

            const offsetData = await mapperApi.analyzeOffset(currentOnsets);
            setOffset(offsetData.offset.toString());

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsAnalyzingOffset(false);
        }
    };

    return (
        <div className="flex flex-col gap-10">

            <div className="flex flex-col gap-4">
                <SectionTitle label={t('settings.timing.bpm')} tooltipId="bpm-tip" tooltipContent={t('settings.timing.bpm_tip')} />
                <div className="flex gap-2">
                    <NumberInput
                        value={bpm}
                        onChange={setBPM}
                        className="flex-1"
                    />
                    <button
                        onClick={handleDetectBPM}
                        disabled={isAnalyzingBPM || !fileId}
                        className="px-3 bg-studio border border-border hover:border-accent text-foreground-muted hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAnalyzingBPM ? <LoadingOutlined /> : <SearchOutlined />}
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <SectionTitle label={t('settings.timing.offset')} tooltipId="offset-tip" tooltipContent={t('settings.timing.offset_tip')} />
                <div className="flex gap-2">
                    <input
                        type="text" value={offset}
                        onChange={(e) => setOffset(e.target.value.replace(/[^0-9-]/g, ''))}
                        className="flex-1 bg-studio border border-border p-2 text-sm font-mono text-accent outline-none focus:border-accent"
                    />
                    <button
                        onClick={handleDetectOffset}
                        disabled={isAnalyzingOffset || !fileId}
                        className="px-3 bg-studio border border-border hover:border-accent text-foreground-muted hover:text-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAnalyzingOffset ? <LoadingOutlined /> : <SearchOutlined />}
                    </button>
                </div>
            </div>

            <div className="pt-6 border-t border-border">
                <div
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => setIsMetronomeEnabled(!isMetronomeEnabled)}
                >
                    <div className="flex items-center gap-3">
                        <CustomerServiceOutlined className={isMetronomeEnabled ? 'text-accent' : 'text-foreground-muted'} />
                        <span className={`text-[10px] uppercase font-bold tracking-widest transition-colors ${isMetronomeEnabled ? 'text-foreground' : 'text-foreground-muted'}`}>
                            {t('settings.timing.metronome')}
                        </span>
                    </div>

                    <div className={`w-10 h-5 flex items-center p-1 transition-colors ${isMetronomeEnabled ? 'bg-accent' : 'bg-studio border border-border'}`}>
                        <div className={`w-3 h-3 transition-transform ${isMetronomeEnabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-foreground-muted'}`} />
                    </div>
                </div>
            </div>

            <Tooltip id="bpm-tip" place="left" className="z-50 !bg-studio !border !border-border !text-foreground-muted !rounded-none !px-3 !py-2 !text-xs !max-w-[200px]" />
            <Tooltip id="offset-tip" place="left" className="z-50 !bg-studio !border !border-border !text-foreground-muted !rounded-none !px-3 !py-2 !text-xs !max-w-[200px]" />
        </div>
    );
};