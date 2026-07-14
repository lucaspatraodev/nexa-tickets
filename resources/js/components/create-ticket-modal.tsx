import { useForm } from '@inertiajs/react';
import { LoaderCircle, Pencil, Plus, Save } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { store, update } from '@/routes/tickets';
import type {
    Ticket,
    TicketPriority,
    TicketSelectOption,
    TicketStatus,
    TicketType,
} from '@/types';

type TicketFormData = {
    title: string;
    description: string;
    category_id: string;
    group_id: string;
    assignee_ids: number[];
    type: TicketType;
    priority: TicketPriority;
    status: TicketStatus;
    due_at: string;
};

type TicketFormModalProps = {
    categories?: TicketSelectOption[];
    groups?: TicketSelectOption[];
    assignees?: TicketSelectOption[];
    ticket?: Ticket;
    triggerClassName?: string;
};

const ticketTypes: { label: string; value: TicketType }[] = [
    { label: 'Incident', value: 'incident' },
    { label: 'Request', value: 'request' },
    { label: 'Task', value: 'task' },
    { label: 'Question', value: 'question' },
    { label: 'Change', value: 'change' },
];

const ticketPriorities: { label: string; value: TicketPriority }[] = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' },
];

const ticketStatuses: { label: string; value: TicketStatus }[] = [
    { label: 'Open', value: 'open' },
    { label: 'In progress', value: 'in_progress' },
    { label: 'Waiting', value: 'waiting' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Closed', value: 'closed' },
];

function formDefaults(ticket?: Ticket): TicketFormData {
    return {
        title: ticket?.title ?? '',
        description: ticket?.description ?? '',
        category_id: ticket ? String(ticket.category.id) : '',
        group_id: ticket ? String(ticket.group.id) : '',
        assignee_ids: ticket?.assignee_ids ?? [],
        type: ticket?.type ?? 'incident',
        priority: ticket?.priority ?? 'medium',
        status: ticket?.status ?? 'open',
        due_at: ticket?.due_at_input ?? '',
    };
}

export default function TicketFormModal({
    categories = [],
    groups = [],
    assignees = [],
    ticket,
    triggerClassName,
}: TicketFormModalProps) {
    const [open, setOpen] = useState(false);
    const isEditing = ticket !== undefined;
    const { data, setData, post, put, processing, reset, clearErrors, errors } =
        useForm<TicketFormData>(formDefaults(ticket));

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen);

        if (!nextOpen) {
            reset();
            clearErrors();
        }
    }

    function toggleAssignee(userId: number, checked: boolean) {
        const nextAssigneeIds = checked
            ? Array.from(new Set([...data.assignee_ids, userId]))
            : data.assignee_ids.filter((assigneeId) => assigneeId !== userId);

        setData('assignee_ids', nextAssigneeIds);
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        };

        if (ticket) {
            put(update.url(ticket.id), options);

            return;
        }

        post(store.url(), options);
    }

    const submitDisabled =
        processing || data.category_id === '' || data.group_id === '';

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {isEditing ? (
                    <button
                        className={triggerClassName}
                        type="button"
                        aria-label={`Edit ${ticket.reference}`}
                        title="Edit ticket"
                    >
                        <Pencil size={17} />
                    </button>
                ) : (
                    <button className="myTicketsCreate" type="button">
                        <Plus size={18} />
                        New Ticket
                    </button>
                )}
            </DialogTrigger>

            <DialogContent className="createTicketModal">
                <DialogHeader className="createTicketHeader">
                    <div className="createTicketHeading">
                        <span className="createTicketIcon">
                            {isEditing ? (
                                <Pencil size={18} />
                            ) : (
                                <Plus size={18} />
                            )}
                        </span>
                        <DialogTitle>
                            {isEditing
                                ? `Edit ${ticket.reference}`
                                : 'New Ticket'}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="sr-only">
                        {isEditing
                            ? 'Update this support ticket.'
                            : 'Create a new support ticket.'}
                    </DialogDescription>
                </DialogHeader>

                <form className="createTicketForm" onSubmit={submit}>
                    <div className="createTicketField createTicketFieldFull">
                        <Label htmlFor={`ticket-title-${ticket?.id ?? 'new'}`}>
                            Title
                        </Label>
                        <Input
                            id={`ticket-title-${ticket?.id ?? 'new'}`}
                            aria-invalid={Boolean(errors.title)}
                            autoFocus
                            maxLength={160}
                            name="title"
                            onChange={(event) =>
                                setData('title', event.target.value)
                            }
                            placeholder="Issue summary"
                            required
                            value={data.title}
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="createTicketField createTicketFieldFull">
                        <Label
                            htmlFor={`ticket-description-${ticket?.id ?? 'new'}`}
                        >
                            Description
                        </Label>
                        <textarea
                            id={`ticket-description-${ticket?.id ?? 'new'}`}
                            aria-invalid={Boolean(errors.description)}
                            className="createTicketTextarea"
                            maxLength={5000}
                            name="description"
                            onChange={(event) =>
                                setData('description', event.target.value)
                            }
                            placeholder="Details"
                            required
                            value={data.description}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="createTicketGrid">
                        <div className="createTicketField">
                            <Label>Category</Label>
                            <Select
                                disabled={categories.length === 0}
                                onValueChange={(value) =>
                                    setData('category_id', value)
                                }
                                value={data.category_id}
                            >
                                <SelectTrigger
                                    aria-label="Category"
                                    aria-invalid={Boolean(errors.category_id)}
                                    className="createTicketSelectTrigger"
                                >
                                    <SelectValue
                                        placeholder={
                                            categories.length > 0
                                                ? 'Select category'
                                                : 'No categories'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={String(category.id)}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category_id} />
                        </div>

                        <div className="createTicketField">
                            <Label>Group</Label>
                            <Select
                                disabled={groups.length === 0}
                                onValueChange={(value) =>
                                    setData('group_id', value)
                                }
                                value={data.group_id}
                            >
                                <SelectTrigger
                                    aria-label="Group"
                                    aria-invalid={Boolean(errors.group_id)}
                                    className="createTicketSelectTrigger"
                                >
                                    <SelectValue
                                        placeholder={
                                            groups.length > 0
                                                ? 'Select group'
                                                : 'No groups'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {groups.map((group) => (
                                        <SelectItem
                                            key={group.id}
                                            value={String(group.id)}
                                        >
                                            {group.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.group_id} />
                        </div>

                        <div className="createTicketField">
                            <Label>Type</Label>
                            <Select
                                onValueChange={(value) =>
                                    setData('type', value as TicketType)
                                }
                                value={data.type}
                            >
                                <SelectTrigger
                                    aria-label="Type"
                                    aria-invalid={Boolean(errors.type)}
                                    className="createTicketSelectTrigger"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ticketTypes.map((type) => (
                                        <SelectItem
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.type} />
                        </div>

                        <div className="createTicketField">
                            <Label>Priority</Label>
                            <Select
                                onValueChange={(value) =>
                                    setData('priority', value as TicketPriority)
                                }
                                value={data.priority}
                            >
                                <SelectTrigger
                                    aria-label="Priority"
                                    aria-invalid={Boolean(errors.priority)}
                                    className="createTicketSelectTrigger"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ticketPriorities.map((priority) => (
                                        <SelectItem
                                            key={priority.value}
                                            value={priority.value}
                                        >
                                            {priority.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.priority} />
                        </div>

                        {isEditing ? (
                            <div className="createTicketField">
                                <Label>Status</Label>
                                <Select
                                    onValueChange={(value) =>
                                        setData('status', value as TicketStatus)
                                    }
                                    value={data.status}
                                >
                                    <SelectTrigger
                                        aria-label="Status"
                                        aria-invalid={Boolean(errors.status)}
                                        className="createTicketSelectTrigger"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ticketStatuses.map((status) => (
                                            <SelectItem
                                                key={status.value}
                                                value={status.value}
                                            >
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>
                        ) : null}

                        <div className="createTicketField">
                            <Label
                                htmlFor={`ticket-due-at-${ticket?.id ?? 'new'}`}
                            >
                                SLA due at
                            </Label>
                            <Input
                                id={`ticket-due-at-${ticket?.id ?? 'new'}`}
                                aria-invalid={Boolean(errors.due_at)}
                                name="due_at"
                                onChange={(event) =>
                                    setData('due_at', event.target.value)
                                }
                                type="datetime-local"
                                value={data.due_at}
                            />
                            <InputError message={errors.due_at} />
                        </div>
                    </div>

                    <div className="createTicketField createTicketFieldFull">
                        <Label>Assignees</Label>
                        <div className="createTicketAssignees">
                            {assignees.length > 0 ? (
                                assignees.map((assignee) => (
                                    <label
                                        className="createTicketAssignee"
                                        htmlFor={`ticket-${ticket?.id ?? 'new'}-assignee-${assignee.id}`}
                                        key={assignee.id}
                                    >
                                        <Checkbox
                                            checked={data.assignee_ids.includes(
                                                assignee.id,
                                            )}
                                            id={`ticket-${ticket?.id ?? 'new'}-assignee-${assignee.id}`}
                                            onCheckedChange={(checked) =>
                                                toggleAssignee(
                                                    assignee.id,
                                                    checked === true,
                                                )
                                            }
                                        />
                                        <span>
                                            <strong>{assignee.name}</strong>
                                            {assignee.email ? (
                                                <small>{assignee.email}</small>
                                            ) : null}
                                        </span>
                                    </label>
                                ))
                            ) : (
                                <span className="createTicketEmpty">
                                    No assignees
                                </span>
                            )}
                        </div>
                        <InputError message={errors.assignee_ids} />
                    </div>

                    <DialogFooter className="createTicketActions">
                        <button
                            className="createTicketSecondary"
                            disabled={processing}
                            onClick={() => handleOpenChange(false)}
                            type="button"
                        >
                            Cancel
                        </button>
                        <button
                            className="createTicketPrimary"
                            disabled={submitDisabled}
                            type="submit"
                        >
                            {processing ? (
                                <LoaderCircle
                                    className="createTicketSpinner"
                                    size={17}
                                />
                            ) : isEditing ? (
                                <Save size={17} />
                            ) : (
                                <Plus size={17} />
                            )}
                            {isEditing ? 'Save Changes' : 'Create Ticket'}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export type { TicketSelectOption } from '@/types';
