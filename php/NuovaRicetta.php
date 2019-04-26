
<?php
include 'utility.php';
$ERR_LOG = "../logs/err_log.log";
$ingredienti= json_decode($_POST["ingredienti"]);
$connessione = mysqli_connect("127.0.0.1","root");
if (mysqli_connect_errno()) {
    error_log(date('Y-m-d H:i:sO')." ".mysqli_connect_error()."\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => mysqli_connect_error())));
}
if(!mysqli_select_db($connessione,"myaccount")) {
    error_log(date('Y-m-d H:i:sO')." "."Couldn't select the database\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => "Impossibile selezinare il DB")));
}
$nome=mysqli_real_escape_string($connessione, $_POST["nome"]);
$descrizione=mysqli_real_escape_string($connessione, $_POST["descrizione"]);
mysqli_query($connessione,"BEGIN;");
inserisciricetta($connessione, $ingredienti, $nome, $descrizione);
print(json_encode(array('Status' => "Ricetta inserita con successo")));
mysqli_close($connessione);
?>
