<?php

use App\Components\Tab;
use App\Core\{Router, UriCache};
use App\Utils\{TextUtils, UriUtils};

$defaultViewNames = [Router::EMPTY_VIEW_NAME, Router::LEGACY_VIEW_NAME, Router::DEFAULT_VIEW_NAME];

$currentUri = UriCache::getCurrentUri();
$prevUri = UriCache::getPreviousUri();

$currentViewName = UriUtils::getViewParts($currentUri)[1];
$prevViewName = UriUtils::getViewParts($prevUri)[1];

$showTab = !in_array($currentViewName, $defaultViewNames, true) && in_array($prevViewName, $defaultViewNames, true);
$firstTabName = $showTab ? 'Volver atrás' : TextUtils::toTitleCase(Router::DEFAULT_VIEW_NAME);
$firstTabUrl = $showTab ? $prevUri : '/' . Router::DEFAULT_VIEW_NAME;
?>

</head>

<body>
    <div class="container">
        <ul class="nav nav-tabs">
            <!-- First tab -->
            <?= new Tab($currentViewName, $firstTabName, $firstTabUrl); ?>
        </ul>
        <div class="view-content">
            <!-- View content here -->
