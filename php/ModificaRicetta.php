<?php
include 'utility.php';


//file log per Errori
$ERR_LOG = "../logs/err_log.log";
$connessione = mysqli_connect("127.0.0.1","root");
$ingredienti = json_decode($_POST["listaingredienti"]);
$modifica = $_POST["modifica"];
if (mysqli_connect_errno()) {
    error_log(date('Y-m-d H:i:sO')." ".mysqli_connect_error()."\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => mysqli_connect_error())));
}
if(!mysqli_select_db($connessione,"myaccount")) {
    error_log(date('Y-m-d H:i:sO')." "."Couldn't select the database\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => "Impossibile selezinare il DB")));
}
$vecchionome = mysqli_real_escape_string($connessione, $_POST["vecchionome"]);
$nuovonome = mysqli_real_escape_string($connessione, $_POST["nuovonome"]);
$nuovadescrizione = mysqli_real_escape_string($connessione, $_POST["nuovadescrizione"]);
$query = "SELECT ID
          FROM Ricette
          WHERE nome = '".$vecchionome."'";
if(!$res=mysqli_query($connessione,$query)) {
  error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
  die(json_encode(array('Error' => "Impossibile eseguire la query(ID)")));
  }
$id = mysqli_fetch_assoc($res)["ID"];
mysqli_free_result($res);
mysqli_query($connessione,"BEGIN;");
if($modifica == 2){
    if(verificautilizzo($id, $connessione)){
        nascondiricetta($id, $connessione);
    }else{
        eliminaricetta($id, $connessione);
    }
    mysqli_query($connessione,"COMMIT;");
    print(json_encode(array('Status' => "Ricetta eliminata con successo")));
    mysqli_close($connessione);
}
else if($modifica == 1){
  if(verificautilizzo($id, $connessione)){//vero se è utilizzata=>nascondo la vecchia ricetta e creo la nuova
      nascondiricetta($id, $connessione);
      inserisciricetta($connessione, $ingredienti, $nuovonome, $nuovadescrizione);
      mysqli_query($connessione,"COMMIT;");
      print(json_encode(array('Status' => "Ricetta aggiornata con successo")));
      mysqli_close($connessione);
  }else{
      //se non è mai stat utilizzata la modifico effettivamente
        modificaricetta($connessione, $nuovonome, $nuovadescrizione,$id,  $ingredienti);
        mysqli_query($connessione,"COMMIT;");
        print(json_encode(array('Status' => "Ricetta aggiornata con successo")));
        mysqli_close($connessione);
  }
}else{
    $query = "UPDATE ricette
                SET nome = '".$nuovonome."' , descrizione = '".$nuovadescrizione."'
                WHERE ID = ".$id.";";
    if(!mysqli_query($connessione,$query)) {
        esciedannulla($connessione, "Impossibile aggiornare ricetta ");
    }
    mysqli_query($connessione,"COMMIT;");
    print(json_encode(array('Status' => "Ricetta aggiornata con successo")));
    mysqli_close($connessione);
}
?>
