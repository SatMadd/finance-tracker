<?php

// Vercel serverless execution environment has a read-only filesystem except /tmp.
// Ensure all required writable directories exist in /tmp.
$storagePath = '/tmp/storage';
$cachePath = '/tmp/bootstrap/cache';

$directories = [
    $storagePath.'/framework/views',
    $storagePath.'/framework/cache',
    $storagePath.'/framework/cache/data',
    $storagePath.'/framework/sessions',
    $storagePath.'/logs',
    $cachePath,
];

foreach ($directories as $dir) {
    if (! is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

// Redirect Laravel paths to writable /tmp locations
putenv('LARAVEL_STORAGE_PATH='.$storagePath);
$_ENV['LARAVEL_STORAGE_PATH'] = $storagePath;
$_SERVER['LARAVEL_STORAGE_PATH'] = $storagePath;

putenv('APP_CONFIG_CACHE='.$cachePath.'/config.php');
$_ENV['APP_CONFIG_CACHE'] = $cachePath.'/config.php';
$_SERVER['APP_CONFIG_CACHE'] = $cachePath.'/config.php';

putenv('APP_SERVICES_CACHE='.$cachePath.'/services.php');
$_ENV['APP_SERVICES_CACHE'] = $cachePath.'/services.php';
$_SERVER['APP_SERVICES_CACHE'] = $cachePath.'/services.php';

putenv('APP_PACKAGES_CACHE='.$cachePath.'/packages.php');
$_ENV['APP_PACKAGES_CACHE'] = $cachePath.'/packages.php';
$_SERVER['APP_PACKAGES_CACHE'] = $cachePath.'/packages.php';

putenv('APP_ROUTES_CACHE='.$cachePath.'/routes.php');
$_ENV['APP_ROUTES_CACHE'] = $cachePath.'/routes.php';
$_SERVER['APP_ROUTES_CACHE'] = $cachePath.'/routes.php';

putenv('APP_EVENTS_CACHE='.$cachePath.'/events.php');
$_ENV['APP_EVENTS_CACHE'] = $cachePath.'/events.php';
$_SERVER['APP_EVENTS_CACHE'] = $cachePath.'/events.php';

putenv('VIEW_COMPILED_PATH='.$storagePath.'/framework/views');
$_ENV['VIEW_COMPILED_PATH'] = $storagePath.'/framework/views';
$_SERVER['VIEW_COMPILED_PATH'] = $storagePath.'/framework/views';

// Forward request to Laravel's front controller
require __DIR__.'/../public/index.php';
