-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 06-Jan-2021 às 20:58
-- Versão do servidor: 10.4.11-MariaDB
-- versão do PHP: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- -----------------------------------------------------
-- Schema er
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `er` ;
-- -----------------------------------------------------
-- Schema er
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `er` DEFAULT CHARACTER SET utf8 ;
USE `er` ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `administrador`
--

DROP TABLE IF EXISTS `administrador`;
CREATE TABLE `administrador` (
  `user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `administrador`
--

INSERT INTO `administrador` (`user_id`) VALUES
(1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `disciplina`
--

DROP TABLE IF EXISTS `disciplina`;
CREATE TABLE `disciplina` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(45) DEFAULT NULL,
  `explicador_user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `disciplina`
--

INSERT INTO `disciplina` (`id`, `nome`, `explicador_user_id`) VALUES
(1, 'Português', 2),
(2, 'Inglês', 3),
(3, 'História e Geografia de Portugal', 2),
(4, 'Matemática', 2),
(5, 'Ciências Naturais', 3),
(6, 'Educação Visual', 2),
(7, 'Educação Tecnológica', 2),
(8, 'Educação Musical', 3),
(9, 'Educação Física', 2),
(10, 'Alemão', 2),
(11, 'Francês', 2),
(12, 'Filosofia', 2),
(13, 'Matemática A', 2),
(14, 'Física e Química A', 2),
(15, 'Biologia e Geologia', 3),
(16, 'Biologia', 2),
(17, 'Geologia', 3),
(18, 'Física', 3),
(19, 'Química', 3),
(20, 'Psicologia B', 3),
(21, 'História A', 3),
(22, 'Geografia', 2),
(23, 'Matemática Aplicada às Ciências Sociais', 3),
(24, 'Desenho A', 2),
(25, 'História da Cultura e das Artes', 2),
(26, 'Economia', 3);

-- --------------------------------------------------------

--
-- Estrutura da tabela `encarregado_educacao`
--

DROP TABLE IF EXISTS `encarregado_educacao`;
CREATE TABLE `encarregado_educacao` (
  `user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `encarregado_educacao`
--

INSERT INTO `encarregado_educacao` (`user_id`) VALUES
(8),
(9);

-- --------------------------------------------------------

--
-- Estrutura da tabela `explicador`
--

DROP TABLE IF EXISTS `explicador`;
CREATE TABLE `explicador` (
  `user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `explicador`
--

INSERT INTO `explicador` (`user_id`) VALUES
(2),
(3);

-- --------------------------------------------------------

--
-- Estrutura da tabela `explicando`
--

DROP TABLE IF EXISTS `explicando`;
CREATE TABLE `explicando` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `planoAcesso_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `explicando`
--

INSERT INTO `explicando` (`user_id`, `planoAcesso_id`) VALUES
(6, 3),
(7, 3),
(4, 4),
(5, 4);

-- --------------------------------------------------------

--
-- Estrutura da tabela `explicando_has_encarregado_educacao`
--

DROP TABLE IF EXISTS `explicando_has_encarregado_educacao`;
CREATE TABLE `explicando_has_encarregado_educacao` (
  `explicando_user_id` int(10) UNSIGNED NOT NULL,
  `encarregado_educacao_user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `explicando_has_encarregado_educacao`
--

INSERT INTO `explicando_has_encarregado_educacao` (`explicando_user_id`, `encarregado_educacao_user_id`) VALUES
(4, 8),
(5, 8),
(6, 9),
(7, 9);

-- --------------------------------------------------------

--
-- Estrutura da tabela `explicando_tem_explicador`
--

DROP TABLE IF EXISTS `explicando_tem_explicador`;
CREATE TABLE `explicando_tem_explicador` (
  `explicando_user_id` int(10) UNSIGNED NOT NULL,
  `explicador_user_id` int(10) UNSIGNED NOT NULL,
  `notas` varchar(1000) DEFAULT NULL,
  `sumario` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `explicando_tem_explicador`
--

INSERT INTO `explicando_tem_explicador` (`explicando_user_id`, `explicador_user_id`, `notas`, `sumario`) VALUES
(4, 2, NULL, NULL),
(5, 3, NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `explicando_tem_ficheiro`
--

DROP TABLE IF EXISTS `explicando_tem_ficheiro`;
CREATE TABLE `explicando_tem_ficheiro` (
  `ficheiro_id` int(10) UNSIGNED NOT NULL,
  `explicando_user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `ficheiro`
--

DROP TABLE IF EXISTS `ficheiro`;
CREATE TABLE `ficheiro` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(45) DEFAULT NULL,
  `explicador_user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `marcacao`
--

DROP TABLE IF EXISTS `marcacao`;
CREATE TABLE `marcacao` (
  `explicando_user_id` int(10) UNSIGNED NOT NULL,
  `explicador_user_id` int(10) UNSIGNED NOT NULL,
  `tempoInicio` datetime DEFAULT NULL,
  `duracao` int(11) DEFAULT NULL COMMENT 'duracao em minutos',
  `disciplina_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `periododisponibilidade`
--

DROP TABLE IF EXISTS `periododisponibilidade`;
CREATE TABLE `periododisponibilidade` (
  `explicador_user_id` int(10) UNSIGNED NOT NULL,
  `tempoInicio` time DEFAULT NULL,
  `tempoFim` time DEFAULT NULL,
  `diaSemana` enum('segunda','terca','quarta','quinta','sexta','sabado') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `planoacesso`
--

DROP TABLE IF EXISTS `planoacesso`;
CREATE TABLE `planoacesso` (
  `id` int(10) UNSIGNED NOT NULL,
  `tipo` enum('mensal','anual') DEFAULT NULL,
  `custo` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `planoacesso`
--

INSERT INTO `planoacesso` (`id`, `tipo`, `custo`) VALUES
(3, 'mensal', 39.99),
(4, 'anual', 459.99);

-- --------------------------------------------------------

--
-- Estrutura da tabela `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `user_type` enum('explicando','explicador','encarregado_educacao','administrador') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `user_type`) VALUES
(1, 'admin', 'admin', 'administrador'),
(2, 'filipe', 'filipe', 'explicador'),
(3, 'mary', 'mary', 'explicador'),
(4, 'diego', 'diego', 'explicando'),
(5, 'orlando', 'orlando', 'explicando'),
(6, 'alejandro', 'alejandro', 'explicando'),
(7, 'ruben', 'ruben', 'explicando'),
(8, 'mae', 'mae', 'encarregado_educacao'),
(9, 'pai', 'pai', 'encarregado_educacao');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`user_id`);

--
-- Índices para tabela `disciplina`
--
ALTER TABLE `disciplina`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_disciplina_explicador1_idx` (`explicador_user_id`);

--
-- Índices para tabela `encarregado_educacao`
--
ALTER TABLE `encarregado_educacao`
  ADD PRIMARY KEY (`user_id`);

--
-- Índices para tabela `explicador`
--
ALTER TABLE `explicador`
  ADD PRIMARY KEY (`user_id`);

--
-- Índices para tabela `explicando`
--
ALTER TABLE `explicando`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `fk_explicando_planoAcesso1_idx` (`planoAcesso_id`);

--
-- Índices para tabela `explicando_has_encarregado_educacao`
--
ALTER TABLE `explicando_has_encarregado_educacao`
  ADD PRIMARY KEY (`explicando_user_id`,`encarregado_educacao_user_id`),
  ADD KEY `fk_explicando_has_encarregado_educacao_encarregado_educacao_idx` (`encarregado_educacao_user_id`),
  ADD KEY `fk_explicando_has_encarregado_educacao_explicando1_idx` (`explicando_user_id`);

--
-- Índices para tabela `explicando_tem_explicador`
--
ALTER TABLE `explicando_tem_explicador`
  ADD PRIMARY KEY (`explicando_user_id`,`explicador_user_id`),
  ADD KEY `fk_explicando_has_explicador_explicador1_idx` (`explicador_user_id`),
  ADD KEY `fk_explicando_has_explicador_explicando1_idx` (`explicando_user_id`);

--
-- Índices para tabela `explicando_tem_ficheiro`
--
ALTER TABLE `explicando_tem_ficheiro`
  ADD PRIMARY KEY (`ficheiro_id`,`explicando_user_id`),
  ADD KEY `fk_ficheiro_has_explicando_explicando1_idx` (`explicando_user_id`),
  ADD KEY `fk_ficheiro_has_explicando_ficheiro1_idx` (`ficheiro_id`);

--
-- Índices para tabela `ficheiro`
--
ALTER TABLE `ficheiro`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ficheiro_explicador1_idx` (`explicador_user_id`);

--
-- Índices para tabela `marcacao`
--
ALTER TABLE `marcacao`
  ADD KEY `fk_marcacao_explicando1_idx` (`explicando_user_id`),
  ADD KEY `fk_marcacao_explicador1_idx` (`explicador_user_id`),
  ADD KEY `fk_marcacao_disciplina1_idx` (`disciplina_id`);

--
-- Índices para tabela `periododisponibilidade`
--
ALTER TABLE `periododisponibilidade`
  ADD KEY `fk_periodoDisponibilidade_explicador1_idx` (`explicador_user_id`);

--
-- Índices para tabela `planoacesso`
--
ALTER TABLE `planoacesso`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `disciplina`
--
ALTER TABLE `disciplina`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de tabela `ficheiro`
--
ALTER TABLE `ficheiro`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `planoacesso`
--
ALTER TABLE `planoacesso`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `user`
--
ALTER TABLE `user`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `administrador`
--
ALTER TABLE `administrador`
  ADD CONSTRAINT `fk_administrador_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `disciplina`
--
ALTER TABLE `disciplina`
  ADD CONSTRAINT `fk_disciplina_explicador1` FOREIGN KEY (`explicador_user_id`) REFERENCES `explicador` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `encarregado_educacao`
--
ALTER TABLE `encarregado_educacao`
  ADD CONSTRAINT `fk_encarregado_educacao_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `explicador`
--
ALTER TABLE `explicador`
  ADD CONSTRAINT `fk_explicador_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `explicando`
--
ALTER TABLE `explicando`
  ADD CONSTRAINT `fk_explicando_planoAcesso1` FOREIGN KEY (`planoAcesso_id`) REFERENCES `planoacesso` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_explicando_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `explicando_has_encarregado_educacao`
--
ALTER TABLE `explicando_has_encarregado_educacao`
  ADD CONSTRAINT `fk_explicando_has_encarregado_educacao_encarregado_educacao1` FOREIGN KEY (`encarregado_educacao_user_id`) REFERENCES `encarregado_educacao` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_explicando_has_encarregado_educacao_explicando1` FOREIGN KEY (`explicando_user_id`) REFERENCES `explicando` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `explicando_tem_explicador`
--
ALTER TABLE `explicando_tem_explicador`
  ADD CONSTRAINT `fk_explicando_has_explicador_explicador1` FOREIGN KEY (`explicador_user_id`) REFERENCES `explicador` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_explicando_has_explicador_explicando1` FOREIGN KEY (`explicando_user_id`) REFERENCES `explicando` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `explicando_tem_ficheiro`
--
ALTER TABLE `explicando_tem_ficheiro`
  ADD CONSTRAINT `fk_ficheiro_has_explicando_explicando1` FOREIGN KEY (`explicando_user_id`) REFERENCES `explicando` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ficheiro_has_explicando_ficheiro1` FOREIGN KEY (`ficheiro_id`) REFERENCES `ficheiro` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `ficheiro`
--
ALTER TABLE `ficheiro`
  ADD CONSTRAINT `fk_ficheiro_explicador1` FOREIGN KEY (`explicador_user_id`) REFERENCES `explicador` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `marcacao`
--
ALTER TABLE `marcacao`
  ADD CONSTRAINT `fk_marcacao_disciplina1` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplina` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_marcacao_explicador1` FOREIGN KEY (`explicador_user_id`) REFERENCES `explicador` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_marcacao_explicando1` FOREIGN KEY (`explicando_user_id`) REFERENCES `explicando` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `periododisponibilidade`
--
ALTER TABLE `periododisponibilidade`
  ADD CONSTRAINT `fk_periodoDisponibilidade_explicador1` FOREIGN KEY (`explicador_user_id`) REFERENCES `explicador` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
