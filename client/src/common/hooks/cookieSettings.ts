import { useCallback, useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const COOKIE_OPTIONS = { path: '/', maxAge: 60*60*24*365};

export function useCookieSetting<T extends string | number | boolean>(
    name: string,
    fallback: T
    ): [T, (value: T) => void] {
    const [value, setValue] = useState<T>(() => {
        const raw = cookies.get(name);
        if (raw === undefined) return fallback;

        switch(typeof fallback) {
            case 'boolean':
                return (raw === true || raw === 'true') as T;
            case 'number': {
                const number = Number(raw);
                return (Number.isFinite(number) ? number : fallback) as T;
            }
            default:
                return String(raw) as T;
        }
    });

    const update = useCallback(
        (next: T) => {
            cookies.set(name, next, COOKIE_OPTIONS);
            setValue(next);
        },
        [name]
    );

    return [value, update];
}