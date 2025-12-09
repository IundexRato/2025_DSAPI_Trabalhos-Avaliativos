CREATE DATABASE IF NOT EXISTS bd_dsapi;
USE bd_dsapi;

CREATE TABLE cidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50)
);

CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100)
);

CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  altura DOUBLE,
  nascim DATE,
  cidade_id INT,
  FOREIGN KEY (cidade_id) REFERENCES cidades(id)
);

CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  preco DOUBLE,
  quantidade DOUBLE,
  categoria_id INT,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  horario DATETIME,
  endereco VARCHAR(200),
  cliente_id INT,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE pedidos_produtos (
  pedido_id INT,
  produto_id INT,
  preco DOUBLE,
  quantidade DOUBLE,
  PRIMARY KEY (pedido_id, produto_id),
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);



INSERT INTO cidades (nome) VALUES ('São Paulo'), ('Campinas'), ('Santos');
INSERT INTO categorias (nome) VALUES ('Eletrônicos'), ('Roupas'), ('Livros');
INSERT INTO clientes (nome, altura, nascim, cidade_id)
VALUES ('João Silva', 1.80, '1990-05-10', 1),
       ('Maria Souza', 1.65, '1995-09-22', 2),
       ('Carlos Pereira', 1.75, '1988-01-15', 3);
INSERT INTO produtos (nome, preco, quantidade, categoria_id)
VALUES ('Notebook', 3500, 10, 1),
       ('Camiseta', 80, 50, 2),
       ('Livro JS', 120, 30, 3);
