
<?php
//file log per Errori
$ERR_LOG = "../logs/err_log.log";
$ricavo=$_POST["ricavo"];
$data=$_POST["data"];
$oggetti=json_decode($_POST["oggetti"]);
$gusti= json_decode($_POST["gusti"]);
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

$query = "SELECT *
              FROM risultato
              WHERE   data = '".$data."';";
if(!$res=mysqli_query($connessione,$query)) {
    error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => "Impossibile eseguire query")));
}

if(mysqli_num_rows($res) > 0)
{
    die(json_encode(array('Error' => 'Risultato già presente, impossibile scrivere')));
}
/*atomicità*/
mysqli_query($connessione,"BEGIN;");
$query="INSERT INTO risultato (data, ricavo)
        VALUES ( '".$data."' , ".$ricavo.");";
if(!$res=mysqli_query($connessione,$query)) {
    error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
    mysqli_query($connessione,"ROLLBACK;");
    die(json_encode(array('Error' => "Impossibile inserire risultato")));
}
$ID = mysqli_insert_id($connessione);
//calcolo mil prezzo
foreach($oggetti as $o){
    $query = "INSERT INTO consumo (risultato, oggetto, quanto)
              VALUES  ('".$ID."' , '".$o->id."' , '".$o->quanto."');  ";
    if(!$res=mysqli_query($connessione,$query)) {
        error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
        mysqli_query($connessione,"ROLLBACK;");
        die(json_encode(array('Error' => "Impossibile inserire dentro consumo")));
    }
}

foreach($gusti as $g){
    $query = "INSERT INTO Vendite (risultato, gusto, quanto)
              VALUES  ('".$ID."' , '".$g->id."' , '".$g->quanto."')  ";
    if(!$res=mysqli_query($connessione,$query)) {
        error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
        mysqli_query($connessione,"ROLLBACK;");
        die(json_encode(array('Error' => "Impossibile inserire dentro vendite")));
    }
}
mysqli_query($connessione,"COMMIT;");
print(json_encode(array('Status' => "Risultato inserito con successo")));
mysqli_close($connessione);

?>
