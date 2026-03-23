<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Entities\User;
use App\Domain\ValueObjects\ResetCode;
use App\Exceptions\MailException;
use App\Repositories\PasswordResetRepository;
use PHPMailer\PHPMailer\PHPMailer;

class MailService extends BaseService
{
    private const PORT = 587;
    private const HOST = 'smtp.gmail.com';
    private const FROM_NAME = 'BarberQueue';
    private const RESET_EXPIRY_MINUTES = 30;

    private readonly string $username;
    private readonly string $password;

    public function __construct(
        private readonly PasswordResetRepository $passwordResetRepository,
    ) {
        $this->username = $this->getEnvVariable('MAIL_USERNAME');
        $this->password = $this->getEnvVariable('MAIL_PASSWORD');
    }

    private function sendEmail(PHPMailer $mail, string $to, string $subject, string $body): void
    {
        // Server settings
        $mail->isSMTP();
        $mail->Host = self::HOST;
        $mail->SMTPAuth = true;
        $mail->Username = $this->username;
        $mail->Password = $this->password;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = self::PORT;

        // Recipients
        $mail->setFrom($this->username, self::FROM_NAME);
        $mail->addAddress($to);

        // Send
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->send();
    }

    public function sendPasswordReset(User $user): void
    {
        $userId = $user->id->value;
        $userEmail = $user->email->value;

        // Persist reset code
        $resetCode = ResetCode::getNewCode();
        $minutes = self::RESET_EXPIRY_MINUTES . ' minutes';
        $expiresAt = new \DateTimeImmutable("+{$minutes}");
        $this->passwordResetRepository->create($userId, $resetCode, $expiresAt);

        // Send email
        $mail = new PHPMailer(true);
        $subject = 'Code to reset your password';
        $body = "Your code is: <b>{$resetCode}</b>. Valid for {$minutes}.";

        try {
            $this->sendEmail($mail, $userEmail, $subject, $body);
        } catch (\Exception $e) {
            throw new MailException("Message could not be sent. Mailer Error: {$mail->ErrorInfo}", HttpStatus::InternalServerError);
        }
    }
}
