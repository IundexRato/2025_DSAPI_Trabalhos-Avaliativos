<?php
error_reporting(0); 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once 'controllers/VocationalController.php';

$acao = $_GET['acao'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($acao) {
    $controller = new VocationalController();
    $controller->handleRequest($acao, $method);
} else {
    echo json_encode(["status" => "API Online", "versao" => "1.0.0"]);
}
?>