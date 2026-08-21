import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { cn } from '@/shared/utils';

export type E164Number = string;

// Remote flag image from CDN (no local flag assets bundled in the project)
const flagUrl = (code: string) => `https://flagcdn.com/${code.toLowerCase()}.svg`;

interface CountryData {
    code: string; // lowercase ISO 3166-1 alpha-2
    name: string;
    dial: string; // e.g. "+20"
}

// Country display names from the browser's built-in Intl API
const regionNames =
    typeof Intl !== 'undefined' && 'DisplayNames' in Intl
        ? new Intl.DisplayNames(['en'], { type: 'region' })
        : null;

// Full list of all countries generated from libphonenumber-js metadata
const countries: CountryData[] = getCountries()
    .map((iso) => ({
        code: iso.toLowerCase(),
        name: regionNames?.of(iso) ?? iso,
        dial: `+${getCountryCallingCode(iso)}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

// Countries pinned to the top of the list for quick access
const PRIORITY = ['eg', 'sa', 'ae', 'us', 'gb'];
const orderedCountries: CountryData[] = [
    ...PRIORITY.map((c) => countries.find((x) => x.code === c)).filter(
        (c): c is CountryData => Boolean(c)
    ),
    ...countries.filter((c) => !PRIORITY.includes(c.code)),
];

interface PhoneInputProps {
    value: E164Number | undefined;
    onChange: (value: E164Number | undefined) => void;
    defaultCountry?: string;
    disabled?: boolean;
    hasError?: boolean;
    placeholder?: string;
    className?: string;
}

export function PhoneInput({
    value,
    onChange,
    defaultCountry = 'eg',
    disabled = false,
    hasError = false,
    placeholder = 'Enter phone number',
    className,
}: PhoneInputProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<CountryData>(
        () =>
            orderedCountries.find((c) => c.code === defaultCountry.toLowerCase()) ??
            orderedCountries[0]
    );
    const [localNumber, setLocalNumber] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Parse initial value (match the longest dial code first for accuracy)
    const initializedRef = useRef(false);
    useEffect(() => {
        if (value && !initializedRef.current) {
            const country = orderedCountries
                .filter((c) => value.startsWith(c.dial))
                .sort((a, b) => b.dial.length - a.dial.length)[0];
            if (country) {
                setSelectedCountry(country);
                setLocalNumber(value.slice(country.dial.length));
                initializedRef.current = true;
            }
        }
    }, [value]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch('');
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleCountrySelect = (country: CountryData) => {
        setSelectedCountry(country);
        setOpen(false);
        setSearch('');
        onChange(localNumber ? `${country.dial}${localNumber}` : undefined);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = e.target.value.replace(/[^0-9]/g, '');
        setLocalNumber(num);
        onChange(num ? `${selectedCountry.dial}${num}` : undefined);
    };

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return orderedCountries;
        return orderedCountries.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.dial.includes(q) ||
                c.code.includes(q)
        );
    }, [search]);

    return (
        <div className={cn('relative', className)} ref={dropdownRef}>
            <div
                className={cn(
                    'flex h-[46px] w-full items-center border-0 bg-gray-50 font-[Geist_Mono] text-[14px]',
                    hasError ? 'ring-1 ring-destructive' : '',
                    'focus-within:ring-2 focus-within:ring-blue-600/20',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
            >
                {/* Country selector */}
                <button
                    type="button"
                    onClick={() => !disabled && setOpen(!open)}
                    disabled={disabled}
                    className="flex items-center gap-2 border-r border-gray-200 px-3 h-full hover:bg-gray-50 transition-colors"
                >
                    <img
                        src={flagUrl(selectedCountry.code)}
                        alt={selectedCountry.name}
                        className="h-[15px] w-[20px] rounded-sm object-cover"
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.style.visibility = 'hidden';
                        }}
                    />
                    <span className="text-[13px] text-gray-600">{selectedCountry.dial}</span>
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                </button>

                {/* Phone number input */}
                <input
                    type="tel"
                    value={localNumber}
                    onChange={handleNumberChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="h-full flex-1 bg-transparent px-3 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                />
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute left-0 top-full z-50 mt-1 w-full max-h-[240px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    {/* Search */}
                    <div className="border-b border-gray-100 p-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search country..."
                            className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-[13px] outline-none placeholder:text-gray-400 focus:border-blue-400"
                            autoFocus
                        />
                    </div>
                    {/* List */}
                    <div className="max-h-[190px] overflow-y-auto">
                        {filtered.map((country) => (
                            <button
                                key={country.code}
                                type="button"
                                onClick={() => handleCountrySelect(country)}
                                className={cn(
                                    'flex w-full items-center gap-3 px-3 py-2 text-left text-[13px] hover:bg-blue-50 transition-colors',
                                    selectedCountry.code === country.code && 'bg-blue-50 font-medium'
                                )}
                            >
                                <img
                                    src={flagUrl(country.code)}
                                    alt={country.name}
                                    className="h-[14px] w-[18px] rounded-sm object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.style.visibility = 'hidden';
                                    }}
                                />
                                <span className="flex-1 text-gray-800">{country.name}</span>
                                <span className="text-gray-500">{country.dial}</span>
                            </button>
                        ))}
                        {filtered.length === 0 && (
                            <p className="px-3 py-4 text-center text-[13px] text-gray-400">No results</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
