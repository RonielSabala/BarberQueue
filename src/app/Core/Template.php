<?php

declare(strict_types=1);

namespace App\Core;

class Constants
{
    private const VIEWS_DIR_NAME = 'views';
    public const CSS_DIR_NAME = 'css';
    public const JS_DIR_NAME = 'js';
    private const PARTIALS_DIR_NAME = '_partials';

    public const VIEWS_FILE_EXT = '.php';
    public const CSS_FILE_EXT = '.css';
    public const JS_FILE_EXT = '.js';

    private const PUBLIC_DIR = SRC_DIR . '/' . 'public';
    public const VIEWS_DIR = self::PUBLIC_DIR . '/' . self::VIEWS_DIR_NAME;
    public const CSS_DIR = self::PUBLIC_DIR . '/' . self::CSS_DIR_NAME;
    public const JS_DIR = self::PUBLIC_DIR . '/' . self::JS_DIR_NAME;

    public const PARTIAL_HEADER_FILENAME = self::PARTIALS_DIR_NAME . '/' . '_header';
    public const PARTIAL_NAV_FILENAME = self::PARTIALS_DIR_NAME . '/' . '_nav';
    public const PARTIAL_FOOTER_FILENAME = self::PARTIALS_DIR_NAME . '/' . '_footer';

    public const JSON_HEADER = 'Content-Type: application/json; charset=utf-8';
}

class Template
{
    static public string $viewDir = '';
    static public string $viewName = '';
    private static bool $jsonMode = false;

    public static function config($viewDir, $viewName): void
    {
        self::$viewDir = $viewDir;
        self::$viewName = $viewName;
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
            header(Constants::JSON_HEADER);
        }
    }

    private function getViewFilePath(string $viewFilename): string
    {
        return Constants::VIEWS_DIR . '/' . self::$viewDir . '/' . $viewFilename . Constants::VIEWS_FILE_EXT;
    }

    private function getCSSLink(string $cssFilename): string
    {
        $filePath = self::$viewDir . (self::$viewDir === '' ? '' : '/') . $cssFilename . Constants::CSS_FILE_EXT;
        if (!file_exists(Constants::CSS_DIR . '/' . $filePath)) {
            return '';
        }

        return '<link rel="stylesheet" href="/' . Constants::CSS_DIR_NAME . '/' . $filePath . '">' . "\n";
    }

    private function getJSScript(string $jsFilename): string
    {
        $filePath = self::$viewDir . (self::$viewDir === '' ? '' : '/') . $jsFilename . Constants::JS_FILE_EXT;
        if (!file_exists(Constants::JS_DIR . '/' . $filePath)) {
            return '';
        }

        return "\n" . '<script src="/' . Constants::JS_DIR_NAME . '/' . $filePath . '"></script>';
    }

    public function __construct()
    {
        if (self::$jsonMode) {
            return;
        }

        // Add css links
        echo self::getCSSLink(Constants::PARTIAL_HEADER_FILENAME);
        echo self::getCSSLink(Constants::PARTIAL_NAV_FILENAME);
        echo self::getCSSLink(self::$viewName);
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
        $viewFilePath = self::getViewFilePath(self::$viewName);
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
        echo self::getJSScript(self::$viewName);
        echo self::getJSScript(Constants::PARTIAL_FOOTER_FILENAME);
    }
}
