<?php
class Database {
    private $host = "localhost";
    private $user = "root";
    private $pass = "";
    private $db   = "vocacional_db";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new mysqli($this->host, $this->user, $this->pass, $this->db);
            $this->conn->set_charset("utf8mb4");
            
            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }
        } catch(Exception $e) {
            echo json_encode(["erro" => "Erro de conexão: " . $e->getMessage()]);
            exit;
        }
        return $this->conn;
    }
}
?>