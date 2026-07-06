import { Head } from '@inertiajs/react';
import { AlertCircle, Clock3, TicketCheck, Tickets } from 'lucide-react';

type TicketMetric = {
    label: string;
    value: string;
    description: string;
};

type TicketRow = {
    id: string;
    subject: string;
    customer: string;
    priority: string;
    status: string;
    owner: string;
    updatedAt: string;
};

type TicketsPageProps = {
    metrics: TicketMetric[];
    tickets: TicketRow[];
    filters: string[];
};

const icons = [Tickets, Clock3, AlertCircle, TicketCheck];

export default function TicketsPage({
    metrics,
    tickets,
    filters,
}: TicketsPageProps) {
    return (
        <>
            <Head title="Tickets" />

            <div className="dashboardPage">
                <section className="dashboardHero">
                    <div>
                        <p className="dashboardEyebrow">Tickets</p>
                        <h1>My Tickets</h1>
                        <p>
                            Track queues, priorities, and ownership at a glance.
                        </p>
                    </div>
                </section>

                <section className="summaryGrid" aria-label="Ticket metrics">
                    {metrics.map((metric, index) => {
                        const Icon = icons[index] ?? Tickets;

                        return (
                            <article
                                className="dashboardCard dashboardPanel"
                                key={metric.label}
                            >
                                <div className="panelTitleGroup">
                                    <span className="summaryIcon summaryIconBlue">
                                        <Icon size={20} />
                                    </span>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            {metric.label}
                                        </p>
                                        <strong className="mt-1 block text-2xl">
                                            {metric.value}
                                        </strong>
                                        <small className="text-muted-foreground">
                                            {metric.description}
                                        </small>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </section>

                <section className="dashboardCard dashboardPanel">
                    <div className="panelHeader">
                        <h2>Ticket queue</h2>
                        <div className="flex flex-wrap gap-2">
                            {filters.map((filter) => (
                                <button
                                    className="warningBadge"
                                    type="button"
                                    key={filter}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-3">
                        {tickets.map((ticket) => (
                            <article
                                className="rounded-lg border border-border bg-background/40 p-4"
                                key={ticket.id}
                            >
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <strong className="block">
                                            {ticket.id}
                                        </strong>
                                        <p className="mt-1 text-sm">
                                            {ticket.subject}
                                        </p>
                                        <span className="text-sm text-muted-foreground">
                                            {ticket.customer} | {ticket.owner}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 text-sm">
                                        <span className="dangerBadge">
                                            {ticket.priority}
                                        </span>
                                        <span className="countBadge">
                                            {ticket.status}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {ticket.updatedAt}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
