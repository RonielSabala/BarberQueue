<?php

declare(strict_types=1);

namespace App\Components;

class Tab extends BaseComponent
{
    private const CONTAINER_TEMPLATE = '<li class="nav-item">%s</li>';
    private const TAB_TEMPLATE = '<a class="nav-link custom-link non-selectable %s" href="%s">%s</a>';
    private const TAB_ACTIVE_CLASS = 'active';

    public function __construct(
        private readonly string $viewTabName,
        private readonly string $tabName,
        private readonly string $url,
    ) {}

    public function render(): string
    {
        $currentTab = \defined('CURRENT_TAB') ? CURRENT_TAB : '';
        $activeClass = $this->viewTabName === $currentTab ? self::TAB_ACTIVE_CLASS : '';

        $html = \sprintf(
            self::TAB_TEMPLATE,
            $activeClass,
            $this->url,
            $this->tabName,
        );

        return \sprintf(self::CONTAINER_TEMPLATE, $html);
    }
}
