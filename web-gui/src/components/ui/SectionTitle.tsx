import { InfoCircleOutlined } from '@ant-design/icons';
import React from 'react';

interface SectionTitleProps {
    label: string;
    tooltipId: string;
    tooltipContent: string;
    children?: React.ReactNode;
}

export const SectionTitle = ({ label, tooltipId, tooltipContent, children }: SectionTitleProps) => (
    <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <span className="font-bold text-foreground text-[10px] uppercase tracking-widest">
                {label}
            </span>
            <InfoCircleOutlined
                data-tooltip-id={tooltipId}
                data-tooltip-content={tooltipContent}
                className="text-foreground-muted hover:text-accent transition-colors cursor-help outline-none text-xs"
            />
        </div>
        {children}
    </div>
);