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

            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
                <Link
                    className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-300"
                    href={index.url()}
                >
                    <ArrowLeft size={17} />
                    Back to my tickets
                </Link>

                <header className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between dark:border-slate-700 dark:bg-slate-900">
                    <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2 text-sm font-bold text-blue-600">
                            <span>{ticket.reference}</span>
                            <span className="text-slate-300">•</span>
                            <span>{ticket.priority_label} priority</span>
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white">
                            {ticket.title}
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
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
                            triggerClassName="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-3 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                        />
                        <button
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40"
                            onClick={deleteTicket}
                            type="button"
                        >
                            <Trash2 size={17} />
                            Delete
                        </button>
                    </div>
                </header>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                    <main className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <h2 className="text-sm font-extrabold tracking-wide text-slate-900 uppercase dark:text-white">
                            Description
                        </h2>
                        <p className="mt-4 text-sm leading-7 whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                            {ticket.description}
                        </p>
                    </main>

                    <aside className="grid content-start gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
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
                                className="hover:text-blue-600"
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
        <div className="grid grid-cols-[24px_minmax(0,1fr)] gap-2 border-b border-slate-100 py-3 last:border-0 dark:border-slate-800">
            <span className="mt-0.5 text-slate-400">{icon}</span>
            <div>
                <span className="text-xs font-extrabold tracking-wide text-slate-400 uppercase">
                    {label}
                </span>
                <div className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {children}
                </div>
            </div>
        </div>
    );
}
