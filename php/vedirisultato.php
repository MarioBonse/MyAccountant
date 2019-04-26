<?php
//file log per Errori
include 'utilityrisultato.php';
$ERR_LOG = "../logs/err_log.log";
$data=$_POST["data"];
$connessione = mysqli_connect("127.0.0.1","root");
//connessione al server
if (mysqli_connect_errno()) {
    error_log(date('Y-m-d H:i:sO')." ".mysqli_connect_error()."\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => mysqli_connect_error())));
}
//connessione al mio db
if(!mysqli_select_db($connessione,"myaccount")) {
    error_log(date('Y-m-d H:i:sO')." "."Couldn't select the database\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => "Impossibile selezionare il DB.")));
}
$query = "DROP TABLE IF EXISTS ingredientidigiornata;";
if(!mysqli_query($connessione,$query)) {
    error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => "Impossibile eseguire la query")));
}
$query = "CREATE TABLE ingredientidigiornata(
          id INT NOT NULL,
          prezzo FLOAT NOT NULL,
          quanto FLOAT DEFAULT 0,
          PRIMARY KEY (id)
          ) ENGINE=InnoDB  DEFAULT CHARSET=latin1;";
if(!mysqli_query($connessione,$query)) {
    error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => "Impossibile eseguire la query")));
}
$vettoreprezzi = json_encode(calcolaprezziricetta($data, $connessione));
$vettoreoggetti = json_encode(calcolaprezzooggetto($data, $connessione));
$vettoreslt = json_encode(calcolaSLT($data, $connessione));
$vettoreingredienti = json_encode(vedimaterieprime($data, $connessione));
$ricavo = vediricavo($data, $connessione);
if($ricavo){
  print(json_encode(array("gusti" => $vettoreprezzi, "oggetti" => $vettoreoggetti,
                              "SLT" =>$vettoreslt, "ricavo" =>$ricavo, "ingredienti" => $vettoreingredienti)));
}else{
  print(json_encode(array("Alert" => "Attenzione, produzione non inserita eseguita in questa giornata")));
}
?>
