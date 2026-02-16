<?php
$finder = PhpCsFixer\Finder::create()
    ->in([__DIR__ . '/src'])
    ->name('*.php')
    ->exclude('.*', 'vendor', 'tests');

$config = new PhpCsFixer\Config();
return $config
    ->setRules([
        '@PSR12' => true,
        'array_syntax' => ['syntax' => 'short'],
        'binary_operator_spaces' => ['default' => 'single_space'],
        'blank_line_after_namespace' => true,
        'blank_line_after_opening_tag' => true,
        'declare_strict_types' => true,
        'no_unused_imports' => true,
        'ordered_imports' => ['sort_algorithm' => 'alpha'],
        'no_superfluous_phpdoc_tags' => true,
        'strict_param' => true,
        'strict_comparison' => true,
        'no_trailing_whitespace_in_string' => true,
        'phpdoc_no_empty_return' => true,
        'single_quote' => true,
    ])
    ->setFinder($finder)
    ->setRiskyAllowed(true);
