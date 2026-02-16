<?php
$finder = PhpCsFixer\Finder::create()
    ->in([__DIR__ . '/src'])
    ->name('*.php');

$config = new PhpCsFixer\Config();
return $config
    ->setRules([
        // Rule sets
        '@PSR12' => true,
        '@Symfony' => true,
        '@PhpCsFixer' => true,

        // Formatting
        'array_syntax' => ['syntax' => 'short'],
        'binary_operator_spaces' => ['default' => 'single_space'],
        'concat_space' => ['spacing' => 'one'],
        'single_quote' => true,
        'line_ending' => true,
        'no_trailing_whitespace' => true,
        'single_blank_line_at_eof' => true,
        'blank_line_after_namespace' => true,
        'blank_line_after_opening_tag' => true,
        'trim_array_spaces' => true,
        'blank_line_before_statement' => ['statements' => []],
        'no_whitespace_before_comma_in_array' => true,
        'method_argument_space' => ['on_multiline' => 'ensure_fully_multiline'],
        'yoda_style' => [
            'equal' => false,
            'identical' => false,
            'less_and_greater' => false,
        ],

        // Structure
        'no_useless_else' => true,
        'no_useless_return' => true,
        'control_structure_braces' => true,
        'no_empty_statement' => true,

        // Imports / ordering / namespaces
        'no_unused_imports' => true,
        'ordered_imports' => ['sort_algorithm' => 'alpha'],
        'ordered_class_elements' => false,
        'group_import' => true,
        'single_import_per_statement' => false,
        'fully_qualified_strict_types' => ['leading_backslash_in_global_namespace' => true],
        'no_leading_import_slash' => true,
        'no_unneeded_import_alias' => true,

        // Type hints
        'declare_strict_types' => true,
        'return_type_declaration' => true,
        'type_declaration_spaces' => ['elements' => ['function', 'property']],
        'nullable_type_declaration_for_default_null_value' => true,
        'void_return' => ['fix_lambda' => true],

        // Modernization
        'modernize_strpos' => true,
        'modernize_types_casting' => true,
        'dir_constant' => true,
        'no_php4_constructor' => true,

        // Strictness
        'strict_param' => true,
        'strict_comparison' => true,
        'no_trailing_whitespace_in_string' => true,

        // PHPDoc hygiene
        'no_superfluous_phpdoc_tags' => [
            'allow_hidden_params' => true,
            'remove_inheritdoc' => true,
        ],
        'phpdoc_no_empty_return' => true,

        // Readability
        'no_unneeded_braces' => ['namespaces' => true],
        'no_trailing_comma_in_singleline_array' => true,

        // Performance
        'fopen_flags' => true,
        'explicit_string_variable' => true,
        'dir_constant' => true,

        // Safety
        'no_leading_namespace_whitespace' => true,
        'no_trailing_whitespace_in_comment' => true,
        'no_whitespace_in_blank_line' => true,
    ])
    ->setFinder($finder)
    ->setRiskyAllowed(true);
