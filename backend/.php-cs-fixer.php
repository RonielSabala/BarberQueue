<?php

declare(strict_types=1);

use PhpCsFixer\{Config, Finder};
use PhpCsFixer\Runner\Parallel\ParallelConfig;

$finder = Finder::create()
    ->files()
    ->in(__DIR__ . '/App')
    ->in(__DIR__ . '/../scripts')
    ->name('*.php')
    ->ignoreDotFiles(true)
    ->ignoreVCS(true)
    ->exclude([
        'vendor',
        'storage',
        'cache',
        'node_modules',
    ])
;

return (new Config())
    ->setRiskyAllowed(true)
    ->setUsingCache(true)
    ->setCacheFile(__DIR__ . '/.php-cs-fixer.cache')
    ->setParallelConfig(new ParallelConfig(4, 20))
    ->setRules([
        '@PhpCsFixer' => true,
        '@PhpCsFixer:risky' => true,

        // Formatting preferences
        'yoda_style' => false,
        'simplified_if_return' => true,
        'ternary_to_null_coalescing' => true,
        'assign_null_coalescing_to_coalesce_equal' => true,
        'echo_tag_syntax' => ['format' => 'short', 'shorten_simple_statements_only' => false],
        'concat_space' => ['spacing' => 'one'],
        'single_quote' => ['strings_containing_single_quote_chars' => true],
        'blank_line_before_statement' => ['statements' => []],
        'no_whitespace_before_comma_in_array' => ['after_heredoc' => true],
        'method_argument_space' => [
            'on_multiline' => 'ensure_fully_multiline',
            'keep_multiple_spaces_after_comma' => false,
            'attribute_placement' => 'ignore',
            'after_heredoc' => true,
        ],

        // Imports
        'group_import' => true,
        'single_import_per_statement' => false,
        'ordered_imports' => ['sort_algorithm' => 'alpha'],
        'fully_qualified_strict_types' => [
            'import_symbols' => true,
            'leading_backslash_in_global_namespace' => true,
        ],

        // Disable overly strict rules
        'ordered_class_elements' => false,

        // Type hints
        'declare_strict_types' => true,
        'type_declaration_spaces' => ['elements' => ['function', 'property', 'constant']],
        'nullable_type_declaration_for_default_null_value' => true,
        'void_return' => ['fix_lambda' => true],

        // Modernization
        'dir_constant' => true,
        'no_php4_constructor' => true,
        'use_arrow_functions' => true,
        'modernize_strpos' => ['modernize_stripos' => true],
    ])
    ->setFinder($finder)
;
