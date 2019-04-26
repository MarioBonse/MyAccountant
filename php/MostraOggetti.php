<?php
//file log per Errori
$ERR_LOG = "../logs/err_log.log";
$connessione = mysqli_connect("127.0.0.1","root");
$pagina = $_GET["pagina"];
if (mysqli_connect_errno()) {
    error_log(date('Y-m-d H:i:sO')." ".mysqli_connect_error()."\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => mysqli_connect_error())));
}
if(!mysqli_select_db($connessione,"myaccount")) {
    error_log(date('Y-m-d H:i:sO')." "."Couldn't select the database\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => "Impossibile selezinare il DB")));
}
$query="SELECT Nome,  Prezzo
            FROM oggetti
            ORDER BY Nome";
if(!$res=mysqli_query($connessione,$query)) {
    error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => "Impossibile eseguire la query")));
}
$numerorisultati = mysqli_num_rows($res);

$numeropagine = ((($numerorisultati-($numerorisultati%20))/20))+1;
$nom = array();
$prezz = array();
$resulset = mysqli_fetch_all($res, MYSQLI_NUM);
for($i = (($pagina)*20); $i<(($pagina+1)*20) && $i < $numerorisultati; $i++ ){
    $nom[] = $resulset[$i][0];
    $prezz[] = $resulset[$i][1];
}
print(json_encode(array("nome" => json_encode($nom),  "prezzo" => json_encode($prezz), "numeropagine" => $numeropagine )));
mysqli_close($connessione);
?>
