<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpStatus;
use App\Domain\Entities\User;
use App\Domain\ValueObjects\Token;
use App\Exceptions\MailException;
use App\Repositories\PasswordResetRepository;
use PHPMailer\PHPMailer\PHPMailer;

class MailService
{
    private const PORT = 587;
    private const HOST = 'smtp.gmail.com';
    private const RESET_EXPIRY_MINUTES = 30;
    private readonly string $username;
    private readonly string $password;

    public function __construct(
        private readonly PasswordResetRepository $passwordResetRepository,
    ) {
        $username = $_ENV['MAIL_USERNAME'] ?? null;
        if (!$username) {
            throw new MailException('`MAIL_USERNAME` is not defined in the environment.', HttpStatus::InternalServerError);
        }

        $password = $_ENV['MAIL_PASSWORD'] ?? null;
        if (!$password) {
            throw new MailException('`MAIL_PASSWORD` is not defined in the environment.', HttpStatus::InternalServerError);
        }

        $this->username = $username;
        $this->password = $password;
    }

    public function sendPasswordReset(User $user): void
    {
        $userId = $user->id->value;
        $userMail = $user->email->value;
        $token = bin2hex(random_bytes(Token::LENGTH));
        $expiresAt = new \DateTimeImmutable('+' . self::RESET_EXPIRY_MINUTES . ' minutes');

        // Persist reset token
        $this->passwordResetRepository->create($userId, $token, $expiresAt);

        // Send email
        $mail = new PHPMailer(true);
        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host = self::HOST;
            $mail->SMTPAuth = true;
            $mail->Username = $this->username;
            $mail->Password = $this->password;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = self::PORT;

            // Recipients
            $mail->setFrom($this->username, 'BarberQueue');
            $mail->addAddress($userMail);

            // Send
            $mail->isHTML(true);
            $mail->Subject = 'Code to reset your password';
            $mail->Body = "Your code is: <b>{$token}</b>. Valid for " . self::RESET_EXPIRY_MINUTES . ' minutes.';
            $mail->send();
        } catch (\Exception $e) {
            throw new MailException("Message could not be sent. Mailer Error: {$mail->ErrorInfo}", HttpStatus::InternalServerError);
        }
    }
}
