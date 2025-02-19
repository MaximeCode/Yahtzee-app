<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Pour répondre aux requêtes préliminaires CORS
    exit(0);
}

require_once(__DIR__ . '/mysql.php');


$scoresStmt = $mysqlClient->prepare("SELECT * FROM Scores order by score DESC ");
$scoresStmt->execute();
$scores = $scoresStmt->fetchAll(PDO::FETCH_ASSOC);

// Envoyer les données sous forme de JSON
header('Content-Type: application/json');
echo json_encode($scores, JSON_PRETTY_PRINT);
