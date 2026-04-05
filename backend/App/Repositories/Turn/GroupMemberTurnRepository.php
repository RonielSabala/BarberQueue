<?php

declare(strict_types=1);

namespace App\Repositories\Turn;

use App\Domain\Entities\Turn\GroupMemberTurnEntity;
use App\Repositories\BaseRepository;

class GroupMemberTurnRepository extends BaseRepository
{
    public function getById(int $memberId): ?GroupMemberTurnEntity
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
                t.member_id = ?
            LIMIT
                1
        SQL;

        return $this->fetchOne(GroupMemberTurnEntity::class, $sql, [$memberId]);
    }
}
