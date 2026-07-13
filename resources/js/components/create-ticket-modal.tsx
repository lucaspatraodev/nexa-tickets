import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, Plus } from 'lucide-react';
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
import type { Auth } from '@/types';

export type TicketSelectOption = {
    id: number;
    name: string;
    email?: string;
};

type TicketType = 'incident' | 'request' | 'task' | 'question' | 'change';
type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

type CreateTicketFormData = {
    requester_id: number;
    title: string;
    description: string;
    category_id: string;
    group_id: string;
    assignee_ids: number[];
    type: TicketType;
    priority: TicketPriority;
};

type CreateTicketModalProps = {
    categories?: TicketSelectOption[];
    groups?: TicketSelectOption[];
    assignees?: TicketSelectOption[];
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

export default function CreateTicketModal({
    categories = [],
    groups = [],
    assignees = [],
}: CreateTicketModalProps) {
    const [open, setOpen] = useState(false);
    const { auth } = usePage<{ auth: Auth }>().props;
    const { data, setData, post, processing, reset, clearErrors, errors } =
        useForm<CreateTicketFormData>({
            requester_id: auth.user.id,
            title: '',
            description: '',
            category_id: '',
            group_id: '',
            assignee_ids: [],
            type: 'incident',
            priority: 'medium',
        });

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

        post('/tickets', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    }

    const submitDisabled =
        processing || data.category_id === '' || data.group_id === '';

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <button className="myTicketsCreate" type="button">
                    <Plus size={18} />
                    New Ticket
                </button>
            </DialogTrigger>

            <DialogContent className="createTicketModal">
                <DialogHeader className="createTicketHeader">
                    <div className="createTicketHeading">
                        <span className="createTicketIcon">
                            <Plus size={18} />
                        </span>
                        <DialogTitle>New Ticket</DialogTitle>
                    </div>
                    <DialogDescription className="sr-only">
                        Create a new support ticket.
                    </DialogDescription>
                </DialogHeader>

                <form className="createTicketForm" onSubmit={submit}>
                    <input
                        name="requester_id"
                        type="hidden"
                        value={data.requester_id}
                    />

                    <div className="createTicketField createTicketFieldFull">
                        <Label htmlFor="ticket-title">Title</Label>
                        <Input
                            id="ticket-title"
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
                        <Label htmlFor="ticket-description">Description</Label>
                        <textarea
                            id="ticket-description"
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
                            <Label htmlFor="ticket-category">Category</Label>
                            <Select
                                disabled={categories.length === 0}
                                onValueChange={(value) =>
                                    setData('category_id', value)
                                }
                                value={data.category_id}
                            >
                                <SelectTrigger
                                    id="ticket-category"
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
                            <Label htmlFor="ticket-group">Group</Label>
                            <Select
                                disabled={groups.length === 0}
                                onValueChange={(value) =>
                                    setData('group_id', value)
                                }
                                value={data.group_id}
                            >
                                <SelectTrigger
                                    id="ticket-group"
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
                            <Label htmlFor="ticket-type">Type</Label>
                            <Select
                                onValueChange={(value) =>
                                    setData('type', value as TicketType)
                                }
                                value={data.type}
                            >
                                <SelectTrigger
                                    id="ticket-type"
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
                            <Label htmlFor="ticket-priority">Priority</Label>
                            <Select
                                onValueChange={(value) =>
                                    setData('priority', value as TicketPriority)
                                }
                                value={data.priority}
                            >
                                <SelectTrigger
                                    id="ticket-priority"
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
                    </div>

                    <div className="createTicketField createTicketFieldFull">
                        <Label>Assignees</Label>
                        <div className="createTicketAssignees">
                            {assignees.length > 0 ? (
                                assignees.map((assignee) => (
                                    <label
                                        className="createTicketAssignee"
                                        htmlFor={`ticket-assignee-${assignee.id}`}
                                        key={assignee.id}
                                    >
                                        <Checkbox
                                            checked={data.assignee_ids.includes(
                                                assignee.id,
                                            )}
                                            id={`ticket-assignee-${assignee.id}`}
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
                            ) : (
                                <Plus size={17} />
                            )}
                            Create Ticket
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
