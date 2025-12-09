<?php
class VocationalModel {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function criarUsuario($nome) {
        $nome = $this->conn->real_escape_string($nome);
        $sql = "INSERT INTO usuarios (nome) VALUES ('$nome')";
        if ($this->conn->query($sql)) {
            return ["id" => $this->conn->insert_id, "nome" => $nome];
        }
        $res = $this->conn->query("SELECT id, nome FROM usuarios WHERE nome='$nome' LIMIT 1");
        return $res->fetch_assoc();
    }

    public function listarPerguntas() {
        $res = $this->conn->query("SELECT * FROM perguntas ORDER BY ordem ASC");
        $data = [];
        while ($row = $res->fetch_assoc()) $data[] = $row;
        return $data;
    }

    public function criarPergunta($texto, $cat, $ordem) {
        $texto = $this->conn->real_escape_string($texto);
        $cat = $this->conn->real_escape_string($cat);
        $ordem = (int)$ordem;
        return $this->conn->query("INSERT INTO perguntas (texto, categoria, ordem) VALUES ('$texto', '$cat', $ordem)");
    }

    public function editarPergunta($id, $texto, $cat) {
        $texto = $this->conn->real_escape_string($texto);
        $cat = $this->conn->real_escape_string($cat);
        $id = (int)$id;
        return $this->conn->query("UPDATE perguntas SET texto='$texto', categoria='$cat' WHERE id=$id");
    }

    public function excluirPergunta($id) {
        $id = (int)$id;
        return $this->conn->query("DELETE FROM perguntas WHERE id=$id");
    }

    public function salvarHistorico($uid, $titulo, $desc, $pontos) {
        $uid = (int)$uid;
        $titulo = $this->conn->real_escape_string($titulo);
        $desc = $this->conn->real_escape_string($desc);
        $pontos = $this->conn->real_escape_string(json_encode($pontos));
        return $this->conn->query("INSERT INTO historico (usuario_id, resultado_titulo, resultado_descricao, pontuacao_json) VALUES ($uid, '$titulo', '$desc', '$pontos')");
    }

    public function listarHistorico($uid) {
        $uid = (int)$uid;
        $res = $this->conn->query("SELECT *, DATE_FORMAT(data_teste, '%d/%m/%Y %H:%i') as data_formatada FROM historico WHERE usuario_id = $uid ORDER BY data_teste DESC");
        $data = [];
        while ($row = $res->fetch_assoc()) $data[] = $row;
        return $data;
    }
}
?>