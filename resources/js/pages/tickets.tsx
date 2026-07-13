import { Head } from '@inertiajs/react';
import {
    Building2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    ExternalLink,
    Grid2X2,
    List,
    Mail,
    MessageCircle,
    MoreHorizontal,
    Search,
    SlidersHorizontal,
    UserRound,
} from 'lucide-react';

import CreateTicketModal from '@/components/create-ticket-modal';
import type { TicketSelectOption } from '@/components/create-ticket-modal';

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
    tickets: TicketRow[];
    categories?: TicketSelectOption[];
    groups?: TicketSelectOption[];
    assignees?: TicketSelectOption[];
};

export default function TicketsPage({
    tickets,
    categories = [],
    groups = [],
    assignees = [],
}: TicketsPageProps) {
    return (
        <>
            <Head title="Tickets" />

            <div className="myTicketsPage">
                <section className="myTicketsHeader">
                    <h1>My Tickets</h1>
                    <p>
                        Track, prioritize, and act on the tickets assigned to
                        you.
                    </p>
                </section>

                <section className="myTicketsToolbar" aria-label="Ticket tools">
                    <label className="myTicketsSearch">
                        <Search size={18} />
                        <input
                            type="search"
                            placeholder="Search my tickets..."
                            aria-label="Search my tickets"
                        />
                    </label>

                    <button
                        className="myTicketsMobileFilter"
                        type="button"
                        aria-label="Open filters"
                    >
                        <SlidersHorizontal size={22} />
                    </button>

                    <div className="myTicketsFilters">
                        <button type="button">
                            Status: All <ChevronDown size={15} />
                        </button>
                        <button type="button">
                            Priority: All <ChevronDown size={15} />
                        </button>
                        <button type="button">
                            SLA: All <ChevronDown size={15} />
                        </button>
                        <button type="button">
                            Sort: Updated (Newest) <ChevronDown size={15} />
                        </button>
                    </div>

                    <CreateTicketModal
                        assignees={assignees}
                        categories={categories}
                        groups={groups}
                    />

                    <div
                        className="myTicketsViewSwitch"
                        aria-label="Ticket view"
                    >
                        <button className="isActive" type="button">
                            <Grid2X2 size={18} />
                        </button>
                        <button type="button">
                            <List size={18} />
                        </button>
                    </div>
                </section>

                <section className="myTicketsGrid" aria-label="My tickets">
                    {tickets.map((ticket) => (
                        <article
                            className="myTicketCard"
                            data-priority={ticket.priority}
                            data-status={ticket.status}
                            key={ticket.id}
                        >
                            <div className="myTicketTop">
                                <span className="myTicketPriority">
                                    <span />
                                    {ticket.priority}
                                </span>
                                <span>{ticket.id}</span>
                            </div>

                            <h2>{ticket.subject}</h2>

                            <p className="myTicketCustomer">
                                <Building2 size={15} />
                                {ticket.customer}
                                <span />
                                {ticket.priority} Priority
                            </p>

                            <div className="myTicketTags">
                                <span className="myTicketStatus">
                                    <Clock3 size={15} />
                                    {ticket.status}
                                </span>
                                <span className="myTicketUpdated">
                                    Updated {ticket.updatedAt}
                                </span>
                            </div>

                            <footer className="myTicketFooter">
                                <span className="myTicketOwner">
                                    <span>
                                        <UserRound size={13} />
                                    </span>
                                    {ticket.owner}
                                </span>

                                <div className="myTicketActions">
                                    <button type="button" aria-label="Email">
                                        <Mail size={17} />
                                    </button>
                                    <button type="button" aria-label="Chat">
                                        <MessageCircle size={17} />
                                    </button>
                                    <button type="button" aria-label="Open">
                                        <ExternalLink size={17} />
                                    </button>
                                    <button type="button" aria-label="More">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </footer>
                        </article>
                    ))}
                </section>

                <footer className="myTicketsFooter">
                    <p>Showing current tickets</p>

                    <div className="myTicketsPager" aria-label="Pagination">
                        <button type="button" aria-label="Previous page">
                            <ChevronLeft size={17} />
                        </button>
                        <button className="isActive" type="button">
                            1
                        </button>
                        <button type="button">2</button>
                        <button type="button">3</button>
                        <button type="button">4</button>
                        <button type="button" aria-label="Next page">
                            <ChevronRight size={17} />
                        </button>
                    </div>

                    <button className="myTicketsPageSize" type="button">
                        8 per page <ChevronDown size={15} />
                    </button>
                </footer>
            </div>
        </>
    );
}
