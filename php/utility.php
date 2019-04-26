<?php
function esciedannulla($connessione, $messaggio)
{
    $ERR_LOG = "../logs/err_log.log";
    error_log(date('Y-m-d H:i:sO') . " " . mysqli_error($connessione) . "\r\n", 3, $ERR_LOG);
    mysqli_query($connessione, "ROLLBACK;");
    die(json_encode(array('Error' => $messaggio)));
}

function eliminaricetta($id, $connessione){
    $query="DELETE FROM composizione
            WHERE ricetta = ".$id.";";
    if(!$res=mysqli_query($connessione,$query)) {
        esciedannulla($connessione, "Impossibile eliminare dentro composizione");
    }
    $query="DELETE FROM ricette
            WHERE ID = ".$id.";";
    if(!$res=mysqli_query($connessione,$query)) {
        esciedannulla($connessione, "Impossibile eliminare la ricetta");
    }
}


function inserisciricetta($connessione, $ingredienti, $nome, $descrizione){
    $prezzo=0;

    $query="INSERT INTO ricette (Nome, Descrizione)
          VALUES ('".$nome."','".$descrizione."');";
    if(!$res=mysqli_query($connessione,$query)) {
        esciedannulla($connessione, "Impossibile inserire dentro ricette");
    }
    $ricettaID = mysqli_insert_id($connessione);
    //calcolo mil prezzo
    foreach($ingredienti as $i){
        if( $i->quanto ==0){
            continue;
        }
        $prezzo += ($i->prezzo*($i->quanto));
        $query = "INSERT INTO composizione (ricetta, ingrediente, quantita)
                VALUES  ('".$ricettaID."' , '".$i->id."' , '".$i->quanto."')  ";
        if(!$res=mysqli_query($connessione,$query)) {
            esciedannulla($connessione, "Impossibile inserire dentro composizione");
        }
    }
    //infine aggiorno il prezzo in modo che non debba calcolarlo sempre in futuro
    $query="UPDATE ricette
          SET prezzo = ".$prezzo."
          WHERE id = ".$ricettaID.";";
    if(!$res=mysqli_query($connessione,$query)) {
        esciedannulla($connessione, "Impossibile aggiornare il prezzo");
    }
    mysqli_query($connessione,"COMMIT;");
}

function AggiornaPrezzoRicetta(&$connessione, $IDricetta, $variazioneprezzo, $quantita){
    $ERR_LOG = "../logs/err_log.log";
    $query = "SELECT prezzo
                FROM ricette
                WHERE ID = ".$IDricetta.";";
    if(!$res2=mysqli_query($connessione,$query)) {
        error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
        mysqli_query($connessione,"ROLLBACK;");
        die(json_encode(array('Error' => "Impossibile eseguire la query")));
    }
    $prezzoiniziale = mysqli_fetch_assoc($res2)["prezzo"];
    mysqli_free_result($res2);
    $nuovoprezzo = $prezzoiniziale + ($quantita*$variazioneprezzo);
    $query = "UPDATE ricette
                SET prezzo = ".$nuovoprezzo."
                WHERE ID = ".$IDricetta.";";
    if(!mysqli_query($connessione,$query)){
        error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
        mysqli_query($connessione,"ROLLBACK;");
        die(json_encode(array('Error' => "Impossibile eseguire la query")));
    }
}

function aggiornastoricoprezzi($id, $prezzo, &$connessione, $tabella){
    $ERR_LOG = "../logs/err_log.log";
    $query = "SELECT *
              FROM ".$tabella."
              WHERE id = ".$id." AND datafine IS NULL AND datainizio = CURRENT_DATE;";
    if(!$res=mysqli_query($connessione,$query)){
        esciedannulla($connessione, "Impossibile eseguire la query");
    }
    if(mysqli_num_rows($res)>0){
        mysqli_free_result($res);
        return false;
    }
    mysqli_free_result($res);
    $query = "UPDATE ".$tabella."
              SET datafine = CURRENT_DATE
              WHERE id = ".$id." AND datafine IS NULL;";
    if(!mysqli_query($connessione,$query)){
        esciedannulla($connessione, "Impossibile eseguire la query");
    }
    $query = "INSERT INTO ".$tabella." (datainizio, datafine, id, prezzo)
              VALUES (CURRENT_DATE, NULL, ".$id.", ".$prezzo.") ";
    if(!mysqli_query($connessione,$query)){
        esciedannulla($connessione, "Impossibile eseguire la query");
    }
    return true;
}

function verificautilizzo($id, $connessione){
  $ERR_LOG = "../logs/err_log.log";
  $query = "SELECT *
            FROM vendite
            WHERE gusto = ".$id.";";
  if(!$res=mysqli_query($connessione,$query)) {
      error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
      die(json_encode(array('Error' => "Impossibile eseguire la query(presenza composzione)")));
  }
  $result = mysqli_num_rows($res);
  mysqli_free_result($res);
  return $result;
}

function nascondiricetta($id, $connessione){
  $ERR_LOG = "../logs/err_log.log";
  $query = "UPDATE ricette
            SET Uso = 0
            WHERE ID = ".$id.";";
  if(!mysqli_query($connessione,$query)) {
      error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
      mysqli_query($connessione,"ROLLBACK;");
      die(json_encode(array('Error' => "Impossibile eseguire la query(presenza composzione)")));
  }
}

function modificaricetta($connessione, $nuovonome, $nuovadescrizione, $id ,$ingredienti){
    $query = "UPDATE ricette
                SET nome = '".$nuovonome."' ,  descrizione = '".$nuovadescrizione."'
                WHERE ID = ".$id.";";
    if(!mysqli_query($connessione,$query)) {
        esciedannulla($connessione, "Errore nella 1 query");
    }
    $prezzo = 0;
    foreach ($ingredienti as $i){
        $query = "SELECT *
                    FROM composizione
                    WHERE ricetta = ".$id." AND ingrediente = ".$i->id.";";
        if(!$res=mysqli_query($connessione,$query)) {
            esciedannulla($connessione, "2");
        }
        if(mysqli_num_rows($res)) {
            if($i->quanto == 0) {
                $query = "DELETE FROM composizione
                        WHERE ricetta = " .$id. " AND ingrediente = " .$i->id. ";";
                if (!mysqli_query($connessione, $query)) {
                    esciedannulla($connessione, "3");
                }
            }else {
                $query = "UPDATE composizione
                        SET quantita = " . $i->quanto . "
                        WHERE ricetta = " . $id . " AND ingrediente = " . $i->id . ";";
                if (!mysqli_query($connessione, $query)) {
                    esciedannulla($connessione, "4e");
                }
                $prezzo += ($i->prezzo * $i->quanto);
            }
        }else {
            if( $i->quanto ==0){
                continue;
            }
            $prezzo += ($i->prezzo * $i->quanto);
            $query = "INSERT INTO composizione (ricetta, ingrediente, quantita)
                VALUES  ('" . $id . "' , '" . $i->id . "' , '" . $i->quanto . "')  ";
            if (!$res = mysqli_query($connessione, $query)) {
                esciedannulla($connessione, "5");
            }
        }
    }
    $query="UPDATE ricette
          SET prezzo = ".$prezzo."
          WHERE id = ".$id.";";
    if (! mysqli_query($connessione, $query)) {
        esciedannulla($connessione, "6");
    }
}

function aggiornaprezzoingrediente($connessione, $nome, $prezzo, $vecchioprezzo){
    $delta = $prezzo - $vecchioprezzo ;
    $query = "  SELECT R.ID AS ID, C.quantita AS quanto
            FROM composizione C INNER JOIN ingredienti I ON C.ingrediente = I.ID INNER JOIN ricette R ON R.ID = C.ricetta
            WHERE I.Nome = '".$nome."';";
    if(!$res=mysqli_query($connessione,$query)) {
        esciedannulla($connessione, "Impossibile eseguire la query");
    }
    while($row = mysqli_fetch_assoc($res)) {
        AggiornaPrezzoRicetta($connessione, $row["ID"], $delta, $row["quanto"]);
    }
    mysqli_free_result($res);
    $query="UPDATE ingredienti
        SET prezzo = ".$prezzo."
        WHERE nome = '".$nome."';"; //che abbia la parola ricercata in qualunque posizione

    if(!mysqli_query($connessione,$query)) {
        esciedannulla($connessione, "Impossibile eseguire la query");
    }
    $query = "  SELECT ID
            FROM ingredienti
            WHERE Nome = '".$nome."';";
    if(!$res=mysqli_query($connessione,$query)) {
        esciedannulla($connessione, "Impossibile eseguire la query");
    }
    $id = $row = mysqli_fetch_assoc($res)["ID"];
    mysqli_free_result($res);
    if(aggiornastoricoprezzi($id, $prezzo, $connessione, "StoricoPrezziIngredienti")) {
        return true;
    }else{
        return false;
    }
}
?>
