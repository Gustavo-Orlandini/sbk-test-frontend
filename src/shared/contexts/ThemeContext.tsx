import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Theme } from '@mui/material/styles';
import { lightTheme, darkTheme } from '../theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    mode: ThemeMode;
    theme: Theme;
    toggleMode: () => void;
    setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'theme-mode';

interface ThemeProviderProps {
    children: ReactNode;
}

/**
 * Get system preference for color scheme
 */
const getSystemPreference = (): ThemeMode => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    }
    return 'light';
};

/**
 * Theme Context Provider
 * Manages theme state globally and persists user preference
 * Respects system preference if no user preference is saved
 */
export const ThemeContextProvider = ({ children }: ThemeProviderProps) => {
    const [mode, setMode] = useState<ThemeMode>(() => {
        // Get saved preference, system preference, or default to light
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
            const systemPreference = getSystemPreference();

            console.log('[Theme] Initialization:', {
                savedMode,
                systemPreference,
            });

            // If no saved preference, use system preference
            if (!savedMode) {
                console.log('[Theme] No saved preference, using system:', systemPreference);
                return systemPreference;
            }

            // If saved preference matches system preference, use it (user confirmed)
            if (savedMode === systemPreference) {
                console.log('[Theme] Saved preference matches system, using:', savedMode);
                return savedMode;
            }

            // If saved preference doesn't match system, it's likely outdated
            // Clear it and use system preference
            console.log('[Theme] Saved preference does not match system, clearing and using system:', systemPreference);
            localStorage.removeItem(THEME_STORAGE_KEY);
            return systemPreference;
        }
        return 'light';
    });

    const [isUserPreference, setIsUserPreference] = useState(() => {
        // Check if user has manually set a preference
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem(THEME_STORAGE_KEY);
        }
        return false;
    });

    // Sync with system preference on mount if no user preference is set
    useEffect(() => {
        if (typeof window !== 'undefined' && !isUserPreference) {
            const systemPreference = getSystemPreference();
            // Force update to system preference if different
            if (mode !== systemPreference) {
                setMode(systemPreference);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run on mount

    useEffect(() => {
        // Only save to localStorage if user manually changed the theme
        if (typeof window !== 'undefined' && isUserPreference) {
            localStorage.setItem(THEME_STORAGE_KEY, mode);
        } else if (typeof window !== 'undefined' && !isUserPreference) {
            // If not user preference, ensure localStorage is clean
            // This allows system preference to be used
            const saved = localStorage.getItem(THEME_STORAGE_KEY);
            if (saved) {
                console.log('[Theme] Clearing saved preference to use system preference');
                localStorage.removeItem(THEME_STORAGE_KEY);
            }
        }
    }, [mode, isUserPreference]);

    useEffect(() => {
        // Listen for system preference changes (only if user hasn't set a preference)
        if (typeof window !== 'undefined' && window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            const handleChange = (e: MediaQueryListEvent) => {
                // Only update if user hasn't manually set a preference
                if (!isUserPreference) {
                    setMode(e.matches ? 'dark' : 'light');
                }
            };

            // Modern browsers
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleChange);
                return () => mediaQuery.removeEventListener('change', handleChange);
            }
            // Fallback for older browsers
            else if (mediaQuery.addListener) {
                mediaQuery.addListener(handleChange);
                return () => mediaQuery.removeListener(handleChange);
            }
        }
    }, [isUserPreference]);

    const theme: Theme = useMemo(() => {
        return mode === 'light' ? lightTheme : darkTheme;
    }, [mode]);

    const toggleMode = () => {
        setIsUserPreference(true); // Mark as user preference when toggled
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const setModeWithPreference = (newMode: ThemeMode) => {
        setIsUserPreference(true); // Mark as user preference when set manually
        setMode(newMode);
    };

    const value = useMemo(
        () => ({
            mode,
            theme,
            toggleMode,
            setMode: setModeWithPreference,
        }),
        [mode, theme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Hook to use theme context
 * Must be used within ThemeContextProvider
 */
export const useThemeMode = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeMode must be used within a ThemeContextProvider');
    }
    return context;
};
