import React, { memo } from 'react';

interface NumberInputProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    allowNegative?: boolean;
}

export const NumberInput = memo(({
                                     value,
                                     onChange,
                                     placeholder,
                                     disabled = false,
                                     className = "",
                                     allowNegative = true
                                 }: NumberInputProps) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;

        const regex = allowNegative ? /[^0-9.-]/g : /[^0-9.]/g;
        val = val.replace(regex, '');

        const parts = val.split('.');
        if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');

        onChange(val);
    };

    return (
        <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`
                bg-studio border border-border p-2 text-sm font-mono text-accent 
                outline-none focus:border-accent disabled:opacity-40 
                disabled:cursor-not-allowed transition-colors ${className}
            `}
        />
    );
});