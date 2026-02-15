<?php

declare(strict_types=1);

namespace App\Components;

use App\Utils\UriCache;


enum AlertVariant: string
{
    case Danger = 'danger';
}

class Alert
{
    private const BACK_BUTTON_TEXT = 'Volver';
    private const DEFAULT_CONTAINER_CLASSES = 'text-center mt-2';
    private const DEFAULT_BUTTON_CLASSES = 'btn btn-primary mb-4';

    public static function render(
        string $message,
        AlertVariant $variant = AlertVariant::Danger,
        ?string $backUrl = null,
        bool $showBackButton = true,
    ): string {
        // Auto-detect back URL
        if ($showBackButton && $backUrl === null) {
            $backUrl = UriCache::getPreviousUri();
        }

        $escapedMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
        $escapedUrl = htmlspecialchars($backUrl ?? '', ENT_QUOTES, 'UTF-8');

        $html = sprintf(
            '<div class="%s">',
            self::DEFAULT_CONTAINER_CLASSES
        );

        $html .= sprintf(
            '<div class="alert alert-%s" role="alert">%s</div>',
            $variant->value,
            $escapedMessage
        );

        if ($showBackButton) {
            $html .= sprintf(
                '<a href="%s" class="%s">%s</a>',
                $escapedUrl,
                self::DEFAULT_BUTTON_CLASSES,
                self::BACK_BUTTON_TEXT
            );
        }

        $html .= '</div>';
        return $html;
    }
}
