<?php

declare(strict_types=1);

namespace App\Core;

use App\Domain\HeaderType;
use App\Utils\ArrayUtils;

class ViewConstants
{
    private const DIR_NAME = 'views';
    public const FILE_EXT = '.php';

    public const CSS_DIR_NAME = 'css';
    public const CSS_FILE_EXT = '.css';

    public const JS_DIR_NAME = 'js';
    public const JS_FILE_EXT = '.js';

    public const PARTIALS_DIR_NAME = '_partials';
    public const PARTIAL_HEADER_FILENAME = self::PARTIALS_DIR_NAME . '/_header';
    public const PARTIAL_NAV_FILENAME = self::PARTIALS_DIR_NAME . '/_nav';
    public const PARTIAL_FOOTER_FILENAME = self::PARTIALS_DIR_NAME . '/_footer';

    public const VIEWS_DIR = PUBLIC_DIR . '/' . self::DIR_NAME;
    public const CSS_DIR = PUBLIC_DIR . '/' . self::CSS_DIR_NAME;
    public const JS_DIR = PUBLIC_DIR . '/' . self::JS_DIR_NAME;
}

class View
{
    private bool $jsonMode = false;
    private array $dirSlices = [];

    public function __construct(
        public string $viewDir,
        public string $viewName
    ) {
        $this->viewDir = $viewDir . ($viewDir === '' ? '' : '/');
        $this->viewName = $viewName;
        $this->dirSlices = array_reverse(ArrayUtils::consecutiveSlices('/', $viewDir));
    }

    private function findRelativeFilePath(string $baseDir, string $file): ?string
    {
        foreach ($this->dirSlices as $dirSlice) {
            $relFilePath = $dirSlice . $file;
            if (!file_exists($baseDir . '/' . $relFilePath)) {
                continue;
            }

            return $relFilePath;
        }

        return null;
    }

    private function getViewFilePath(string $viewFilename, bool $useFallbacks = true): string
    {
        $viewFile = $viewFilename . ViewConstants::FILE_EXT;

        if ($useFallbacks) {
            $relFilePath = $this->findRelativeFilePath(ViewConstants::VIEWS_DIR, $viewFile);
        } else {
            $relFilePath = $this->viewDir . $viewFile;
        }

        return ViewConstants::VIEWS_DIR . '/' . $relFilePath;
    }

    private function getCSSLink(string $cssFilename, bool $useFallbacks = true): string
    {
        $cssFile = $cssFilename . ViewConstants::CSS_FILE_EXT;

        if ($useFallbacks) {
            $relFilePath = $this->findRelativeFilePath(ViewConstants::CSS_DIR, $cssFile);
        } else {
            $relFilePath = $this->viewDir . $cssFile;
            if (!file_exists(ViewConstants::CSS_DIR . '/' . $relFilePath)) {
                $relFilePath = null;
            }
        }

        if ($relFilePath === null) {
            return '';
        }

        return \sprintf(
            '<link rel="stylesheet" href="/%s">',
            ViewConstants::CSS_DIR_NAME . '/' . $relFilePath,
        ) . "\n";
    }

    private function getJSScript(string $jsFilename, bool $useFallbacks = true): string
    {
        $jsFile = $jsFilename . ViewConstants::JS_FILE_EXT;

        if ($useFallbacks) {
            $relFilePath = $this->findRelativeFilePath(ViewConstants::JS_DIR, $jsFile);
        } else {
            $relFilePath = $this->viewDir . $jsFile;
            if (!file_exists(ViewConstants::JS_DIR . '/' . $relFilePath)) {
                $relFilePath = null;
            }
        }

        if ($relFilePath === null) {
            return '';
        }

        return "\n" . \sprintf(
            '<script src="/%s"></script>',
            ViewConstants::JS_DIR_NAME . '/' . $relFilePath,
        );
    }

    public function enableJsonMode(): void
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

    public function render(array $data = []): void
    {
        if ($this->jsonMode) {
            return;
        }

        // Add css links
        echo $this->getCSSLink(ViewConstants::PARTIAL_HEADER_FILENAME);
        echo $this->getCSSLink(ViewConstants::PARTIAL_NAV_FILENAME);
        echo $this->getCSSLink($this->viewName, useFallbacks: false);
        echo $this->getCSSLink(ViewConstants::PARTIAL_FOOTER_FILENAME);

        // Include header
        include $this->getViewFilePath(ViewConstants::PARTIAL_HEADER_FILENAME);

        // Include nav
        include $this->getViewFilePath(ViewConstants::PARTIAL_NAV_FILENAME);

        // Include view
        $viewFilePath = $this->getViewFilePath($this->viewName, useFallbacks: false);
        if (file_exists($viewFilePath)) {
            extract($data, EXTR_SKIP);
            include $viewFilePath;
        }

        // Include footer
        include $this->getViewFilePath(ViewConstants::PARTIAL_FOOTER_FILENAME);

        // Add js scripts
        echo $this->getJSScript(ViewConstants::PARTIAL_HEADER_FILENAME);
        echo $this->getJSScript(ViewConstants::PARTIAL_NAV_FILENAME);
        echo $this->getJSScript($this->viewName, useFallbacks: false);
        echo $this->getJSScript(ViewConstants::PARTIAL_FOOTER_FILENAME);
    }
}
