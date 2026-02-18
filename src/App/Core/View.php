<?php

declare(strict_types=1);

namespace App\Core;

use App\Components\Alert;
use App\Utils\{ArrayUtils, TextUtils};

class ViewPaths
{
    private const VIEWS_DIR_NAME = 'views';
    public const VIEWS_FILE_EXT = '.php';

    public const CSS_DIR_NAME = 'css';
    public const CSS_FILE_EXT = '.css';

    public const JS_DIR_NAME = 'js';
    public const JS_FILE_EXT = '.js';

    private const PARTIALS_DIR_NAME = '_partials';
    public const PARTIAL_HEADER_FILENAME = self::PARTIALS_DIR_NAME . '/_header';
    public const PARTIAL_NAV_FILENAME = self::PARTIALS_DIR_NAME . '/_nav';
    public const PARTIAL_FOOTER_FILENAME = self::PARTIALS_DIR_NAME . '/_footer';

    public const VIEWS_DIR = PUBLIC_DIR . '/' . self::VIEWS_DIR_NAME;
    public const CSS_DIR = PUBLIC_DIR . '/' . self::CSS_DIR_NAME;
    public const JS_DIR = PUBLIC_DIR . '/' . self::JS_DIR_NAME;
}

class View
{
    private const CSS_LINK_TEMPLATE = "\t" . '<link rel="stylesheet" href="/%s" />' . "\n";
    private const SCRIPT_TEMPLATE = "\n" . '<script src="/%s"></script>';

    private bool $jsonMode = false;
    private array $pathFallbacks = [];

    public function __construct(
        public string $viewDir,
        public string $viewName,
        private readonly ?string $viewTabName
    ) {
        $this->viewDir = TextUtils::hyphenToUnderscore($viewDir . ($viewDir === '' ? '' : '/'));
        $this->viewName = TextUtils::hyphenToUnderscore($viewName);
        $this->pathFallbacks = array_reverse(ArrayUtils::consecutiveSlices('/', $viewDir));

        if ($viewTabName === null) {
            return;
        }

        \define('CURRENT_TAB', $viewTabName);
    }

    private function resolveRelativePath(string $baseDir, string $file): ?string
    {
        foreach ($this->pathFallbacks as $dirSlice) {
            $relFilePath = $dirSlice . $file;

            if (!file_exists($baseDir . '/' . $relFilePath)) {
                continue;
            }

            return $relFilePath;
        }

        return null;
    }

    private function resolveViewFilePath(string $viewFilename, bool $useFallbacks = true): string
    {
        $file = $viewFilename . ViewPaths::VIEWS_FILE_EXT;

        if ($useFallbacks) {
            $resolvedPath = $this->resolveRelativePath(ViewPaths::VIEWS_DIR, $file);
        } else {
            $resolvedPath = $this->viewDir . $file;
        }

        return ViewPaths::VIEWS_DIR . '/' . $resolvedPath;
    }

    private function buildCSSLinkTag(string $cssFilename, bool $useFallbacks = true): string
    {
        $filename = $cssFilename . ViewPaths::CSS_FILE_EXT;

        if ($useFallbacks) {
            $resolvedPath = $this->resolveRelativePath(ViewPaths::CSS_DIR, $filename);
        } else {
            $resolvedPath = $this->viewDir . $filename;
            if (!file_exists(ViewPaths::CSS_DIR . '/' . $resolvedPath)) {
                $resolvedPath = null;
            }
        }

        if ($resolvedPath === null) {
            return '';
        }

        return \sprintf(
            self::CSS_LINK_TEMPLATE,
            ViewPaths::CSS_DIR_NAME . '/' . $resolvedPath,
        );
    }

    private function buildScriptTag(string $jsFilename, bool $useFallbacks = true): string
    {
        $filename = $jsFilename . ViewPaths::JS_FILE_EXT;

        if ($useFallbacks) {
            $resolvedPath = $this->resolveRelativePath(ViewPaths::JS_DIR, $filename);
        } else {
            $resolvedPath = $this->viewDir . $filename;
            if (!file_exists(ViewPaths::JS_DIR . '/' . $resolvedPath)) {
                $resolvedPath = null;
            }
        }

        if ($resolvedPath === null) {
            return '';
        }

        return \sprintf(
            self::SCRIPT_TEMPLATE,
            ViewPaths::JS_DIR_NAME . '/' . $resolvedPath
        );
    }

    public function switchToJsonMode(): void
    {
        if ($this->jsonMode) {
            return;
        }

        $this->jsonMode = true;

        // Only clean output buffers if any exist
        while (ob_get_level() > 0) {
            @ob_end_clean();
        }

        // Only send header if not already sent
        if (!headers_sent()) {
            header(HeaderType::Json->header());
        }
    }

    public function render(array $viewData = []): void
    {
        if ($this->jsonMode) {
            return;
        }

        $viewName = $this->viewName;

        // Include header
        include $this->resolveViewFilePath(ViewPaths::PARTIAL_HEADER_FILENAME);

        // Add css links
        echo "\n" . $this->buildCSSLinkTag(ViewPaths::PARTIAL_HEADER_FILENAME);
        echo $this->buildCSSLinkTag(ViewPaths::PARTIAL_NAV_FILENAME);
        echo $this->buildCSSLinkTag($viewName, useFallbacks: false);
        echo $this->buildCSSLinkTag(ViewPaths::PARTIAL_FOOTER_FILENAME);

        // Include nav
        include $this->resolveViewFilePath(ViewPaths::PARTIAL_NAV_FILENAME);

        // Include view
        $viewFilePath = $this->resolveViewFilePath($viewName, useFallbacks: false);
        if (file_exists($viewFilePath)) {
            extract($viewData, EXTR_SKIP);
            echo "\n";
            include $viewFilePath;
        } else {
            echo new Alert(
                message: 'View file not found: ' . htmlspecialchars($viewName)
            );
        }

        // Add js scripts
        echo $this->buildScriptTag(ViewPaths::PARTIAL_HEADER_FILENAME);
        echo $this->buildScriptTag(ViewPaths::PARTIAL_NAV_FILENAME);
        echo $this->buildScriptTag($viewName, useFallbacks: false);
        echo $this->buildScriptTag(ViewPaths::PARTIAL_FOOTER_FILENAME) . "\n";

        // Include footer
        include $this->resolveViewFilePath(ViewPaths::PARTIAL_FOOTER_FILENAME);
    }
}
