import express from "express";
import cors from "cors";
import db from "./Servidor.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;





app.get("/clientes", (req, res) => {
  db.query("SELECT * FROM clientes", (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

app.post("/clientes", (req, res) => {
  const { nome, altura, nascim, cidade_id } = req.body;
  const sql = "INSERT INTO clientes (nome, altura, nascim, cidade_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [nome, altura, nascim, cidade_id], (err, result) => {
    if (err) return res.status(500).json({ erro: err });
    res.status(201).json({ message: "Cliente cadastrado com sucesso!", id: result.insertId });
  });
});

app.put("/clientes/:id", (req, res) => {
  const { id } = req.params;
  const { nome, altura, nascim, cidade_id } = req.body;
  const sql = "UPDATE clientes SET nome=?, altura=?, nascim=?, cidade_id=? WHERE id=?";
  db.query(sql, [nome, altura, nascim, cidade_id, id], err => {
    if (err) return res.status(500).json({ erro: err });
    res.json({ message: "Cliente atualizado com sucesso!" });
  });
});

app.delete("/clientes/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM clientes WHERE id=?", [id], err => {
    if (err) return res.status(500).json({ erro: err });
    res.json({ message: "Cliente removido com sucesso!" });
  });
});





app.get("/categorias", (req, res) => {
  db.query("SELECT * FROM categorias", (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

app.post("/categorias", (req, res) => {
  const { nome } = req.body;
  db.query("INSERT INTO categorias (nome) VALUES (?)", [nome], (err, result) => {
    if (err) return res.status(500).json({ erro: err });
    res.status(201).json({ message: "Categoria criada com sucesso!", id: result.insertId });
  });
});

app.put("/categorias/:id", (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  db.query("UPDATE categorias SET nome=? WHERE id=?", [nome, id], err => {
    if (err) return res.status(500).json({ erro: err });
    res.json({ message: "Categoria atualizada com sucesso!" });
  });
});

app.delete("/categorias/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM categorias WHERE id=?", [id], err => {
    if (err) return res.status(500).json({ erro: err });
    res.json({ message: "Categoria excluída com sucesso!" });
  });
});





app.get("/produtos", (req, res) => {
  const sql = `
    SELECT p.*, c.nome AS categoria 
    FROM produtos p 
    LEFT JOIN categorias c ON p.categoria_id = c.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

app.post("/produtos", (req, res) => {
  const { nome, preco, quantidade, categoria_id } = req.body;
  db.query(
    "INSERT INTO produtos (nome, preco, quantidade, categoria_id) VALUES (?, ?, ?, ?)",
    [nome, preco, quantidade, categoria_id],
    (err, result) => {
      if (err) return res.status(500).json({ erro: err });
      res.status(201).json({ message: "Produto criado com sucesso!", id: result.insertId });
    }
  );
});

app.put("/produtos/:id", (req, res) => {
  const { id } = req.params;
  const { nome, preco, quantidade, categoria_id } = req.body;
  db.query(
    "UPDATE produtos SET nome=?, preco=?, quantidade=?, categoria_id=? WHERE id=?",
    [nome, preco, quantidade, categoria_id, id],
    err => {
      if (err) return res.status(500).json({ erro: err });
      res.json({ message: "Produto atualizado com sucesso!" });
    }
  );
});

app.delete("/produtos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM produtos WHERE id=?", [id], err => {
    if (err) return res.status(500).json({ erro: err });
    res.json({ message: "Produto removido com sucesso!" });
  });
});





app.get("/pedidos", (req, res) => {
  const sql = `
    SELECT p.id, p.horario, p.endereco, c.nome AS cliente
    FROM pedidos p
    JOIN clientes c ON p.cliente_id = c.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ erro: err });
    res.json(results);
  });
});

app.post("/pedidos", (req, res) => {
  const { cliente_id, endereco, produtos } = req.body;

  if (!produtos || produtos.length === 0) {
    return res.status(400).json({ erro: "O pedido deve conter produtos." });
  }

  const sqlPedido = "INSERT INTO pedidos (horario, endereco, cliente_id) VALUES (NOW(), ?, ?)";
  db.query(sqlPedido, [endereco, cliente_id], (err, result) => {
    if (err) return res.status(500).json({ erro: err });

    const pedido_id = result.insertId;
    const itens = produtos.map(p => [pedido_id, p.produto_id, p.preco, p.quantidade]);
    const sqlItens = "INSERT INTO pedidos_produtos (pedido_id, produto_id, preco, quantidade) VALUES ?";

    db.query(sqlItens, [itens], err2 => {
      if (err2) return res.status(500).json({ erro: err2 });
      res.status(201).json({ message: "Pedido criado com sucesso!", pedido_id });
    });
  });
});

app.delete("/pedidos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM pedidos WHERE id=?", [id], err => {
    if (err) return res.status(500).json({ erro: err });
    res.json({ message: "Pedido removido com sucesso!" });
  });
});





app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
