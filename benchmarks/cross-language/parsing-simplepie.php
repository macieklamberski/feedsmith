<?php

require_once __DIR__ . '/vendor/autoload.php';

ini_set('memory_limit', '1G');

function main() {
  global $argv;

  $dirPath = $argv[1];
  $feedType = $argv[2];
  $matchedFiles = glob("$dirPath/*.$feedType");

  foreach ($matchedFiles as $filePath) {
    $fileData = file_get_contents($filePath);
    $feed = new SimplePie\SimplePie();
    $feed->set_raw_data($fileData);
    $feed->init();
  }
}

main();
