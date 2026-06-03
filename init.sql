-- Script de inicialização do banco de dados
-- E-commerce de Materiais Pedagógicos

SET NAMES utf8mb4;

USE loja_pedagogica;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('usuario', 'admin') DEFAULT 'usuario',
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  estoque INT NOT NULL DEFAULT 0,
  imagem VARCHAR(255),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ativo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para otimização
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_produtos_nome ON produtos(nome);

-- Usuário admin padrão (senha: admin123)
INSERT INTO usuarios (nome, email, senha, tipo) VALUES 
('Admin', 'admin@admin.com', '$2y$10$YourHashHere', 'admin');