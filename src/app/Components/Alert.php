<?php

declare(strict_types=1);

namespace App\Components;

use App\Components\Core\Component;
use App\Utils\UriCache;

enum AlertVariant: string
{
    case Danger = 'danger';
}

class Alert extends Component
{
    private const BACK_BUTTON_TEXT = 'Volver';
    private const DEFAULT_CONTAINER_CLASSES = 'text-center mt-2';
    private const DEFAULT_BUTTON_CLASSES = 'btn btn-primary mb-4';

    public function __construct(
        private readonly string $message,
        private readonly AlertVariant $variant = AlertVariant::Danger,
        private readonly ?string $backUrl = null,
        private readonly bool $showBackButton = true,
    ) {
    }

    public function render(): string
    {
        // Auto-detect back URL
        if ($this->showBackButton && $this->backUrl === null) {
            $backUrl = UriCache::getPreviousUri();
        }

        $escapedMessage = htmlspecialchars($this->message, ENT_QUOTES, 'UTF-8');
        $escapedUrl = htmlspecialchars($backUrl ?? '', ENT_QUOTES, 'UTF-8');

        $html = sprintf(
            '<div class="%s">',
            self::DEFAULT_CONTAINER_CLASSES,
        );

        $html .= sprintf(
            '<div class="alert alert-%s" role="alert">%s</div>',
            $this->variant->value,
            $escapedMessage,
        );

        if ($this->showBackButton) {
            $html .= sprintf(
                '<a href="%s" class="%s">%s</a>',
                $escapedUrl,
                self::DEFAULT_BUTTON_CLASSES,
                self::BACK_BUTTON_TEXT,
            );
        }

        $html .= '</div>';
        return $html;
    }
}
