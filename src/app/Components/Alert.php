<?php

declare(strict_types=1);

namespace App\Components;

use App\Utils\{TextUtils, UriCache};

enum AlertVariant: string
{
    case Danger = 'danger';
}

class Alert extends BaseComponent
{
    private const CONTAINER_TEMPLATE = '<div class="text-center mt-2">%s</div>';
    private const ALERT_TEMPLATE = '<div class="alert alert-%s" role="alert">%s</div>';
    private const BACK_BUTTON_TEMPLATE = '<a href="%s" class="btn btn-primary mb-4">Volver</a>';

    public function __construct(
        private string $message,
        private readonly AlertVariant $variant = AlertVariant::Danger,
        private readonly bool $showBackButton = true,
        private ?string $backUrl = null,
    ) {
        if ($showBackButton && $backUrl === null) {
            $backUrl = UriCache::getPreviousUri();
        }

        $this->backUrl = TextUtils::escape($backUrl ?? '');
        $this->message = TextUtils::escape($message);
    }

    public function render(): string
    {
        $html = \sprintf(self::ALERT_TEMPLATE, $this->variant->value, $this->message);
        if ($this->showBackButton) {
            $html .= \sprintf(self::BACK_BUTTON_TEMPLATE, $this->backUrl);
        }

        return \sprintf(self::CONTAINER_TEMPLATE, $html);
    }
}
