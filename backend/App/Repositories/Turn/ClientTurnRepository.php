<?php

declare(strict_types=1);

namespace App\Repositories\Turn;

use App\Repositories\BaseRepository;
use App\Domain\Entities\Turn\{ClientTurnEntity, GroupMemberTurnEntity};

final readonly class ClientTurnRepository extends BaseRepository
{
    public function getById(int $clientId): ?ClientTurnEntity
    {
        $sql = <<<'SQL'
            SELECT
                t.*,
                u.username,
                cs.current_status AS status
            FROM
                turns t
                JOIN client_status cs ON cs.client_id = t.client_id
                JOIN users u ON u.id = t.client_id
            WHERE
                t.client_id = ?
            ORDER BY
                t.created_at DESC
            LIMIT
                1
        SQL;

        return $this->fetchOne(ClientTurnEntity::class, $sql, [$clientId]);
    }

    /** @return GroupMemberTurnEntity[] */
    public function getAllByGroupId(int $groupId): array
    {
        $sql = <<<'SQL'
            SELECT
                t.*,
                gm.member_name,
                gm.current_status AS status
            FROM
                turns t
                JOIN group_members gm ON gm.id = t.member_id
            WHERE
                t.group_id = ?
                AND t.member_id IS NOT NULL
            ORDER BY
                t.created_at ASC
        SQL;

        return $this->fetchAll(GroupMemberTurnEntity::class, $sql, [$groupId]);
    }
}
