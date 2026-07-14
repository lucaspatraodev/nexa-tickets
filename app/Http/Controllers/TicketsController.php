<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\TicketGroup;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TicketsController extends Controller
{
    public function index(Request $request): Response
    {
        $tickets = Ticket::query()
            ->visibleTo($request->user())
            ->with(['requester', 'category', 'group', 'assignees'])
            ->latest('updated_at')
            ->latest('id')
            ->get()
            ->map(fn (Ticket $ticket) => $this->ticketData($ticket));

        return Inertia::render('tickets', [
            'tickets' => $tickets,
            ...$this->formOptions(),
        ]);
    }

    public function show(Ticket $ticket): Response
    {
        Gate::authorize('view', $ticket);

        $ticket->load(['requester', 'category', 'group', 'assignees']);

        return Inertia::render('tickets/show', [
            'ticket' => $this->ticketData($ticket),
            ...$this->formOptions(),
        ]);
    }

    public function store(StoreTicketRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $assigneeIds = $data['assignee_ids'] ?? [];
        unset($data['assignee_ids']);

        $data['requester_id'] = $request->user()->id;
        $data['status'] = 'open';
        $data['due_at'] ??= now()->addHours($this->slaHours($data['priority']));

        $ticket = DB::transaction(function () use ($data, $assigneeIds): Ticket {
            $ticket = Ticket::query()->create($data);
            $ticket->assignees()->sync($assigneeIds);

            return $ticket;
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => sprintf('Ticket TKT-%04d created.', $ticket->id),
        ]);

        return to_route('tickets.index');
    }

    public function update(UpdateTicketRequest $request, Ticket $ticket): RedirectResponse
    {
        $data = $request->validated();
        $assigneeIds = $data['assignee_ids'] ?? [];
        unset($data['assignee_ids']);

        $this->setLifecycleDates($ticket, $data);

        DB::transaction(function () use ($ticket, $data, $assigneeIds): void {
            $ticket->update($data);
            $ticket->assignees()->sync($assigneeIds);
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => sprintf('Ticket TKT-%04d updated.', $ticket->id),
        ]);

        return back();
    }

    public function destroy(Ticket $ticket): RedirectResponse
    {
        Gate::authorize('delete', $ticket);

        $reference = sprintf('TKT-%04d', $ticket->id);
        $ticket->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Ticket {$reference} deleted.",
        ]);

        return to_route('tickets.index');
    }

    /**
     * @return array{categories: mixed, groups: mixed, assignees: mixed}
     */
    private function formOptions(): array
    {
        return [
            'categories' => TicketCategory::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name']),
            'groups' => TicketGroup::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name']),
            'assignees' => User::query()
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function ticketData(Ticket $ticket): array
    {
        return [
            'id' => $ticket->id,
            'reference' => sprintf('TKT-%04d', $ticket->id),
            'title' => $ticket->title,
            'description' => $ticket->description,
            'requester' => [
                'id' => $ticket->requester->id,
                'name' => $ticket->requester->name,
                'email' => $ticket->requester->email,
            ],
            'category' => [
                'id' => $ticket->category->id,
                'name' => $ticket->category->name,
            ],
            'group' => [
                'id' => $ticket->group->id,
                'name' => $ticket->group->name,
            ],
            'assignees' => $ticket->assignees
                ->map(fn (User $assignee) => [
                    'id' => $assignee->id,
                    'name' => $assignee->name,
                    'email' => $assignee->email,
                ])
                ->values(),
            'assignee_ids' => $ticket->assignees->modelKeys(),
            'type' => $ticket->type,
            'type_label' => Str::headline($ticket->type),
            'priority' => $ticket->priority,
            'priority_label' => Str::headline($ticket->priority),
            'status' => $ticket->status,
            'status_label' => Str::headline($ticket->status),
            'display_status' => $this->displayStatus($ticket),
            'due_at' => $ticket->due_at?->toIso8601String(),
            'due_at_input' => $ticket->due_at?->format('Y-m-d\TH:i'),
            'due_at_label' => $ticket->due_at?->format('M j, Y H:i'),
            'created_at' => $ticket->created_at?->toIso8601String(),
            'updated_at' => $ticket->updated_at?->toIso8601String(),
            'updated_at_human' => $ticket->updated_at?->diffForHumans(),
            'resolved_at' => $ticket->resolved_at?->toIso8601String(),
            'closed_at' => $ticket->closed_at?->toIso8601String(),
        ];
    }

    private function displayStatus(Ticket $ticket): string
    {
        if ($ticket->due_at !== null && ! in_array($ticket->status, ['resolved', 'closed'], true)) {
            if ($ticket->due_at->isPast()) {
                return 'SLA Breached';
            }

            if ($ticket->due_at->isToday()) {
                return 'Due '.$ticket->due_at->diffForHumans();
            }
        }

        return Str::headline($ticket->status);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function setLifecycleDates(Ticket $ticket, array &$data): void
    {
        $isResolved = in_array($data['status'], ['resolved', 'closed'], true);

        $data['resolved_at'] = $isResolved
            ? ($ticket->resolved_at ?? now())
            : null;
        $data['closed_at'] = $data['status'] === 'closed'
            ? ($ticket->closed_at ?? now())
            : null;
    }

    private function slaHours(string $priority): int
    {
        return match ($priority) {
            'critical' => 4,
            'high' => 8,
            'low' => 72,
            default => 24,
        };
    }
}
