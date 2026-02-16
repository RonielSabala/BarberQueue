<?php

declare(strict_types=1);

namespace App\Core;

use App\Domain\HeaderType;
use App\Utils\ArrayUtils;

class Constants
{
    private const VIEWS_DIR_NAME = 'views';
    public const VIEWS_FILE_EXT = '.php';

    public const CSS_DIR_NAME = 'css';
    public const CSS_FILE_EXT = '.css';

    public const JS_DIR_NAME = 'js';
    public const JS_FILE_EXT = '.js';

    public const PARTIALS_DIR_NAME = '_partials';
    public const PARTIAL_HEADER_FILENAME = self::PARTIALS_DIR_NAME . '/_header';
    public const PARTIAL_NAV_FILENAME = self::PARTIALS_DIR_NAME . '/_nav';
    public const PARTIAL_FOOTER_FILENAME = self::PARTIALS_DIR_NAME . '/_footer';

    public const VIEWS_DIR = PUBLIC_DIR . '/' . self::VIEWS_DIR_NAME;
    public const CSS_DIR = PUBLIC_DIR . '/' . self::CSS_DIR_NAME;
    public const JS_DIR = PUBLIC_DIR . '/' . self::JS_DIR_NAME;
}

class Template
{
    public static string $viewDir = '';
    public static string $viewName = '';
    private static array $dirSlices = [];
    private static bool $jsonMode = false;

    public static function config($viewDir, $viewName): void
    {
        self::$viewDir = $viewDir;
        self::$viewName = $viewName;
        self::$dirSlices = array_reverse(ArrayUtils::consecutiveSlices('/', self::$viewDir));
    }

    public static function enableJsonMode(): void
    {
        if (self::$jsonMode) {
            return;
        }

        self::$jsonMode = true;

        // Only clean output buffers if any exist
        while (ob_get_level() > 0) {
            @ob_end_clean();
        }

        // Only send header if not already sent
        if (!headers_sent()) {
            header(HeaderType::Json->header());
        }
    }

    private function getFilePath(string $file): string
    {
        return self::$viewDir . (self::$viewDir === '' ? '' : '/') . $file;
    }

    private function findRelativeFilePath(string $baseDir, string $file): ?string
    {
        foreach (self::$dirSlices as $dirSlice) {
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
        $viewFile = $viewFilename . Constants::VIEWS_FILE_EXT;

        if ($useFallbacks) {
            $relFilePath = self::findRelativeFilePath(Constants::VIEWS_DIR, $viewFile);
        } else {
            $relFilePath = self::getFilePath($viewFile);
        }

        return Constants::VIEWS_DIR . '/' . $relFilePath;
    }

    private function getCSSLink(string $cssFilename, bool $useFallbacks = true): string
    {
        $cssFile = $cssFilename . Constants::CSS_FILE_EXT;

        if ($useFallbacks) {
            $relFilePath = self::findRelativeFilePath(Constants::CSS_DIR, $cssFile);
        } else {
            $relFilePath = self::getFilePath($cssFile);
            if (!file_exists(Constants::CSS_DIR . '/' . $relFilePath)) {
                $relFilePath = null;
            }
        }

        if ($relFilePath === null) {
            return '';
        }

        return \sprintf(
            '<link rel="stylesheet" href="/%s">',
            Constants::CSS_DIR_NAME . '/' . $relFilePath,
        ) . "\n";
    }

    private function getJSScript(string $jsFilename, bool $useFallbacks = true): string
    {
        $jsFile = $jsFilename . Constants::JS_FILE_EXT;

        if ($useFallbacks) {
            $relFilePath = self::findRelativeFilePath(Constants::JS_DIR, $jsFile);
        } else {
            $relFilePath = self::getFilePath($jsFile);
            if (!file_exists(Constants::JS_DIR . '/' . $relFilePath)) {
                $relFilePath = null;
            }
        }

        if ($relFilePath === null) {
            return '';
        }

        return "\n" . \sprintf(
            '<script src="/%s"></script>',
            Constants::JS_DIR_NAME . '/' . $relFilePath,
        );
    }

    public function __construct()
    {
        if (self::$jsonMode) {
            return;
        }

        // Add css links
        echo self::getCSSLink(Constants::PARTIAL_HEADER_FILENAME);
        echo self::getCSSLink(Constants::PARTIAL_NAV_FILENAME);
        echo self::getCSSLink(self::$viewName, useFallbacks: false);
        echo self::getCSSLink(Constants::PARTIAL_FOOTER_FILENAME);

        // Include header and nav
        include self::getViewFilePath(Constants::PARTIAL_HEADER_FILENAME);
        include self::getViewFilePath(Constants::PARTIAL_NAV_FILENAME);
    }

    public function apply(array $data = []): void
    {
        if (self::$jsonMode) {
            return;
        }

        // Include view
        $viewFilePath = self::getViewFilePath(self::$viewName, useFallbacks: false);
        if (file_exists($viewFilePath)) {
            extract($data, EXTR_SKIP);
            include $viewFilePath;
        }
    }

    public function __destruct()
    {
        if (self::$jsonMode) {
            return;
        }

        // Include footer
        include self::getViewFilePath(Constants::PARTIAL_FOOTER_FILENAME);

        // Add js scripts
        echo self::getJSScript(Constants::PARTIAL_HEADER_FILENAME);
        echo self::getJSScript(Constants::PARTIAL_NAV_FILENAME);
        echo self::getJSScript(self::$viewName, useFallbacks: false);
        echo self::getJSScript(Constants::PARTIAL_FOOTER_FILENAME);
    }
}
