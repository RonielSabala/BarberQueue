<?php

declare(strict_types=1);

namespace App\Services\Mail;

use App\Domain\Entities\UserEntity;

interface MailerInterface
{
    public function sendPasswordReset(UserEntity $user): void;
}
