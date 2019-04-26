
<?php
require 'utilityoggetti.php';
//file log per Errori
$ERR_LOG = "../logs/err_log.log";
$nuovonome=$_GET["nome"];
$nuovoprezzo = $_GET["prezzo"];
$vecchionome = $_GET["vecchionome"];
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
$query = "UPDATE oggetti
        SET nome = '".$nuovonome."'
        WHERE nome = '".$vecchionome."';";
if(!mysqli_query($connessione,$query)) {
    error_log(date('Y-m-d H:i:sO')." "."Couldn't select the database\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => "Impossibile aggiornare oggetto")));
}
if($vecchioprezzo != $nuovoprezzo) {
    mysqli_query($connessione, "BEGIN;");
    if (aggiornaprezzooggetto($connessione, $nuovonome, $nuovoprezzo, $vecchioprezzo)) {
        mysqli_query($connessione, "COMMIT;");
        print(json_encode(array('Status' => "Ingrediente modificato correttamente!")));
    } else {
        mysqli_query($connessione, "ROLLBACK;");
        print(json_encode(array("Alert" => "Attenzione, nome èstato aggiornato con successo
                                                \n Il prezzo non è stato modificato, due aggiornamenti nello stesso giorno ")));
    }
}else{
    print(json_encode(array('Status' => "Oggetto modificato correttamente!")));
}
mysqli_close($connessione);
?>
