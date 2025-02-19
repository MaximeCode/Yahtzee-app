<?php

$config = require __DIR__ . '/_config.php';

try {
  $mysqlClient = new PDO(
    sprintf(
      'mysql:host=%s;dbname=%s;port=%s;charset=utf8',
      $config['DB_HOST'],
      $config['DB_NAME'],
      $config['DB_PORT']
    ),
    $config['DB_USER'],
    $config['DB_PASSWORD']
  );
  $mysqlClient->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  echo 'Connexion réussie';
} catch (Exception $exception) {
  die('Erreur : ' . $exception->getMessage());
}
