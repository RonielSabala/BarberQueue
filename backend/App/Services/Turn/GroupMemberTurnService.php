<?php

declare(strict_types=1);

namespace App\Services\Turn;

use App\Core\HttpStatus;
use App\DTOs\GroupMembers\Responses\GroupMemberTurnResponse;
use App\Exceptions\Turn\GroupMemberTurnException;
use App\Repositories\Turn\{GroupMemberTurnRepository, TurnRepository};

final readonly class GroupMemberTurnService extends BaseTurnService
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

        $scheduled = $this->getScheduledQueue(
            $this->turnRepository,
            $turn->barbershopId->value
        );

        $turnId = $turn->id->value;
        return GroupMemberTurnResponse::fromEntity(
            $turn,
            [
                'position' => $scheduled->findTurnPosition($turnId),
                'absolutePosition' => $scheduled->absolutePositionOf($turnId),
                'estimatedTime' => $scheduled->estimatedWaitMinutesFor($turnId),
            ]
        );
    }
}
