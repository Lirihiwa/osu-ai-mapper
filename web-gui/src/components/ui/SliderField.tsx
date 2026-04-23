import { memo } from 'react';
import { Tooltip } from 'react-tooltip';
import { SectionTitle } from './SectionTitle';

interface SliderFieldProps {
    label: string;
    value: number;
    onChange: (val: number) => void;
    tipId: string;
    tipContent: string;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
}

export const SliderField = memo(({
                                     label, value, onChange, tipId, tipContent,
                                     min = 0, max = 10, step = 0.1, precision = 1
                                 }: SliderFieldProps) => {
    return (
        <div className="flex flex-col text-foreground">
            <SectionTitle
                label={label}
                tooltipId={tipId}
                tooltipContent={tipContent}
            />

            <div className="flex items-center gap-4">
                <input
                    type="range" min={min} max={max} step={step}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-studio appearance-none cursor-pointer accent-accent outline-none"
                />
                <span className="font-mono text-accent font-bold w-10 text-right text-sm">
                    {value.toFixed(precision).replace('.', ',')}
                </span>
            </div>

            <Tooltip
                id={tipId}
                place="left"
                className="z-50 !bg-studio !border !border-border !text-foreground-muted !rounded-none !px-3 !py-2 !text-xs !max-w-[200px] !shadow-2xl"
            />
        </div>
    );
});