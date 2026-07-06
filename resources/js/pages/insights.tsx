import { Head } from '@inertiajs/react';
import { BarChart3, Gauge, TrendingUp } from 'lucide-react';

type InsightMetric = {
    label: string;
    value: string;
    delta: string;
};

type InsightTrend = {
    label: string;
    value: string;
};

type InsightsPageProps = {
    metrics: InsightMetric[];
    trends: InsightTrend[];
};

const icons = [TrendingUp, Gauge, BarChart3];

export default function InsightsPage({ metrics, trends }: InsightsPageProps) {
    return (
        <>
            <Head title="Insights" />

            <div className="dashboardPage">
                <section className="dashboardHero">
                    <div>
                        <p className="dashboardEyebrow">Insights</p>
                        <h1>Support Insights</h1>
                        <p>
                            Monitor team performance and ticket health trends.
                        </p>
                    </div>
                </section>

                <section className="summaryGrid" aria-label="Insight metrics">
                    {metrics.map((metric, index) => {
                        const Icon = icons[index] ?? BarChart3;

                        return (
                            <article
                                className="dashboardCard summaryCard"
                                key={metric.label}
                            >
                                <div className="summaryIcon summaryIconBlue">
                                    <Icon size={22} />
                                </div>
                                <div>
                                    <span>{metric.label}</span>
                                    <strong>{metric.value}</strong>
                                    <small>{metric.delta}</small>
                                </div>
                            </article>
                        );
                    })}
                </section>

                <section className="dashboardCard dashboardPanel">
                    <div className="panelHeader">
                        <h2>Operational trends</h2>
                    </div>

                    <div className="performanceStats">
                        {trends.map((trend) => (
                            <div key={trend.label}>
                                <span>{trend.label}</span>
                                <strong>{trend.value}</strong>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
