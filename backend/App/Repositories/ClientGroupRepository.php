<?php

declare(strict_types=1);

namespace App\Repositories;

class ClientGroupRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'client_groups';

    public function createGroup(int $leaderId): int
    {
        return $this->insert([
            'leader_id' => $leaderId,
        ]);
    }

    public function getGroupIdByLeaderId(int $leaderId): ?int
    {
        $sql = <<<'SQL'
            SELECT
                id
            FROM
                client_groups
            WHERE
                leader_id = ?
            LIMIT
                1
        SQL;

        $row = $this->query($sql, [$leaderId])->fetch();
        return $row ? (int) $row['id'] : null;
    }
}
