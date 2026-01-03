import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

type Theme = 'light' | 'dark';

function getStoredTheme(): Theme {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) return stored;

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>(getStoredTheme);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="relative overflow-hidden"
                    >
                        <Sun
                            className={`h-5 w-5 transition-all duration-300 ${theme === 'dark'
                                    ? 'rotate-90 scale-0 opacity-0'
                                    : 'rotate-0 scale-100 opacity-100'
                                }`}
                        />
                        <Moon
                            className={`absolute h-5 w-5 transition-all duration-300 ${theme === 'dark'
                                    ? 'rotate-0 scale-100 opacity-100'
                                    : '-rotate-90 scale-0 opacity-0'
                                }`}
                        />
                        <span className="sr-only">切换主题</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
