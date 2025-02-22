<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Pour répondre aux requêtes préliminaires CORS
    exit(0);
}

require_once(__DIR__ . '/mysql.php');


// Récupérer les données POST
$input = json_decode(file_get_contents('php://input'), true);
$name = $input['name'];
$score = $input['score'];

if (isset($name) && isset($score)) {
    $addScoresStmt = $mysqlClient->prepare("INSERT INTO Scores (name, score, date) VALUES (:name, :score, NOW())");
    $addScoresStmt->execute([
        'name' => $name,
        'score' => $score
    ]);
    echo json_encode(['success' => true, 'message' => 'Score ajouté avec succès']);
} else {
    echo json_encode(['success' => false, 'message' => 'Nom et score requis']);
}
