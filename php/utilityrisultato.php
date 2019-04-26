<?php
include "utility.php";

function approssima($x){
  return (round($x*100))/100;
}

function calcolaprezziricetta($data, $connessione){
    $ERR_LOG = "../logs/err_log.log";
    $listanomi = array();
    $listaprezzi = array();
    $listaquanto = array();
    $listaprezzosingolo = array();
    $query1 = "SELECT V.gusto as ID, V.quanto as quanto, RIC.nome AS nome
              FROM Risultato R INNER JOIN Vendite V ON R.id = V.risultato INNER JOIN ricette RIC ON RIC.ID = V.gusto
              WHERE R.data = '".$data."';";
    if(!$idgusti=mysqli_query($connessione,$query1)) {
        error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
        die(json_encode(array('Error' => "Impossibile eseguire la query")));
    }
    while($row = mysqli_fetch_assoc($idgusti)) {//per ogni gusto prodotto
        $nome = $row["nome"];
        $id = $row["ID"];
        $quantita = $row["quanto"];
        // trovo gli ingredienti che hanno cambiato il prezzo
        $query = "SELECT CalcolaPrezzoRicetta(".$id.", '".$data."', ".$quantita.") AS prezzo;";
        if(!$res=mysqli_query($connessione,$query)) {
            error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
            die(json_encode(array('Error' => "Impossibile eseguire la funzione CalcoloPrezzoRicetta")));
        }
        $row2 = mysqli_fetch_assoc($res);
        mysqli_free_result($res);
        array_push($listanomi, $nome);
        array_push($listaprezzi, ($row2["prezzo"]));
        array_push($listaquanto, $quantita);
        array_push($listaprezzosingolo, approssima($row2["prezzo"]/$quantita));
    }
    mysqli_free_result($idgusti);
    $listagusti = array("nome" => $listanomi, "prezzosingolo" => $listaprezzosingolo, "prezzototale" => $listaprezzi, "quanto" =>$listaquanto);
    return $listagusti;
}

function calcolaprezzooggetto($data, $connessione){
  $ERR_LOG = "../logs/err_log.log";
  $listanomi = array();
  $listaprezzi = array();
  $listaquanto = array();
  $listaprezzosingolo = array();
  $query = "SELECT C.oggetto as ID, C.quanto as quanto, O.nome AS nome
            FROM Risultato R INNER JOIN Consumo C ON R.id = C.risultato INNER JOIN oggetti O ON O.ID = C.oggetto
            WHERE R.data = '".$data."';";
  if(!$res=mysqli_query($connessione,$query)) {
      error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
      die(json_encode(array('Error' => "Impossibile eseguire la query")));
  }
  while($row = mysqli_fetch_assoc($res)) {//per ogni gusto prodotto
      $nome = $row["nome"];
      $id = $row["ID"];
      $quantita = $row["quanto"];
      $query2 = "SELECT CalcolaPrezzoOggetto(".$id.", '".$data."') AS prezzo;";
      if(!$res2=mysqli_query($connessione,$query2)) {
          error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
          die(json_encode(array('Error' => "Impossibile eseguire la function CalcolaPrezzoOggetto")));
      }
      $row2 = mysqli_fetch_assoc($res2);
      array_push($listanomi, $nome);
      array_push($listaprezzi, (approssima($row2["prezzo"])*$quantita));
      array_push($listaquanto, $quantita);
      array_push($listaprezzosingolo, approssima($row2["prezzo"]));
  }
  $listaoggetti = array("nome" => $listanomi, "prezzosingolo" => $listaprezzosingolo, "prezzototale" => $listaprezzi, "quanto" =>$listaquanto);
  mysqli_free_result($res);
  return $listaoggetti;
}

function calcolaSLT($data, $connessione){
  $ERR_LOG = "../logs/err_log.log";
  $listanomi = array();
  $listaprezzi = array();
  $query = "SELECT SLT.Nome  AS nome, SLT.Prezzo / (
  										SELECT COUNT(*)
  										FROM risultato R
  										WHERE SLT.DataIniziale <= R.data AND SLT.DataFinale >= R.data
                    ) AS prezzo
            FROM spesalungotermine SLT
            WHERE SLT.DataIniziale <= '".$data."' AND SLT.DataFinale >= '".$data."';";//query per avere le slt normalizzate
  $listaSLT = array();
  if(!$res=mysqli_query($connessione,$query)) {
      error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
      die(json_encode(array('Error' => "Impossibile eseguire la query")));
  }
  while($row = mysqli_fetch_assoc($res)) {
      array_push($listanomi, $row["nome"]);
      array_push($listaprezzi, approssima($row["prezzo"]));
     }
  mysqli_free_result($res);
  $listaSLT = array("nome" => $listanomi, "prezzo" =>  $listaprezzi);
  return $listaSLT;
}

function vediricavo($data, $connessione){
  $ERR_LOG = "../logs/err_log.log";
  $query = "SELECT R.ricavo AS ricavo
            FROM risultato R
            WHERE R.data = '".$data."';";//query per avere le slt normalizzate
  if(!$res=mysqli_query($connessione,$query)) {
      error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
      die(json_encode(array('Error' => "Impossibile eseguire la query")));
  }
  $row = mysqli_fetch_assoc($res);
  mysqli_free_result($res);
  return $row["ricavo"];
}

function vedimaterieprime($data, $connessione){
    $ERR_LOG = "../logs/err_log.log";
    $listanomi = array();
    $listaprezzi = array();
    $listaquanto = array();
    $listaprezzosingolo = array();
    $query = "SELECT ING.nome as nome, I.Prezzo as prezzo, I.quanto as quanto
              FROM ingredientidigiornata I INNER JOIN ingredienti ING ON I.id = ING.ID;";//query per la tabella momentanea che continee gli ingredienti consumati in quella specifica giornata
    if(!$res=mysqli_query($connessione,$query)) {
        error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
        die(json_encode(array('Error' => "Impossibile eseguire la query")));
    }
    $listaMP = array();
    while($row = mysqli_fetch_assoc($res)) {
        array_push($listanomi, $row["nome"]);
        array_push($listaprezzi, $row["prezzo"]);
        array_push($listaquanto, $row["quanto"]);
       }
    mysqli_free_result($res);
    $listaMP = array("nome" => $listanomi, "prezzo" => $listaprezzi, "quanto" => $listaquanto);
    return $listaMP;
}
?>
