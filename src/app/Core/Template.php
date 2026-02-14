<?php

declare(strict_types=1);

namespace App\Core;

const _VIEWS_DIR_NAME = 'views';
const _CSS_DIR_NAME = 'css';
const _JS_DIR_NAME = 'js';
const _PARTIALS_DIR_NAME = '_partials';

const _VIEWS_FILE_EXTENSION = '.php';
const _CSS_FILE_EXTENSION = '.css';
const _JS_FILE_EXTENSION = '.js';

const _PUBLIC_DIR = SRC_DIR . '/' . 'public';
const _VIEWS_DIR = _PUBLIC_DIR . '/' . _VIEWS_DIR_NAME;
const _CSS_DIR = _PUBLIC_DIR . '/' . _CSS_DIR_NAME;
const _JS_DIR = _PUBLIC_DIR . '/' . _JS_DIR_NAME;

const _PARTIALS_DIR = _VIEWS_DIR . '/' . _PARTIALS_DIR_NAME;
const _PARTIAL_HEADER_FILENAME = _PARTIALS_DIR_NAME . '/' . '_header';
const _PARTIAL_NAV_FILENAME = _PARTIALS_DIR_NAME . '/' . '_nav';
const _PARTIAL_FOOTER_FILENAME = _PARTIALS_DIR_NAME . '/' . '_footer';

const _JSON_HEADER = 'Content-Type: application/json; charset=utf-8';

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
            header(_JSON_HEADER);
        }
    }

    private function getViewFilePath(string $viewFilename): string
    {
        return _VIEWS_DIR . '/' . self::$viewDir . '/' . $viewFilename . _VIEWS_FILE_EXTENSION;
    }

    private function getCSSLink(string $cssFilename): string
    {
        $filePath = self::$viewDir . (self::$viewDir === '' ? '' : '/') . $cssFilename . _CSS_FILE_EXTENSION;
        if (!file_exists(_CSS_DIR . '/' . $filePath)) {
            return '';
        }

        return '<link rel="stylesheet" href="/' . _CSS_DIR_NAME . '/' . $filePath . '">' . "\n";
    }

    private function getJSScript(string $jsFilename): string
    {
        $filePath = self::$viewDir . (self::$viewDir === '' ? '' : '/') . $jsFilename . _JS_FILE_EXTENSION;
        if (!file_exists(_JS_DIR . '/' . $filePath)) {
            return '';
        }

        return "\n" . '<script src="/' . _JS_DIR_NAME . '/' . $filePath . '"></script>';
    }

    public function __construct()
    {
        if (self::$jsonMode) {
            return;
        }

        // Add css links
        echo self::getCSSLink(_PARTIAL_HEADER_FILENAME);
        echo self::getCSSLink(_PARTIAL_NAV_FILENAME);
        echo self::getCSSLink(self::$viewName);
        echo self::getCSSLink(_PARTIAL_FOOTER_FILENAME);

        // Include header and nav
        include self::getViewFilePath(_PARTIAL_HEADER_FILENAME);
        include self::getViewFilePath(_PARTIAL_NAV_FILENAME);
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
        include self::getViewFilePath(_PARTIAL_FOOTER_FILENAME);

        // Add js scripts
        echo self::getJSScript(_PARTIAL_HEADER_FILENAME);
        echo self::getJSScript(_PARTIAL_NAV_FILENAME);
        echo self::getJSScript(self::$viewName);
        echo self::getJSScript(_PARTIAL_FOOTER_FILENAME);
    }
}
