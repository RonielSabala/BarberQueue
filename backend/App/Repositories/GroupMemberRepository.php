<?php

declare(strict_types=1);

namespace App\Repositories;

class GroupMemberRepository extends BaseRepository
{
    protected const string TABLE_NAME = 'group_members';
    protected const array UPDATABLE_FIELDS = ['current_status'];

    public function createMember(int $groupId, string $memberName): int
    {
        return $this->insert([
            'group_id' => $groupId,
            'member_name' => $memberName,
        ]);
    }

    public function updateClientStatus(int $clientId, string $currentStatus): void
    {
        $this->updateFrom(
            'client_status',
            ['current_status' => $currentStatus],
            ['client_id' => $clientId]
        );
    }

    public function updateMemberStatus(int $memberId, string $currentStatus): void
    {
        $this->update($memberId, ['current_status' => $currentStatus]);
    }

    public function updateAllMemberStatus(int $groupId, string $currentStatus): void
    {
        $this->updateFrom(
            self::TABLE_NAME,
            ['current_status' => $currentStatus],
            ['group_id' => $groupId],
        );
    }
}
