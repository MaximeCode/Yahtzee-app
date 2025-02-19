<?php

define('MYSQL_HOST', getenv('DB_HOST'));
define('MYSQL_PORT', getenv('DB_PORT'));
define('MYSQL_NAME', getenv('DB_NAME'));
define('MYSQL_USER', getenv('DB_USER'));
define('MYSQL_PASSWORD', getenv('DB_PASSWORD'));

try {
  $mysqlClient = new PDO(
    sprintf('mysql:host=%s;dbname=%s;port=%s;charset=utf8', MYSQL_HOST, MYSQL_NAME, MYSQL_PORT),
    MYSQL_USER,
    MYSQL_PASSWORD
  );
  $mysqlClient->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $exception) {
  die('Erreur : ' . $exception->getMessage());
}
