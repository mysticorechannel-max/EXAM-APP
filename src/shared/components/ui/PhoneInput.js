import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { cn } from '@/shared/utils';
// Remote flag image from CDN (no local flag assets bundled in the project)
const flagUrl = (code) => `https://flagcdn.com/${code.toLowerCase()}.svg`;
// Country display names from the browser's built-in Intl API
const regionNames = typeof Intl !== 'undefined' && 'DisplayNames' in Intl
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null;
// Full list of all countries generated from libphonenumber-js metadata
const countries = getCountries()
    .map((iso) => ({
    code: iso.toLowerCase(),
    name: regionNames?.of(iso) ?? iso,
    dial: `+${getCountryCallingCode(iso)}`,
}))
    .sort((a, b) => a.name.localeCompare(b.name));
// Countries pinned to the top of the list for quick access
const PRIORITY = ['eg', 'sa', 'ae', 'us', 'gb'];
const orderedCountries = [
    ...PRIORITY.map((c) => countries.find((x) => x.code === c)).filter((c) => Boolean(c)),
    ...countries.filter((c) => !PRIORITY.includes(c.code)),
];
export function PhoneInput({ value, onChange, defaultCountry = 'eg', disabled = false, hasError = false, placeholder = 'Enter phone number', className, }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(() => orderedCountries.find((c) => c.code === defaultCountry.toLowerCase()) ??
        orderedCountries[0]);
    const [localNumber, setLocalNumber] = useState('');
    const dropdownRef = useRef(null);
    // Parse initial value (match the longest dial code first for accuracy)
    useEffect(() => {
        if (value) {
            const country = orderedCountries
                .filter((c) => value.startsWith(c.dial))
                .sort((a, b) => b.dial.length - a.dial.length)[0];
            if (country) {
                setSelectedCountry(country);
                setLocalNumber(value.slice(country.dial.length));
            }
        }
    }, []);
    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
                setSearch('');
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);
    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setOpen(false);
        setSearch('');
        onChange(localNumber ? `${country.dial}${localNumber}` : undefined);
    };
    const handleNumberChange = (e) => {
        const num = e.target.value.replace(/[^0-9]/g, '');
        setLocalNumber(num);
        onChange(num ? `${selectedCountry.dial}${num}` : undefined);
    };
    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q)
            return orderedCountries;
        return orderedCountries.filter((c) => c.name.toLowerCase().includes(q) ||
            c.dial.includes(q) ||
            c.code.includes(q));
    }, [search]);
    return (_jsxs("div", { className: cn('relative', className), ref: dropdownRef, children: [_jsxs("div", { className: cn('flex h-[46px] w-full items-center rounded-lg border bg-background font-[Geist_Mono] text-[14px]', hasError ? 'border-destructive' : 'border-gray-200', 'focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600', disabled && 'opacity-50 cursor-not-allowed'), children: [_jsxs("button", { type: "button", onClick: () => !disabled && setOpen(!open), disabled: disabled, className: "flex items-center gap-2 border-r border-gray-200 px-3 h-full hover:bg-gray-50 rounded-l-lg transition-colors", children: [_jsx("img", { src: flagUrl(selectedCountry.code), alt: selectedCountry.name, className: "h-[15px] w-[20px] rounded-sm object-cover", loading: "lazy", onError: (e) => {
                                    e.currentTarget.style.visibility = 'hidden';
                                } }), _jsx("span", { className: "text-[13px] text-gray-600", children: selectedCountry.dial }), _jsx(ChevronDown, { className: "h-3 w-3 text-gray-400" })] }), _jsx("input", { type: "tel", value: localNumber, onChange: handleNumberChange, placeholder: placeholder, disabled: disabled, className: "h-full flex-1 bg-transparent px-3 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed" })] }), open && (_jsxs("div", { className: "absolute left-0 top-full z-50 mt-1 w-full max-h-[240px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg", children: [_jsx("div", { className: "border-b border-gray-100 p-2", children: _jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search country...", className: "w-full rounded-md border border-gray-200 px-3 py-1.5 text-[13px] outline-none placeholder:text-gray-400 focus:border-blue-400", autoFocus: true }) }), _jsxs("div", { className: "max-h-[190px] overflow-y-auto", children: [filtered.map((country) => (_jsxs("button", { type: "button", onClick: () => handleCountrySelect(country), className: cn('flex w-full items-center gap-3 px-3 py-2 text-left text-[13px] hover:bg-blue-50 transition-colors', selectedCountry.code === country.code && 'bg-blue-50 font-medium'), children: [_jsx("img", { src: flagUrl(country.code), alt: country.name, className: "h-[14px] w-[18px] rounded-sm object-cover", loading: "lazy", onError: (e) => {
                                            e.currentTarget.style.visibility = 'hidden';
                                        } }), _jsx("span", { className: "flex-1 text-gray-800", children: country.name }), _jsx("span", { className: "text-gray-500", children: country.dial })] }, country.code))), filtered.length === 0 && (_jsx("p", { className: "px-3 py-4 text-center text-[13px] text-gray-400", children: "No results" }))] })] }))] }));
}
