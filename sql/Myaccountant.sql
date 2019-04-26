-- Progettazione Web
DROP DATABASE if exists MyAccount;
CREATE DATABASE MyAccount;
USE MyAccount;
-- MySQL dump 10.13  Distrib 5.6.20, for Win32 (x86)
--
-- Host: localhost    Database: MyAccount
-- ------------------------------------------------------
-- Server version	5.6.20

--
-- Table structure for table `Ingredienti`
--

DROP TABLE IF EXISTS `Ingredienti`;

CREATE TABLE `Ingredienti` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Fornitore` char(255) NOT NULL,
  `Nome` char(255) NOT NULL,
  `Prezzo` float NOT NULL,
  UNIQUE (`Nome`),
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

-- inserimento

INSERT INTO `Ingredienti` VALUES
  (1,"Rossi", "Latte", 1.2),(2,"Rossi", "Burro", 3.4),(3,"Rossi", "Panna", 1.8),(4,"Rossi", "Mascarpone", 2.5),
  (5,"Bianchi", "Uova", 0.5),(6,"Bianchi","Uova bio", 0.6),(7,"Pippo S.p.a","Cioccolato al latte", 4.5),(8,"Pippo S.p.a","Cioccolato al nero 80%", 4.5)
  ,(9,"Pippo S.p.a","Cioccolato nero90%", 4.6),(10,"Pippo S.p.a","Cioccolato bianco", 4.5),(11,"Pippo S.p.a","Nocciole", 24)
  ,(12,"Pippo S.p.a","Noci", 20),(13,"Pippo S.p.a","Arachidi", 21),(14,"Pippo S.p.a","cacao", 10),(15,"Pluto","vaniglia",45),(16,"Pluto","Cocco",10),
  (17,"Pippo S.p.a","Mele", 3),(18,"Pippo S.p.a","Pere", 4),(19,"Pippo S.p.a","Arance", 3),(20,"Pippo S.p.a","Fragole", 5),(21,"Pippo S.p.a","Mandarini", 6),(22,"Pippo","zucchero",1.5),
  (23,"Pippo S.p.a", "pistacchi",20);
  --
  -- Table structure for table `Ricette`
  --

  DROP TABLE IF EXISTS `Ricette`;
  CREATE TABLE `Ricette` (
    `ID` int(11) NOT NULL AUTO_INCREMENT,
    `Nome` char(255) NOT NULL,
    `descrizione` text NOT NULL,
    `Prezzo` float NOT NULL,
    PRIMARY KEY (`ID`),
    UNIQUE (`Nome`)
  ) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

  -- Inserimento

  INSERT INTO `Ricette` VALUES
  (1, "Gelato al cioccolato", "Spezzattate il cioccolato e tritatelo con un coltello a lama pesante. Mettetelo in una bacinella di acciaio insieme al latte, alla panna e allo zucchero.
Fate fondere il tutto a bagnomaria poi aggiungete i tuorli, amalgamate con cura con una frusta a mano e rimettete sul bagnomaria, sempre mescolando, per 5 minuti.", 7.1),
(2,"Gelato al pistacchio","Bilanciamento e preparazione della miscela.
Pastorizzazione del composto.
Maturazione della miscela.
Mantecatura del gelato.
Rassodamento del gelato.", 4.6);

--
-- Table structure per oggetti
--

DROP TABLE IF EXISTS `oggetti`;

CREATE TABLE `oggetti` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Nome` char(255) NOT NULL,
  `Prezzo` DOUBLE NOT NULL,
  UNIQUE (`Nome`),
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

-- inserimento
  INSERT INTO `oggetti` VALUES
  (1,"Palette",0.22),(2,"coni",0.30),(3,"coppette",0.50);
--
-- Table structure for table `Composizione`
--

DROP TABLE IF EXISTS `Composizione`;

CREATE TABLE `Composizione` (
  `ricetta` int(11) NOT NULL ,
  `ingrediente` int(11) NOT NULL,
  `quantita` float (11) NOT NULL,
  PRIMARY KEY (`ricetta`, `ingrediente`, `quantita`),
  CONSTRAINT FK_Ingredienti FOREIGN KEY (ingrediente)
  REFERENCES Ingredienti(ID)
  ON UPDATE NO ACTION
  ON DELETE NO ACTION,
  CONSTRAINT FK_Ricetta FOREIGN KEY (ricetta)
  REFERENCES Ricette(ID)
  ON UPDATE NO ACTION
  ON DELETE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;


INSERT INTO `Composizione` (ricetta, ingrediente, quantita) VALUES
(1,1,0.5),(1,5,4),(1,8,1),
(2,1,0.5),(2,5,4),(2,23,0.1);

--
-- Table per lo storico del prezzo degli ingredienti
--

DROP TABLE IF EXISTS `StoricoPrezziIngredienti`;

CREATE TABLE `StoricoPrezziIngredienti` (
  `datainizio` date NOT NULL,
  `datafine` date NULL,
  `id` int(11) NOT NULL,
  `prezzo` FLOAT NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

-- inserimenti

INSERT INTO `StoricoPrezziIngredienti` (datainizio, datafine, id, prezzo) VALUES
("2017-12-13", NULL, 1, 1.2),("2017-12-13", NULL, 2, 3.4),("2017-12-13", NULL,3, 1.8),("2017-12-13", NULL,4,2.5),
("2017-12-13", NULL, 5, 0.5),("2017-12-13", NULL,6, 0.6),("2017-12-13", NULL,7, 4.5),("2017-12-13", NULL,8, 4.5)
,("2017-12-13", NULL,9, 4.6),("2017-12-13", NULL,10,4.5),("2017-12-13", NULL,11, 24)
,("2017-12-13", NULL,12, 20),("2017-12-13", NULL,13, 21),("2017-12-13", NULL,14, 10),("2017-12-13", NULL,15,45),("2017-12-13", NULL,16,10),
("2017-12-13", NULL,17, 3),("2017-12-13", NULL,18, 4),("2017-12-13", NULL,19, 3),("2017-12-13", NULL,20, 5),("2017-12-13", NULL,21, 6),("2017-12-13", NULL,22,1.5),
("2017-12-13", NULL,23,20);

--
-- Tabella che contiene il risultato di una giornata
--

DROP TABLE IF EXISTS `Risultato`;

CREATE TABLE `Risultato` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `data` date NOT NULL,
  `ricavo` int(11) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
 -- inserimenti

INSERT INTO `Risultato`  VALUES
(1,"2018-01-09",440),(2,"2018-01-11",300),(3,"2018-01-05",200),(4,"2017-12-22",400);

--
-- tabella che associa consumo materia prima a un risultato
--

DROP TABLE IF EXISTS `Consumo`;

CREATE TABLE `Consumo` (
  `risultato` INT(11) NOT NULL,
  `oggetto` INT(11) NOT NULL,
  `quanto` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

-- inserimenti

INSERT INTO `Consumo`  VALUES
(1,1,20),(2,1,20),(3,1,20),(4,1,20),
(1,2,25),(2,2,30),(3,2,33),(4,2,45),
(1,3,40),(2,3,20),(3,3,5),(4,3,10);

--
-- Tabella delle vendite giornaliere
--
DROP TABLE IF EXISTS `Vendite`;

CREATE TABLE `Vendite` (
  `risultato` INT(11) NOT NULL,
  `gusto` INT(11) NOT NULL,
  `quanto` INT(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

-- inserimenti

INSERT INTO `Vendite`  VALUES
(1,1,15),(2,1,10),(3,1,5),(4,1,25),
(1,2,33),(2,2,30),(3,2,33),(4,2,11);

DROP TABLE IF EXISTS `SpesaLungoTermine`;

CREATE TABLE `SpesaLungoTermine` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `DataIniziale` date NOT NULL,
  `DataFinale` date NOT NULL,
  `Prezzo` DOUBLE NOT NULL,
  `Nome` char(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

INSERT INTO `SpesaLungoTermine` VALUES
(1, "2018-01-08","2018-01-14",35,"Bolletta gas"),
(2,"2018-01-02","2018-01-31	",200,"Bolletta corrente elettrica");



--
-- Table per lo storico del prezzo degli ingredienti
--

DROP TABLE IF EXISTS `StoricoPrezziOggetti`;

CREATE TABLE `StoricoPrezziOggetti` (
  `datainizio` date NOT NULL,
  `datafine` date NULL,
  `id` int(11) NOT NULL,
  `prezzo` FLOAT NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

INSERT INTO `StoricoPrezziOggetti` (datainizio, datafine, id, prezzo) VALUES
("2017-12-12", NULL,1, 0.22),("2017-12-12", NULL,2,0.30),("2017-12-12", NULL,3,0.50);

--
-- function per calcolare il prezzo di una ricetta (id) in uno specifico giorno a seconda del prezzo
-- degli ingredienti in quel giorno. Aggiorna inoltre la tabella che contiene la quantità di ingredienti consumati in un giorno
--


DROP FUNCTION IF EXISTS CalcolaPrezzoRicetta;
DELIMITER $$
CREATE FUNCTION CalcolaPrezzoRicetta(id INT, datai DATE, quanto_prodotto FLOAT)
RETURNS FLOAT DETERMINISTIC
BEGIN
DECLARE  prezzoingrediente FLOAT DEFAULT 0;
DECLARE ingrediente INT DEFAULT 0;
DECLARE quanto FLOAT DEFAULT 0;
DECLARE prezzototale FLOAT DEFAULT 0;
DECLARE finito INT DEFAULT 0;
DECLARE listaingredienti CURSOR FOR
  SELECT C.ingrediente, C.quantita
  FROM composizione C
  WHERE  C.ricetta = id;
DECLARE CONTINUE HANDLER FOR NOT FOUND
	SET finito = 1;
OPEN listaingredienti;
preleva: LOOP
	FETCH listaingredienti
	INTO ingrediente, quanto;
	IF finito = 1 THEN
    	LEAVE preleva;
	END IF;
	SET	prezzoingrediente =
							(
							  SELECT S.prezzo
  							FROM storicoprezziingredienti S
  							WHERE    S.datainizio <= datai AND S.datafine > datai AND S.id = ingrediente
							);

	IF(prezzoingrediente IS NULL) THEN
		SET prezzoingrediente =(
			SELECT I.Prezzo
  		 	FROM ingredienti I
 		 	WHERE I.ID = ingrediente
	);
	END IF;
  IF
    (EXISTS(
  		SELECT *
  		FROM ingredientidigiornata INGR
  		WHERE INGR.id = ingrediente
	)) THEN
		UPDATE ingredientidigiornata I
		SET I.quanto = I.quanto + (quanto_prodotto*quanto);
	ELSE
		INSERT INTO  ingredientidigiornata
		VALUES (ingrediente, prezzoingrediente, quanto_prodotto*quanto);
	END IF;
	SET prezzototale = prezzototale + (prezzoingrediente*quanto*quanto_prodotto);
	SET  prezzoingrediente = NULL;
  SET quanto = 0;
END LOOP;
CLOSE listaingredienti;
RETURN prezzototale;
END $$

--
-- Function che dato un id e un giorno calcola il prezzo dell'oggetoo in quel giorno
--

DROP FUNCTION IF EXISTS CalcolaPrezzoOggetto;
DELIMITER $$
CREATE FUNCTION CalcolaPrezzoOggetto(id INT, datai DATE)
RETURNS FLOAT DETERMINISTIC
BEGIN
DECLARE  prezzooggetto FLOAT;
SET prezzooggetto = (
			SELECT S.prezzo
			FROM StoricoPrezziOggetti S
      WHERE S.id = id AND datai >= S.datainizio AND S.datafine IS NOT NULL AND datai < S.datafine
            );
IF (prezzooggetto IS NULL)  THEN
	SET prezzooggetto = (
			      SELECT O.prezzo
            FROM oggetti O
            WHERE O.ID = id
            );
END IF;
RETURN prezzooggetto;
END $$
