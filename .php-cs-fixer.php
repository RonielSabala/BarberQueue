<?php

declare(strict_types=1);

use PhpCsFixer\{Config, Finder};
use PhpCsFixer\Runner\Parallel\ParallelConfigFactory;

$finder = Finder::create()
    ->in([__DIR__ . '/src', __DIR__ . '/public'])
    ->name('*.php')
    ->ignoreDotFiles(true)
    ->ignoreVCS(true)
    ->exclude('vendor')
;

return (new Config())
    ->setRiskyAllowed(true)
    ->setUsingCache(true)
    ->setCacheFile(__DIR__ . '/.php-cs-fixer.cache')
    ->setParallelConfig(ParallelConfigFactory::detect())
    ->setRules([
        '@PhpCsFixer' => true,
        '@PhpCsFixer:risky' => true,

        // --- Overrides ---

        // Formatting preferences
        'yoda_style' => false,
        'concat_space' => ['spacing' => 'one'],
        'single_quote' => ['strings_containing_single_quote_chars' => true],
        'blank_line_before_statement' => ['statements' => []],
        'no_whitespace_before_comma_in_array' => ['after_heredoc' => true],
        'method_argument_space' => ['on_multiline' => 'ensure_fully_multiline', 'keep_multiple_spaces_after_comma' => false, 'attribute_placement' => 'ignore', 'after_heredoc' => true],

        // Imports
        'group_import' => true,
        'single_import_per_statement' => false,
        'ordered_imports' => ['sort_algorithm' => 'alpha'],
        'fully_qualified_strict_types' => ['import_symbols' => true, 'leading_backslash_in_global_namespace' => true],

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
    ])
    ->setFinder($finder)
;
