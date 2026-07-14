export type TicketType =
    'incident' | 'request' | 'task' | 'question' | 'change';

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export type TicketStatus =
    'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';

export type TicketSelectOption = {
    id: number;
    name: string;
    email?: string;
};

export type TicketUser = {
    id: number;
    name: string;
    email: string;
};

export type Ticket = {
    id: number;
    reference: string;
    title: string;
    description: string;
    requester: TicketUser;
    category: TicketSelectOption;
    group: TicketSelectOption;
    assignees: TicketUser[];
    assignee_ids: number[];
    type: TicketType;
    type_label: string;
    priority: TicketPriority;
    priority_label: string;
    status: TicketStatus;
    status_label: string;
    display_status: string;
    due_at: string | null;
    due_at_input: string | null;
    due_at_label: string | null;
    created_at: string | null;
    updated_at: string | null;
    updated_at_human: string | null;
    resolved_at: string | null;
    closed_at: string | null;
};

export type TicketMetric = {
    label: string;
    value: number;
    description: string;
};

export type TicketFilters = {
    search: string;
    status: TicketStatus | 'all';
    priority: TicketPriority | 'all';
    sla: 'all' | 'breached' | 'due_today' | 'on_track' | 'none';
    sort:
        | 'updated_desc'
        | 'updated_asc'
        | 'created_desc'
        | 'priority_desc'
        | 'due_asc';
    per_page: number;
};
