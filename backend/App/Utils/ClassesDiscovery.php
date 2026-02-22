<?php

declare(strict_types=1);

namespace App\Utils;

use App\Controllers\BaseController;

class ClassesDiscovery
{
    private const BAD_CHARACTERS = '\/.';
    private const FILE_EXTENSION = '.php';

    public function __construct(
        private string $path,
        private string $filesSuffix = '',
        private string $namespacePrefix = ''
    ) {
        $this->path = rtrim($path, self::BAD_CHARACTERS);
        $this->filesSuffix = TextUtils::removeSuffix($filesSuffix, self::FILE_EXTENSION) . self::FILE_EXTENSION;
        $this->namespacePrefix = trim($namespacePrefix, self::BAD_CHARACTERS);
    }

    public function discover(): array
    {
        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($this->path)
        );

        $classes = [];
        foreach ($files as $file) {
            $class = self::resolveClassName($file);
            if (!is_subclass_of($class, BaseController::class)) {
                continue;
            }

            $classes[] = $class;
        }

        return $classes;
    }

    private function resolveClassName(\SplFileInfo $file): ?string
    {
        $filename = $file->getFilename();
        if (!str_ends_with($filename, $this->filesSuffix)) {
            return null;
        }

        // Get class name
        $relative = TextUtils::removePrefix($file->getPathname(), $this->path);
        $relative = TextUtils::removeSuffix($relative, self::FILE_EXTENSION);
        $className = $this->namespacePrefix . $relative;

        return class_exists($className) ? $className : null;
    }
}
