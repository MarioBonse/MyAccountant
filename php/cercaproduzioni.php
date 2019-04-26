<?php
//file log per Errori
$ERR_LOG = "../logs/err_log.log";
$anno=$_GET["anno"];
$mese=$_GET["mese"];
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
$query="SELECT day(data) as data
            FROM risultato
            WHERE month(data) =".$mese." AND year(data) = ".$anno.";";
if(!$res=mysqli_query($connessione,$query)) {
    error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => "Impossibile eseguire la query")));
}
$anni = array();
while($row = mysqli_fetch_assoc($res)) {
    $anni[]= $row['data'];
}
print(json_encode($anni));
mysqli_close($connessione);
?>
