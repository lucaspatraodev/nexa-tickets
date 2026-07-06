import { Head, Link } from '@inertiajs/react';
import { Bell, ShieldCheck, SlidersHorizontal, UserCog } from 'lucide-react';

type SettingsSection = {
    title: string;
    description: string;
    href: string;
};

type SettingsPageProps = {
    sections: SettingsSection[];
};

const icons = [UserCog, ShieldCheck, SlidersHorizontal, Bell];

export default function SettingsPage({ sections }: SettingsPageProps) {
    return (
        <>
            <Head title="Settings" />

            <div className="dashboardPage">
                <section className="dashboardHero">
                    <div>
                        <p className="dashboardEyebrow">Settings</p>
                        <h1>Workspace Settings</h1>
                        <p>
                            Manage account, security, appearance, and
                            preferences.
                        </p>
                    </div>
                </section>

                <section className="dashboardGrid">
                    {sections.map((section, index) => {
                        const Icon = icons[index] ?? SlidersHorizontal;

                        return (
                            <Link
                                className="dashboardCard dashboardPanel block transition-colors hover:border-primary"
                                href={section.href}
                                key={section.title}
                            >
                                <div className="panelTitleGroup">
                                    <span className="summaryIcon summaryIconBlue">
                                        <Icon size={20} />
                                    </span>
                                    <div>
                                        <h2 className="text-base font-bold">
                                            {section.title}
                                        </h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {section.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </section>
            </div>
        </>
    );
}
