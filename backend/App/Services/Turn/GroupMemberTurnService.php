<?php

declare(strict_types=1);

namespace App\Services\Turn;

use App\Core\HttpStatus;
use App\DTOs\GroupMembers\Responses\GroupMemberTurnResponse;
use App\Exceptions\Turn\GroupMemberTurnException;
use App\Repositories\Turn\{GroupMemberTurnRepository, TurnRepository};

class GroupMemberTurnService extends TurnService
{
    public function __construct(
        private readonly TurnRepository $turnRepository,
        private readonly GroupMemberTurnRepository $groupMemberTurnRepository,
    ) {}

    public function getTurn(int $memberId): GroupMemberTurnResponse
    {
        $memberExists = $this->groupMemberTurnRepository->entityExists(
            'group_members',
            ['id' => $memberId]
        );
        if (!$memberExists) {
            throw new GroupMemberTurnException('Member not found', HttpStatus::NotFound);
        }

        $turn = $this->groupMemberTurnRepository->getById($memberId);
        if ($turn === null) {
            throw new GroupMemberTurnException('No active turn found for this group member', HttpStatus::NotFound);
        }

        $turnId = $turn->id->value;
        $turnBarbershopId = $turn->barbershopId->value;
        $scheduled = $this->getScheduledQueue($this->turnRepository, $turnBarbershopId);

        return new GroupMemberTurnResponse(
            id: $turnId,
            barbershopId: $turnBarbershopId,
            memberId: $turn->memberId->value,
            barberId: $turn->barberId?->value,
            groupId: $turn->groupId->value,
            memberName: $turn->memberName->value,
            status: $turn->status->value,
            position: $scheduled->findTurnPosition($turnId) ?? 0,
            createdAt: $turn->createdAt->value,
        );
    }
}
