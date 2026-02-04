<?php

namespace App\Utils;


class GeneralUtils
{
    public static function echoAlert(
        string $message,
        string $type = 'danger',
        string $returnRoute = '',
        bool $showReturn = true
    ) {
        if ($showReturn && empty($returnRoute)) {
            $returnRoute = UriUtils::getNthUri(-2);
        }

        echo "
        <div class='text-center mt-2'>
            <div class='alert alert-$type'>$message</div>";
        if ($showReturn) {
            echo "<a href='$returnRoute' class='btn btn-primary mb-4'>Volver</a>";
        }
        echo "</div>";
    }
}
