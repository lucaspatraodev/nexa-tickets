<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use App\Http\Requests\StoreTicketRequest;

class TicketsController extends Controller
{
    public function index()
    {
        return inertia('tickets', [
            'metrics' => [
                [
                    'label' => 'Open Tickets',
                    'value' => '28',
                    'description' => '8% vs yesterday',
                ],
                [
                    'label' => 'Due Today',
                    'value' => '7',
                    'description' => '3% vs yesterday',
                ],
                [
                    'label' => 'SLA Breached',
                    'value' => '2',
                    'description' => 'Needs attention',
                ],
                [
                    'label' => 'Resolved Today',
                    'value' => '15',
                    'description' => '20% vs yesterday',
                ],
            ],
            'filters' => ['All', 'High Priority', 'Waiting', 'Resolved'],
            'tickets' => [
                [
                    'id' => 'TKT-1048',
                    'subject' => 'Payment gateway not responding',
                    'customer' => 'Sarah Johnson',
                    'priority' => 'High',
                    'status' => 'SLA Breached',
                    'owner' => 'Lucas',
                    'updatedAt' => '15m ago',
                ],
                [
                    'id' => 'TKT-1032',
                    'subject' => 'Unable to access reports',
                    'customer' => 'Acme Corp',
                    'priority' => 'High',
                    'status' => 'Due in 30m',
                    'owner' => 'Lucas',
                    'updatedAt' => '30m ago',
                ],
                [
                    'id' => 'TKT-1045',
                    'subject' => 'Waiting for customer details',
                    'customer' => 'Globex Inc',
                    'priority' => 'Medium',
                    'status' => 'Waiting',
                    'owner' => 'Maya',
                    'updatedAt' => '2h ago',
                ],
            ],
        ]);
    }

    public function create(Request $request)
    {
    //  {
    //    "requester_id": 12,
    //    "title": "Erro ao gerar cobrança do contrato",
    //    "description": "Ao clicar em cobrar agora, o sistema retorna erro 500.",
    //    "category_id": 3,
    //    "group_id": 1,
    //    "assignee_ids": [7, 9],
    //    "type": "incident",
    //    "priority": "medium"
    //  }

    StoreTicketRequest::validate($request->all());

        Ticket::create($request->only([
            'requester_id',
            'title',
            'description',
            'category_id',
            'group_id',
            'type',
            'priority',
        ]));

        return response()->json(['message' => 'Ticket created successfully'], 201);

    }
}