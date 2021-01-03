-- MySQL Script generated by MySQL Workbench
-- Sun Jan  3 17:44:15 2021
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema ER
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `ER` ;

-- -----------------------------------------------------
-- Schema ER
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ER` DEFAULT CHARACTER SET utf8 ;
USE `ER` ;

-- -----------------------------------------------------
-- Table `ER`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ER`.`user` ;

CREATE TABLE IF NOT EXISTS `ER`.`user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NULL,
  `password` VARCHAR(45) NULL,
  `user_type` ENUM('explicando', 'explicador', 'encarregado_educacao', 'administrador') NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ER`.`planoAcesso`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ER`.`planoAcesso` ;

CREATE TABLE IF NOT EXISTS `ER`.`planoAcesso` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tipo` ENUM('mensal', 'anual') NULL,
  `custo` FLOAT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ER`.`explicando`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ER`.`explicando` ;

CREATE TABLE IF NOT EXISTS `ER`.`explicando` (
  `user_id` INT UNSIGNED NOT NULL,
  `planoAcesso_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`),
  INDEX `fk_explicando_planoAcesso1_idx` (`planoAcesso_id` ASC) ,
  CONSTRAINT `fk_explicando_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ER`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_explicando_planoAcesso1`
    FOREIGN KEY (`planoAcesso_id`)
    REFERENCES `ER`.`planoAcesso` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ER`.`explicador`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ER`.`explicador` ;

CREATE TABLE IF NOT EXISTS `ER`.`explicador` (
  `user_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_explicador_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ER`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ER`.`disciplina`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ER`.`disciplina` ;

CREATE TABLE IF NOT EXISTS `ER`.`disciplina` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL,
  `explicador_user_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_disciplina_explicador1_idx` (`explicador_user_id` ASC) ,
  CONSTRAINT `fk_disciplina_explicador1`
    FOREIGN KEY (`explicador_user_id`)
    REFERENCES `ER`.`explicador` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ER`.`marcacao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ER`.`marcacao` ;

CREATE TABLE IF NOT EXISTS `ER`.`marcacao` (
  `explicando_user_id` INT UNSIGNED NOT NULL,
  `explicador_user_id` INT UNSIGNED NOT NULL,
  `tempoInicio` DATETIME NULL,
  `duracao` INT NULL COMMENT 'duracao em minutos',
  `disciplina_id` INT UNSIGNED NOT NULL,
  INDEX `fk_marcacao_explicando1_idx` (`explicando_user_id` ASC) ,
  INDEX `fk_marcacao_explicador1_idx` (`explicador_user_id` ASC) ,
  INDEX `fk_marcacao_disciplina1_idx` (`disciplina_id` ASC) ,
  CONSTRAINT `fk_marcacao_explicando1`
    FOREIGN KEY (`explicando_user_id`)
    REFERENCES `ER`.`explicando` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_marcacao_explicador1`
    FOREIGN KEY (`explicador_user_id`)
    REFERENCES `ER`.`explicador` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_marcacao_disciplina1`
    FOREIGN KEY (`disciplina_id`)
    REFERENCES `ER`.`disciplina` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ER`.`encarregado_educacao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ER`.`encarregado_educacao` ;

CREATE TABLE IF NOT EXISTS `ER`.`encarregado_educacao` (
  `user_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_encarregado_educacao_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ER`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ER`.`administrador`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ER`.`administrador` ;

CREATE TABLE IF NOT EXISTS `ER`.`administrador` (
  `user_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_administrador_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ER`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ER`.`periodoDisponibilidade`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ER`.`periodoDisponibilidade` ;

CREATE TABLE IF NOT EXISTS `ER`.`periodoDisponibilidade` (
  `explicador_user_id` INT UNSIGNED NOT NULL,
  `tempoInicio` TIME NULL,
  `tempoFim` TIME NULL,
  `diaSemana` ENUM('segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado') NULL,
  INDEX `fk_periodoDisponibilidade_explicador1_idx` (`explicador_user_id` ASC) ,
  CONSTRAINT `fk_periodoDisponibilidade_explicador1`
    FOREIGN KEY (`explicador_user_id`)
    REFERENCES `ER`.`explicador` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ER`.`explicando_tem_explicador`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ER`.`explicando_tem_explicador` ;

CREATE TABLE IF NOT EXISTS `ER`.`explicando_tem_explicador` (
  `explicando_user_id` INT UNSIGNED NOT NULL,
  `explicador_user_id` INT UNSIGNED NOT NULL,
  `notas` VARCHAR(1000) NULL,
  `sumario` VARCHAR(1000) NULL,
  PRIMARY KEY (`explicando_user_id`, `explicador_user_id`),
  INDEX `fk_explicando_has_explicador_explicador1_idx` (`explicador_user_id` ASC) ,
  INDEX `fk_explicando_has_explicador_explicando1_idx` (`explicando_user_id` ASC) ,
  CONSTRAINT `fk_explicando_has_explicador_explicando1`
    FOREIGN KEY (`explicando_user_id`)
    REFERENCES `ER`.`explicando` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_explicando_has_explicador_explicador1`
    FOREIGN KEY (`explicador_user_id`)
    REFERENCES `ER`.`explicador` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ER`.`ficheiro`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ER`.`ficheiro` ;

CREATE TABLE IF NOT EXISTS `ER`.`ficheiro` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL,
  `explicador_user_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_ficheiro_explicador1_idx` (`explicador_user_id` ASC) ,
  CONSTRAINT `fk_ficheiro_explicador1`
    FOREIGN KEY (`explicador_user_id`)
    REFERENCES `ER`.`explicador` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ER`.`explicando_tem_ficheiro`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ER`.`explicando_tem_ficheiro` ;

CREATE TABLE IF NOT EXISTS `ER`.`explicando_tem_ficheiro` (
  `ficheiro_id` INT UNSIGNED NOT NULL,
  `explicando_user_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`ficheiro_id`, `explicando_user_id`),
  INDEX `fk_ficheiro_has_explicando_explicando1_idx` (`explicando_user_id` ASC) ,
  INDEX `fk_ficheiro_has_explicando_ficheiro1_idx` (`ficheiro_id` ASC) ,
  CONSTRAINT `fk_ficheiro_has_explicando_ficheiro1`
    FOREIGN KEY (`ficheiro_id`)
    REFERENCES `ER`.`ficheiro` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_ficheiro_has_explicando_explicando1`
    FOREIGN KEY (`explicando_user_id`)
    REFERENCES `ER`.`explicando` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ER`.`explicando_has_encarregado_educacao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ER`.`explicando_has_encarregado_educacao` ;

CREATE TABLE IF NOT EXISTS `ER`.`explicando_has_encarregado_educacao` (
  `explicando_user_id` INT UNSIGNED NOT NULL,
  `encarregado_educacao_user_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`explicando_user_id`, `encarregado_educacao_user_id`),
  INDEX `fk_explicando_has_encarregado_educacao_encarregado_educacao_idx` (`encarregado_educacao_user_id` ASC) ,
  INDEX `fk_explicando_has_encarregado_educacao_explicando1_idx` (`explicando_user_id` ASC) ,
  CONSTRAINT `fk_explicando_has_encarregado_educacao_explicando1`
    FOREIGN KEY (`explicando_user_id`)
    REFERENCES `ER`.`explicando` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_explicando_has_encarregado_educacao_encarregado_educacao1`
    FOREIGN KEY (`encarregado_educacao_user_id`)
    REFERENCES `ER`.`encarregado_educacao` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
