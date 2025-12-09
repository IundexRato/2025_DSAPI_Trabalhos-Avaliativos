<?php
include_once '../config/Database.php';
include_once '../models/VocationalModel.php';

class VocationalController {
    private $model;

    public function __construct() {
        $database = new Database();
        $db = $database->getConnection();
        $this->model = new VocationalModel($db);
    }

    private function getJson() {
        return json_decode(file_get_contents('php://input'), true);
    }

    public function handleRequest($acao, $method) {
        $input = $this->getJson();

        switch ($acao) {
            case 'login':
                if ($method == 'POST') {
                    $res = $this->model->criarUsuario($input['nome'] ?? '');
                    echo json_encode($res ? $res : ["erro" => "Falha no login"]);
                }
                break;

            case 'listarPerguntas':
                if ($method == 'GET') {
                    echo json_encode($this->model->listarPerguntas());
                }
                break;

            case 'adicionarPergunta':
                if ($method == 'POST') {
                    $res = $this->model->criarPergunta($input['texto'], $input['categoria'], $input['ordem'] ?? 99);
                    echo json_encode($res ? ["sucesso" => true] : ["erro" => "Erro ao criar"]);
                }
                break;

            case 'editarPergunta':
                if ($method == 'PUT') {
                    $res = $this->model->editarPergunta($input['id'], $input['texto'], $input['categoria']);
                    echo json_encode($res ? ["sucesso" => true] : ["erro" => "Erro ao editar"]);
                }
                break;

            case 'excluirPergunta':
                $id = $input['id'] ?? $_GET['id'] ?? 0;
                $res = $this->model->excluirPergunta($id);
                echo json_encode($res ? ["sucesso" => true] : ["erro" => "Erro ao excluir"]);
                break;

            case 'salvarResultado':
                if ($method == 'POST') {
                    $res = $this->model->salvarHistorico($input['usuario_id'], $input['titulo'], $input['descricao'], $input['pontuacao']);
                    echo json_encode($res ? ["sucesso" => true] : ["erro" => "Erro ao salvar"]);
                }
                break;

            case 'listarHistorico':
                if ($method == 'GET') {
                    $uid = $_GET['usuario_id'] ?? 0;
                    echo json_encode($this->model->listarHistorico($uid));
                }
                break;
            
            case 'popularBanco':
                if ($method == 'POST') {
                    foreach ($input as $p) {
                        $this->model->criarPergunta($p['texto'], $p['categoria'], $p['ordem']);
                    }
                    echo json_encode(["sucesso" => true]);
                }
                break;

            default:
                echo json_encode(["erro" => "Ação inválida"]);
                break;
        }
    }
}
?>