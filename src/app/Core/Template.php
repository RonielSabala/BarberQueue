<?php

namespace App\Core;


const _VIEWS_DIR = __DIR__ . "/../../public/views";
const _VIEWS_CONTENT_DIR = __DIR__ . "/../../public";
const _JSON_HEADER = "Content-Type: application/json; charset=utf-8";

class Template
{
    static public $partialViewsPath = '';
    static public $viewPath = '';
    private static bool $jsonMode = false;

    public static function enableJsonMode()
    {
        self::$jsonMode = true;
        ob_end_clean();
        header(_JSON_HEADER);
    }

    private static function setPartialsPath()
    {
        $relative = trim(self::$partialViewsPath ?? '', '/');
        $parts = $relative === '' ? [] : explode('/', $relative);

        // Recorremos desde el path completo hacia arriba hasta 0 niveles
        $found = false;
        for ($i = count($parts); $i >= 0; $i--) {
            $sub = $i > 0 ? implode('/', array_slice($parts, 0, $i)) : '';
            $try = _VIEWS_DIR . ($sub !== '' ? '/' . $sub : '') . '/_partials';

            if (is_dir($try)) {
                self::$partialViewsPath = $try;
                $found = true;
                break;
            }
        }

        // Partials por defecto
        if (!$found) {
            self::$partialViewsPath = _VIEWS_DIR . '/_partials';
        }
    }

    private function includePartialView(string $partialViewPath)
    {
        $file_path = self::$partialViewsPath . $partialViewPath;
        if (!file_exists($file_path)) {
            $file_path = _VIEWS_DIR . '/_partials/' . $partialViewPath;
        }

        include $file_path;
    }

    public function __construct()
    {
        if (self::$jsonMode) {
            return;
        }

        $path = self::$partialViewsPath;

        // Include partials
        self::setPartialsPath();
        self::includePartialView('/' . '_header.php');
        self::includePartialView('/' . '_nav.php');

        // Include CSS and JS of partials if exits
        $cssPath = _VIEWS_CONTENT_DIR . '/' . 'css' . '/' . $path . '/' . 'main' . '.css';
        if (file_exists($cssPath)) {
            echo '
            <link rel="stylesheet" href="/css/' . $path . '/main.css">
            ';
        }

        $jsPath = _VIEWS_CONTENT_DIR . '/' . 'js' . '/' . $path . '/' . 'main' . '.js';
        if (file_exists($jsPath)) {
            echo '<script src="/js/' . $path . '/main.js"></script>';
        }
    }

    public function __destruct()
    {
        if (self::$jsonMode) {
            return;
        }

        self::includePartialView('/' . '_footer.php');
    }

    public function apply(array $data = [])
    {
        if (self::$jsonMode) {
            return;
        }

        $view_path = self::$viewPath;

        // Include view components if exists

        // Include CSS
        $css_path = _VIEWS_CONTENT_DIR . '/' . 'css' . '/' . $view_path . '.css';
        if (file_exists($css_path)) {
            echo '
            <link rel="stylesheet" href="/css/' . $view_path . '.css">
            ';
        }

        // Include view
        $file_path = _VIEWS_DIR . '/' . $view_path . '.php';
        if (file_exists($file_path)) {
            extract($data, EXTR_SKIP);
            include $file_path;
        }

        // Include JS
        $js_path = _VIEWS_CONTENT_DIR . '/' . 'js' . '/' . $view_path . '.js';
        if (file_exists($js_path)) {
            echo '
            <script src="/js/' . $view_path . '.js"></script>
            ';
        }
    }
}
