<?php

require_once __DIR__ . '/vendor/autoload.php';

ini_set('memory_limit', '1G');

function main() {
  global $argv;

  $dirPath = $argv[1];
  $feedType = $argv[2];
  $limit = isset($argv[3]) ? (int) $argv[3] : null;
  $matchedFiles = array_slice(glob("$dirPath/*.$feedType"), 0, $limit);

  foreach ($matchedFiles as $filePath) {
    $fileData = file_get_contents($filePath);
    $feed = new SimplePie\SimplePie();
    $feed->set_raw_data($fileData);
    $feed->init();
  }
}

main();
