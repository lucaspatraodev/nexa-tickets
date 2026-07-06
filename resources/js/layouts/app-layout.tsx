import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
    return <AppLayoutTemplate>{children}</AppLayoutTemplate>;
}
