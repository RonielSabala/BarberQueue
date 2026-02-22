<?php

declare(strict_types=1);

namespace App\Core;

class Container
{
    private array $bindings = [];

    /** Resolve a class and autowire its constructor dependencies */
    public function make(string $class): object
    {
        if (isset($this->bindings[$class]) && \is_object($this->bindings[$class])) {
            return $this->bindings[$class];
        }

        $concrete = $this->bindings[$class] ?? $class;
        $reflection = new \ReflectionClass($concrete);
        $constructor = $reflection->getConstructor();

        if ($constructor === null) {
            return $reflection->newInstance();
        }

        $dependencies = array_map(
            fn (\ReflectionParameter $param) => $this->resolveParameter($param),
            $constructor->getParameters()
        );

        return $reflection->newInstanceArgs($dependencies);
    }

    private function resolveParameter(\ReflectionParameter $param): mixed
    {
        $type = $param->getType();
        if ($type instanceof \ReflectionNamedType && !$type->isBuiltin()) {
            return $this->make($type->getName());
        }

        if ($param->isDefaultValueAvailable()) {
            return $param->getDefaultValue();
        }

        throw new \RuntimeException("Cannot resolve parameter: {$param->getName()}");
    }
}
