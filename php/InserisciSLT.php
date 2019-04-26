<?php
//file log per Errori
$ERR_LOG = "../logs/err_log.log";
$prezzo=$_GET["prezzo"];
$datainiziale=$_GET["data1"];
$datafinale=$_GET["data2"];
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
$nome=mysqli_real_escape_string($connessione, $_GET["nome"]);
//garantisco atomicità
mysqli_query($connessione,"BEGIN;");
$query="INSERT INTO SpesaLungoTermine (Nome, Prezzo, DataIniziale, DataFinale)
        VALUES ('".$nome."', '".$prezzo."', '".$datainiziale."', '".$datafinale."');"; 
if(!mysqli_query($connessione,$query)) {
    error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
    mysqli_query($connessione,"ROLLBACK;");
    die(json_encode(array('Error' => "Impossibile eseguire la query")));
}
mysqli_query($connessione,"COMMIT;");
print(json_encode(array('Status' => "SPL inserita correttamente!")));
mysqli_close($connessione);
?>
