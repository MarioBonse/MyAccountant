
<?php
require 'utility.php';
//file log per Errori
$ERR_LOG = "../logs/err_log.log";
$nome=$_GET["nome"];
$prezzo = $_GET["prezzo"];
$vecchioprezzo = $_GET["vecchioprezzo"];
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
//garantisco atomicità
mysqli_query($connessione,"BEGIN;");

if (aggiornaprezzoingrediente($connessione, $nome, $prezzo, $vecchioprezzo)){
    mysqli_query($connessione, "COMMIT;");
    print(json_encode(array('Status' => "Ingrediente modificato correttamente!")));
}else{
    mysqli_query($connessione, "ROLLBACK;");
    die(json_encode(array('Error' => "Prezzo già modificato oggi")));
}
mysqli_close($connessione);

?>
