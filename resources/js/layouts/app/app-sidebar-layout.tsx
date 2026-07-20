import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Bell,
    CalendarDays,
    ChevronDown,
    LayoutDashboard,
    Menu,
    MessageCircle,
    Moon,
    Search,
    Settings,
    Sparkles,
    Sun,
    Ticket,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import type { AppLayoutProps } from '@/types';

const navigationItems = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'My Tickets',
        href: '/tickets',
        icon: Ticket,
    },
    {
        title: 'Insights',
        href: '/insights',
        icon: BarChart3,
    },
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
    },
] as const;

export default function AppSidebarLayout({ children }: AppLayoutProps) {
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const page = usePage();
    const isDark = resolvedAppearance === 'dark';
    const currentPath = page.url.split('?')[0];
    const isCurrentPath = (href: string) =>
        href === '/dashboard'
            ? currentPath === href
            : currentPath.startsWith(href);

    useEffect(() => {
        setSidebarOpen(false);
    }, [currentPath]);

    useEffect(() => {
        if (!sidebarOpen) {
            return;
        }

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('keydown', closeOnEscape);

        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [sidebarOpen]);

    return (
        <div className="nexaShell">
            <aside
                className={cn('nexaSidebar', {
                    nexaSidebarOpen: sidebarOpen,
                })}
                id="nexa-sidebar"
            >
                <div className="sidebarBrand">
                    <div className="sidebarLogo">N</div>
                    <span>Nexa Tickets</span>
                </div>

                <nav className="sidebarNav" aria-label="Main navigation">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                className={cn('sidebarItem', {
                                    sidebarItemActive: isCurrentPath(item.href),
                                })}
                                href={item.href}
                                key={item.href}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <Icon size={18} />
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="sidebarBottom">
                    <div className="sidebarUserCard">
                        <div className="userAvatar">L</div>
                        <div>
                            <p>Lucas</p>
                            <span>Support Lead</span>
                        </div>
                        <ChevronDown size={16} />
                    </div>
                </div>
            </aside>

            {sidebarOpen ? (
                <button
                    className="nexaSidebarBackdrop"
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setSidebarOpen(false)}
                />
            ) : null}

            <div className="nexaMain">
                <header className="nexaTopbar">
                    <button
                        className="topbarIconButton mobileMenuButton"
                        type="button"
                        aria-label="Open menu"
                        aria-controls="nexa-sidebar"
                        aria-expanded={sidebarOpen}
                        onClick={() => setSidebarOpen((isOpen) => !isOpen)}
                    >
                        <Menu size={20} />
                    </button>

                    <div className="topbarSearch">
                        <Search size={18} />
                        <input
                            type="search"
                            placeholder="Search tickets, customers, IDs..."
                            aria-label="Search tickets"
                        />
                    </div>

                    <div className="topbarActions">
                        <button
                            className="topbarIconButton themeToggleButton"
                            type="button"
                            onClick={() =>
                                updateAppearance(isDark ? 'light' : 'dark')
                            }
                            aria-label={
                                isDark ? 'Use light theme' : 'Use dark theme'
                            }
                            title={
                                isDark ? 'Use light theme' : 'Use dark theme'
                            }
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button
                            className="topbarIconButton"
                            type="button"
                            aria-label="Notifications"
                        >
                            <Bell size={18} />
                            <span className="notificationDot">3</span>
                        </button>
                        <button
                            className="topbarIconButton topbarDesktopOnly"
                            type="button"
                            aria-label="Messages"
                        >
                            <MessageCircle size={18} />
                        </button>
                        <button
                            className="topbarAiButton"
                            type="button"
                            aria-label="Ask Nexa"
                        >
                            <Sparkles size={16} />
                            <span>Ask Nexa</span>
                        </button>
                        <button
                            className="topbarDateButton topbarDesktopOnly"
                            type="button"
                        >
                            <CalendarDays size={16} />
                            <span>Today</span>
                        </button>
                        <div className="topbarAvatar">L</div>
                    </div>
                </header>

                <main className="nexaContent">{children}</main>
            </div>
        </div>
    );
}
