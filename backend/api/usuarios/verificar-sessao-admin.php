<?php
/**
 * Verificar Sessão de Administrador
 * E-commerce de Materiais Pedagógicos
 * 
 * Endpoint: GET /backend/api/usuarios/verificar-sessao-admin.php
 * Verifica se há uma sessão de administrador ativa
 */

// Iniciar sessão
session_start();

// Definir headers para JSON e CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Verificar se a requisição é OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar se a requisição é GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'logado' => false,
        'mensagem' => 'Método HTTP não permitido. Use GET.'
    ]);
    exit();
}

// Verificar se a sessão de admin está ativa
if (isset($_SESSION['admin_logado']) && $_SESSION['admin_logado'] === true) {
    // Admin está logado
    http_response_code(200);
    echo json_encode([
        'logado' => true,
        'nome' => $_SESSION['admin_nome'] ?? 'Admin',
        'id' => $_SESSION['admin_id'] ?? null
    ]);
} else {
    // Admin não está logado
    http_response_code(200);
    echo json_encode([
        'logado' => false
    ]);
}

exit();
?>
