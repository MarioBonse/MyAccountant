
<?php
require 'utility.php';
//file log per Errori
$ERR_LOG = "../logs/err_log.log";
$nuovonome=$_GET["nome"];
$nuovoprezzo = $_GET["prezzo"];
$vecchioprezzo = $_GET["vecchioprezzo"];
$nuovofornitore =  $_GET["nuovofornitore"];
$vecchionome = $_GET["vecchionome"];
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
$query = "UPDATE ingredienti 
        SET nome = '".$nuovonome."' , fornitore = '".$nuovofornitore."'
        WHERE nome = '".$vecchionome."';";
if(!mysqli_query($connessione,$query)) {
    esciedannulla($connessione, "Impossibile eseguire la query");
}
//garantisco atomicità. Lo faccio da qui perchè la modifica del prezzo è indipendente dalla modifica del nome
//Ho deciso di vietare la modifica più di una volta al giorno
if($vecchioprezzo != $nuovoprezzo) {
    mysqli_query($connessione, "BEGIN;");
    if (aggiornaprezzoingrediente($connessione, $nuovonome, $nuovoprezzo, $vecchioprezzo)) {
        mysqli_query($connessione, "COMMIT;");
        print(json_encode(array('Status' => "Ingrediente modificato correttamente!")));
    } else {
        mysqli_query($connessione, "ROLLBACK;");
        print(json_encode(array("Alert" => "Attenzione, nome e fornitore sono stati aggiornati con successo 
                                                \n Il prezzo non è stato modificato, due aggiornamenti nello stesso giorno ")));
    }
}else{
    print(json_encode(array('Status' => "Ingrediente modificato correttamente!")));
}
mysqli_close($connessione);

?>
