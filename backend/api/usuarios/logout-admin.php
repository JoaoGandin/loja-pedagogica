<?php
/**
 * Logout de Administrador
 * E-commerce de Materiais Pedagógicos
 * 
 * Endpoint: GET /backend/api/usuarios/logout-admin.php
 * Destrói a sessão do administrador
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
        'sucesso' => false,
        'mensagem' => 'Método HTTP não permitido. Use GET.'
    ]);
    exit();
}

// Destruir a sessão
session_destroy();

// Retornar sucesso
http_response_code(200);
echo json_encode([
    'sucesso' => true,
    'mensagem' => 'Logout realizado com sucesso!'
]);

exit();
?>
