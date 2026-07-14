import { Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    ExternalLink,
    Grid2X2,
    List,
    Mail,
    Search,
    SlidersHorizontal,
    Trash2,
    UserRound,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import TicketFormModal from '@/components/create-ticket-modal';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { filterAndSortTickets, ticketMetrics } from '@/lib/ticket-filters';
import { cn } from '@/lib/utils';
import { destroy, show } from '@/routes/tickets';
import type {
    Ticket,
    TicketFilters,
    TicketPriority,
    TicketSelectOption,
    TicketStatus,
} from '@/types';

type TicketsPageProps = {
    tickets: Ticket[];
    categories?: TicketSelectOption[];
    groups?: TicketSelectOption[];
    assignees?: TicketSelectOption[];
};

type TicketView = 'grid' | 'list';

const statusOptions: { label: string; value: TicketStatus | 'all' }[] = [
    { label: 'Status: All', value: 'all' },
    { label: 'Status: Open', value: 'open' },
    { label: 'Status: In progress', value: 'in_progress' },
    { label: 'Status: Waiting', value: 'waiting' },
    { label: 'Status: Resolved', value: 'resolved' },
    { label: 'Status: Closed', value: 'closed' },
];

const priorityOptions: { label: string; value: TicketPriority | 'all' }[] = [
    { label: 'Priority: All', value: 'all' },
    { label: 'Priority: Critical', value: 'critical' },
    { label: 'Priority: High', value: 'high' },
    { label: 'Priority: Medium', value: 'medium' },
    { label: 'Priority: Low', value: 'low' },
];

const slaOptions: { label: string; value: TicketFilters['sla'] }[] = [
    { label: 'SLA: All', value: 'all' },
    { label: 'SLA: Breached', value: 'breached' },
    { label: 'SLA: Due today', value: 'due_today' },
    { label: 'SLA: On track', value: 'on_track' },
    { label: 'SLA: No deadline', value: 'none' },
];

const sortOptions: { label: string; value: TicketFilters['sort'] }[] = [
    { label: 'Sort: Updated (Newest)', value: 'updated_desc' },
    { label: 'Sort: Updated (Oldest)', value: 'updated_asc' },
    { label: 'Sort: Created (Newest)', value: 'created_desc' },
    { label: 'Sort: Priority', value: 'priority_desc' },
    { label: 'Sort: SLA deadline', value: 'due_asc' },
];

const initialFilters: TicketFilters = {
    search: '',
    status: 'all',
    priority: 'all',
    sla: 'all',
    sort: 'updated_desc',
    per_page: 8,
};

function pageNumbers(currentPage: number, lastPage: number): number[] {
    const visiblePages = Math.min(5, lastPage);
    const firstPage = Math.max(
        1,
        Math.min(currentPage - 2, lastPage - visiblePages + 1),
    );

    return Array.from(
        { length: visiblePages },
        (_, index) => firstPage + index,
    );
}

export default function TicketsPage({
    tickets,
    categories = [],
    groups = [],
    assignees = [],
}: TicketsPageProps) {
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [view, setView] = useState<TicketView>('grid');
    const [filters, setFilters] = useState<TicketFilters>(initialFilters);
    const [currentPage, setCurrentPage] = useState(1);
    const filteredTickets = useMemo(
        () => filterAndSortTickets(tickets, filters),
        [filters, tickets],
    );
    const metrics = useMemo(() => ticketMetrics(tickets), [tickets]);
    const total = filteredTickets.length;
    const lastPage = Math.max(1, Math.ceil(total / filters.per_page));
    const activePage = Math.min(currentPage, lastPage);
    const firstTicketIndex = (activePage - 1) * filters.per_page;
    const visibleTickets = filteredTickets.slice(
        firstTicketIndex,
        firstTicketIndex + filters.per_page,
    );
    const pages = useMemo(
        () => pageNumbers(activePage, lastPage),
        [activePage, lastPage],
    );
    const hasActiveFilters =
        filters.search !== '' ||
        filters.status !== 'all' ||
        filters.priority !== 'all' ||
        filters.sla !== 'all';

    function updateFilter<Key extends keyof TicketFilters>(
        key: Key,
        value: TicketFilters[Key],
    ) {
        setFilters((currentFilters) => ({
            ...currentFilters,
            [key]: value,
        }));
        setCurrentPage(1);
    }

    function clearFilters() {
        setFilters((currentFilters) => ({
            ...initialFilters,
            sort: currentFilters.sort,
            per_page: currentFilters.per_page,
        }));
        setCurrentPage(1);
    }

    function deleteTicket(ticket: Ticket) {
        if (
            !window.confirm(
                `Delete ${ticket.reference}? This action cannot be undone.`,
            )
        ) {
            return;
        }

        router.delete(destroy.url(ticket.id), {
            preserveScroll: true,
            preserveState: true,
        });
    }

    return (
        <>
            <Head title="Tickets" />

            <div className="myTicketsPage">
                <section className="myTicketsHeader">
                    <h1>My Tickets</h1>
                    <p>
                        Track, prioritize, and act on tickets requested by or
                        assigned to you.
                    </p>
                </section>

                <section
                    className="myTicketsMetrics"
                    aria-label="Ticket metrics"
                >
                    {metrics.map((metric) => (
                        <article className="myTicketsMetric" key={metric.label}>
                            <span>{metric.label}</span>
                            <strong>{metric.value}</strong>
                            <small>{metric.description}</small>
                        </article>
                    ))}
                </section>

                <section className="myTicketsToolbar" aria-label="Ticket tools">
                    <label className="myTicketsSearch">
                        <Search size={18} />
                        <input
                            type="search"
                            placeholder="Search by ticket, requester, or owner..."
                            aria-label="Search my tickets"
                            onChange={(event) =>
                                updateFilter('search', event.target.value)
                            }
                            value={filters.search}
                        />
                    </label>

                    <button
                        className="myTicketsMobileFilter"
                        type="button"
                        aria-expanded={filtersOpen}
                        aria-label="Toggle filters"
                        onClick={() => setFiltersOpen((isOpen) => !isOpen)}
                    >
                        <SlidersHorizontal size={22} />
                    </button>

                    <div
                        className={cn(
                            'myTicketsFilters',
                            filtersOpen && 'isOpen',
                        )}
                    >
                        <Select
                            onValueChange={(value) =>
                                updateFilter(
                                    'status',
                                    value as TicketFilters['status'],
                                )
                            }
                            value={filters.status}
                        >
                            <SelectTrigger
                                aria-label="Filter by status"
                                className="myTicketsFilterSelect"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            onValueChange={(value) =>
                                updateFilter(
                                    'priority',
                                    value as TicketFilters['priority'],
                                )
                            }
                            value={filters.priority}
                        >
                            <SelectTrigger
                                aria-label="Filter by priority"
                                className="myTicketsFilterSelect"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {priorityOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            onValueChange={(value) =>
                                updateFilter(
                                    'sla',
                                    value as TicketFilters['sla'],
                                )
                            }
                            value={filters.sla}
                        >
                            <SelectTrigger
                                aria-label="Filter by SLA"
                                className="myTicketsFilterSelect"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {slaOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            onValueChange={(value) =>
                                updateFilter(
                                    'sort',
                                    value as TicketFilters['sort'],
                                )
                            }
                            value={filters.sort}
                        >
                            <SelectTrigger
                                aria-label="Sort tickets"
                                className="myTicketsFilterSelect"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {hasActiveFilters ? (
                            <button
                                className="myTicketsClearFilters"
                                onClick={clearFilters}
                                type="button"
                            >
                                <X size={15} />
                                Clear
                            </button>
                        ) : null}
                    </div>

                    <TicketFormModal
                        assignees={assignees}
                        categories={categories}
                        groups={groups}
                    />

                    <div
                        className="myTicketsViewSwitch"
                        aria-label="Ticket view"
                    >
                        <button
                            className={view === 'grid' ? 'isActive' : ''}
                            type="button"
                            aria-label="Grid view"
                            aria-pressed={view === 'grid'}
                            onClick={() => setView('grid')}
                        >
                            <Grid2X2 size={18} />
                        </button>
                        <button
                            className={view === 'list' ? 'isActive' : ''}
                            type="button"
                            aria-label="List view"
                            aria-pressed={view === 'list'}
                            onClick={() => setView('list')}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </section>

                {visibleTickets.length > 0 ? (
                    <section
                        className={cn(
                            'myTicketsGrid',
                            view === 'list' && 'isList',
                        )}
                        aria-label="My tickets"
                    >
                        {visibleTickets.map((ticket) => (
                            <article
                                className="myTicketCard"
                                data-priority={ticket.priority}
                                data-status={ticket.display_status.toLowerCase()}
                                key={ticket.id}
                            >
                                <div className="myTicketTop">
                                    <span className="myTicketPriority">
                                        <span />
                                        {ticket.priority_label}
                                    </span>
                                    <span>{ticket.reference}</span>
                                </div>

                                <h2>
                                    <Link href={show.url(ticket.id)}>
                                        {ticket.title}
                                    </Link>
                                </h2>

                                <p className="myTicketCustomer">
                                    <Building2 size={15} />
                                    {ticket.requester.name}
                                    <span />
                                    {ticket.group.name}
                                </p>

                                <div className="myTicketTags">
                                    <span className="myTicketStatus">
                                        <Clock3 size={15} />
                                        {ticket.display_status}
                                    </span>
                                    <span className="myTicketUpdated">
                                        Updated {ticket.updated_at_human}
                                    </span>
                                </div>

                                <footer className="myTicketFooter">
                                    <span
                                        className="myTicketOwner"
                                        title={ticket.assignees
                                            .map((assignee) => assignee.name)
                                            .join(', ')}
                                    >
                                        <span>
                                            <UserRound size={13} />
                                        </span>
                                        {ticket.assignees.length > 0
                                            ? ticket.assignees
                                                  .map(
                                                      (assignee) =>
                                                          assignee.name,
                                                  )
                                                  .join(', ')
                                            : 'Unassigned'}
                                    </span>

                                    <div className="myTicketActions">
                                        <a
                                            href={`mailto:${ticket.requester.email}`}
                                            aria-label={`Email ${ticket.requester.name}`}
                                            title="Email requester"
                                        >
                                            <Mail size={17} />
                                        </a>
                                        <Link
                                            href={show.url(ticket.id)}
                                            aria-label={`Open ${ticket.reference}`}
                                            title="View ticket"
                                        >
                                            <ExternalLink size={17} />
                                        </Link>
                                        <TicketFormModal
                                            assignees={assignees}
                                            categories={categories}
                                            groups={groups}
                                            key={ticket.updated_at ?? ticket.id}
                                            ticket={ticket}
                                        />
                                        <button
                                            className="isDestructive"
                                            type="button"
                                            aria-label={`Delete ${ticket.reference}`}
                                            title="Delete ticket"
                                            onClick={() => deleteTicket(ticket)}
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                </footer>
                            </article>
                        ))}
                    </section>
                ) : (
                    <section className="myTicketsEmpty">
                        <Search size={28} />
                        <h2>No tickets found</h2>
                        <p>
                            {hasActiveFilters
                                ? 'Try clearing or changing the current filters.'
                                : 'Create your first ticket to get started.'}
                        </p>
                        {hasActiveFilters ? (
                            <button onClick={clearFilters} type="button">
                                Clear filters
                            </button>
                        ) : null}
                    </section>
                )}

                <footer className="myTicketsFooter">
                    <p>
                        {total > 0
                            ? `Showing ${firstTicketIndex + 1}–${Math.min(firstTicketIndex + filters.per_page, total)} of ${total} tickets`
                            : 'No tickets to show'}
                    </p>

                    {lastPage > 1 ? (
                        <div className="myTicketsPager" aria-label="Pagination">
                            <button
                                type="button"
                                aria-label="Previous page"
                                disabled={activePage === 1}
                                onClick={() => setCurrentPage(activePage - 1)}
                            >
                                <ChevronLeft size={17} />
                            </button>
                            {pages.map((page) => (
                                <button
                                    className={
                                        page === activePage ? 'isActive' : ''
                                    }
                                    type="button"
                                    aria-current={
                                        page === activePage ? 'page' : undefined
                                    }
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                type="button"
                                aria-label="Next page"
                                disabled={activePage === lastPage}
                                onClick={() => setCurrentPage(activePage + 1)}
                            >
                                <ChevronRight size={17} />
                            </button>
                        </div>
                    ) : (
                        <span />
                    )}

                    <Select
                        onValueChange={(value) =>
                            updateFilter('per_page', Number(value))
                        }
                        value={String(filters.per_page)}
                    >
                        <SelectTrigger
                            aria-label="Tickets per page"
                            className="myTicketsPageSize"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[8, 16, 24].map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size} per page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </footer>
            </div>
        </>
    );
}
