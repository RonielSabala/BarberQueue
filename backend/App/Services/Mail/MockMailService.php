<?php

declare(strict_types=1);

namespace App\Services\Mail;

use App\Config\LoggerProvider;
use App\Domain\Entities\UserEntity;
use Monolog\Logger;

class MockMailService implements MailerInterface
{
    private readonly Logger $logger;

    public function __construct()
    {
        $this->logger = LoggerProvider::get();
    }

    public function sendPasswordReset(UserEntity $user): void
    {
        $this->logger->notice(
            'Password reset email suppressed for: ' . $user->email->value
        );
    }
}
