<?php

declare(strict_types=1);

namespace App\Repositories;

final readonly class ClientGroupRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'client_groups';

    public function createGroup(int $leaderId): int
    {
        return $this->insert([
            'leader_id' => $leaderId,
        ]);
    }
}
