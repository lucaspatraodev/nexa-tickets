import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarClock,
    Clock3,
    Mail,
    Tag,
    Trash2,
    Users,
} from 'lucide-react';
import type { ReactNode } from 'react';

import TicketFormModal from '@/components/create-ticket-modal';
import { destroy, index } from '@/routes/tickets';
import type { Ticket, TicketSelectOption } from '@/types';

type TicketShowPageProps = {
    ticket: Ticket;
    categories?: TicketSelectOption[];
    groups?: TicketSelectOption[];
    assignees?: TicketSelectOption[];
};

export default function TicketShowPage({
    ticket,
    categories = [],
    groups = [],
    assignees = [],
}: TicketShowPageProps) {
    function deleteTicket() {
        if (
            !window.confirm(
                `Delete ${ticket.reference}? This action cannot be undone.`,
            )
        ) {
            return;
        }

        router.delete(destroy.url(ticket.id));
    }

    return (
        <>
            <Head title={ticket.reference} />

            <div className="ticketDetailsPage flex w-full flex-col gap-6">
                <Link
                    className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
                    href={index.url()}
                >
                    <ArrowLeft size={17} />
                    Back to my tickets
                </Link>

                <header className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm font-bold text-primary">
                            <span>{ticket.reference}</span>
                            <span className="text-muted-foreground">•</span>
                            <span>{ticket.priority_label} priority</span>
                        </div>
                        <h1 className="text-2xl font-extrabold text-foreground">
                            {ticket.title}
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Requested by {ticket.requester.name} · Updated{' '}
                            {ticket.updated_at_human}
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <TicketFormModal
                            assignees={assignees}
                            categories={categories}
                            groups={groups}
                            ticket={ticket}
                            triggerClassName="inline-flex h-10 items-center justify-center rounded-lg border border-border px-3 text-foreground hover:bg-accent"
                        />
                        <button
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-destructive/40 px-3 text-sm font-bold text-destructive hover:bg-destructive/10"
                            onClick={deleteTicket}
                            type="button"
                        >
                            <Trash2 size={17} />
                            Delete
                        </button>
                    </div>
                </header>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <main className="rounded-xl border border-border bg-card p-6">
                        <h2 className="text-sm font-extrabold tracking-wide text-foreground uppercase">
                            Description
                        </h2>
                        <p className="mt-4 text-sm leading-7 whitespace-pre-wrap text-foreground">
                            {ticket.description}
                        </p>
                    </main>

                    <aside className="grid content-start gap-3 rounded-xl border border-border bg-card p-5">
                        <Detail icon={<Clock3 size={17} />} label="Status">
                            {ticket.status_label}
                        </Detail>
                        <Detail
                            icon={<Tag size={17} />}
                            label="Type / Category"
                        >
                            {ticket.type_label} · {ticket.category.name}
                        </Detail>
                        <Detail
                            icon={<Users size={17} />}
                            label="Group / Owners"
                        >
                            {ticket.group.name}
                            <br />
                            {ticket.assignees.length > 0
                                ? ticket.assignees
                                      .map((assignee) => assignee.name)
                                      .join(', ')
                                : 'Unassigned'}
                        </Detail>
                        <Detail
                            icon={<CalendarClock size={17} />}
                            label="SLA deadline"
                        >
                            {ticket.due_at_label ?? 'No deadline'}
                        </Detail>
                        <Detail icon={<Mail size={17} />} label="Requester">
                            <a
                                className="hover:text-primary"
                                href={`mailto:${ticket.requester.email}`}
                            >
                                {ticket.requester.email}
                            </a>
                        </Detail>
                    </aside>
                </div>
            </div>
        </>
    );
}

function Detail({
    icon,
    label,
    children,
}: {
    icon: ReactNode;
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="grid grid-cols-[24px_minmax(0,1fr)] gap-2 border-b border-border py-3 last:border-0">
            <span className="mt-0.5 text-muted-foreground">{icon}</span>
            <div>
                <span className="text-xs font-extrabold tracking-wide text-muted-foreground uppercase">
                    {label}
                </span>
                <div className="mt-1 text-sm font-semibold text-foreground">
                    {children}
                </div>
            </div>
        </div>
    );
}
