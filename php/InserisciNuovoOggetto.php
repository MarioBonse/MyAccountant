
<?php
//file log per Errori
$ERR_LOG = "../logs/err_log.log";
$prezzo=$_POST["prezzo"];
$connessione = mysqli_connect("127.0.0.1","root");
//connessione al server
if (mysqli_connect_errno()) {
    error_log(date('Y-m-d H:i:sO')." ".mysqli_connect_error()."\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => mysqli_connect_error())));
}
//connessione al mio db
if(!mysqli_select_db($connessione,"myaccount")) {
    error_log(date('Y-m-d H:i:sO')." "."Couldn't select the database\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => "Impossibile selezinare il DB")));
}
$nome=mysqli_real_escape_string($connessione, $_POST["nome"]);
//garantisco atomicità
mysqli_query($connessione,"BEGIN;");
$query="INSERT INTO oggetti (Nome, Prezzo)
        VALUES ('".$nome."', '".$prezzo."');"; 
if(!mysqli_query($connessione,$query)) {
    error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
    mysqli_query($connessione,"ROLLBACK;");
    die(json_encode(array('Error' => "Impossibile eseguire la query")));
}
$id = mysqli_insert_id($connessione);
$query="INSERT INTO StoricoPrezziOggetti (datainizio, datafine, prezzo, id)
        VALUES (CURRENT_DATE , NULL , '".$prezzo."', ".$id.");";
if(!mysqli_query($connessione,$query)) {
    error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
    mysqli_query($connessione,"ROLLBACK;");
    die(json_encode(array('Error' => "Impossibile eseguire la query")));
}
mysqli_query($connessione,"COMMIT;");
print(json_encode(array('Status' => "Oggetto inserito correttamente!")));
mysqli_close($connessione);
?>
