<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\HttpResponse;
use App\Services\Turn\GroupMemberTurnService;
use App\Attributes\{GET, RoutePrefix};

#[RoutePrefix('/api/group-members')]
class GroupMemberController extends BaseController
{
    public function __construct(
        private readonly GroupMemberTurnService $groupMemberTurnService
    ) {}

    #[GET('/{id}/turn')]
    public function getTurn(int $id): void
    {
        $response = $this->groupMemberTurnService->getTurn($id);
        HttpResponse::json($response);
    }
}
