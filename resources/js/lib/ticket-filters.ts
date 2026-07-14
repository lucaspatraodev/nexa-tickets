import type {
    Ticket,
    TicketFilters,
    TicketMetric,
    TicketPriority,
} from '@/types';

const priorityOrder: Record<TicketPriority, number> = {
    critical: 1,
    high: 2,
    medium: 3,
    low: 4,
};

function timestamp(value: string | null): number {
    if (value === null) {
        return 0;
    }

    const parsed = Date.parse(value);

    return Number.isNaN(parsed) ? 0 : parsed;
}

function isOpen(ticket: Ticket): boolean {
    return ticket.status !== 'resolved' && ticket.status !== 'closed';
}

function isSameDay(value: string | null, date: Date): boolean {
    if (value === null) {
        return false;
    }

    const candidate = new Date(value);

    return (
        candidate.getFullYear() === date.getFullYear() &&
        candidate.getMonth() === date.getMonth() &&
        candidate.getDate() === date.getDate()
    );
}

function matchesSearch(ticket: Ticket, search: string): boolean {
    if (search === '') {
        return true;
    }

    const searchableValues = [
        ticket.reference,
        ticket.title,
        ticket.description,
        ticket.requester.name,
        ticket.requester.email,
        ticket.category.name,
        ticket.group.name,
        ticket.type_label,
        ticket.status_label,
        ...ticket.assignees.flatMap((assignee) => [
            assignee.name,
            assignee.email,
        ]),
    ];

    return searchableValues.some((value) =>
        value.toLowerCase().includes(search),
    );
}

function matchesSla(
    ticket: Ticket,
    sla: TicketFilters['sla'],
    now: Date,
): boolean {
    if (sla === 'all') {
        return true;
    }

    if (sla === 'none') {
        return ticket.due_at === null;
    }

    if (!isOpen(ticket) || ticket.due_at === null) {
        return false;
    }

    const dueAt = timestamp(ticket.due_at);

    return {
        breached: dueAt < now.getTime(),
        due_today: isSameDay(ticket.due_at, now),
        on_track: dueAt >= now.getTime(),
    }[sla];
}

function compareUpdatedNewest(left: Ticket, right: Ticket): number {
    return (
        timestamp(right.updated_at) - timestamp(left.updated_at) ||
        right.id - left.id
    );
}

function sortTickets(tickets: Ticket[], sort: TicketFilters['sort']): Ticket[] {
    return tickets.sort((left, right) => {
        switch (sort) {
            case 'updated_asc':
                return (
                    timestamp(left.updated_at) - timestamp(right.updated_at) ||
                    left.id - right.id
                );
            case 'created_desc':
                return (
                    timestamp(right.created_at) - timestamp(left.created_at) ||
                    right.id - left.id
                );
            case 'priority_desc':
                return (
                    priorityOrder[left.priority] -
                        priorityOrder[right.priority] ||
                    compareUpdatedNewest(left, right)
                );
            case 'due_asc': {
                const leftDueAt = left.due_at
                    ? timestamp(left.due_at)
                    : Number.POSITIVE_INFINITY;
                const rightDueAt = right.due_at
                    ? timestamp(right.due_at)
                    : Number.POSITIVE_INFINITY;

                return (
                    leftDueAt - rightDueAt || compareUpdatedNewest(left, right)
                );
            }
            default:
                return compareUpdatedNewest(left, right);
        }
    });
}

export function filterAndSortTickets(
    tickets: Ticket[],
    filters: TicketFilters,
    now = new Date(),
): Ticket[] {
    const search = filters.search.trim().toLowerCase();
    const filteredTickets = tickets.filter(
        (ticket) =>
            matchesSearch(ticket, search) &&
            (filters.status === 'all' || ticket.status === filters.status) &&
            (filters.priority === 'all' ||
                ticket.priority === filters.priority) &&
            matchesSla(ticket, filters.sla, now),
    );

    return sortTickets(filteredTickets, filters.sort);
}

export function ticketMetrics(
    tickets: Ticket[],
    now = new Date(),
): TicketMetric[] {
    return [
        {
            label: 'Open Tickets',
            value: tickets.filter(isOpen).length,
            description: 'Assigned to or requested by you',
        },
        {
            label: 'Due Today',
            value: tickets.filter(
                (ticket) => isOpen(ticket) && isSameDay(ticket.due_at, now),
            ).length,
            description: 'Open tickets due today',
        },
        {
            label: 'SLA Breached',
            value: tickets.filter(
                (ticket) =>
                    isOpen(ticket) &&
                    ticket.due_at !== null &&
                    timestamp(ticket.due_at) < now.getTime(),
            ).length,
            description: 'Needs attention',
        },
        {
            label: 'Resolved Today',
            value: tickets.filter((ticket) =>
                isSameDay(ticket.resolved_at, now),
            ).length,
            description: 'Closed out today',
        },
    ];
}
