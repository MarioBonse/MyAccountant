<?php
//questo file restittuisce un oggetto passato come json avente i nomi degli ingredienti che assomigliano a quello richiesto

//
//file log per Errori
  $ERR_LOG = "../logs/err_log.log";
  $nome=$_GET["nome"];
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
    $query="SELECT Nome, Fornitore, Prezzo, ID
            FROM Ingredienti
            WHERE nome LIKE '%$nome%';"; //che abbia la parola ricercata in qualunque posizione
    if(!$res=mysqli_query($connessione,$query)) {
            error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
            die(json_encode(array('Error' => "Impossibile eseguire la query")));
    }
    $nom = array();
    $fornitor = array();
    $prezz = array();
    $I = array();
    $i=0;
    while($row = mysqli_fetch_assoc($res))
    {
        $nom[]= $row['Nome'];
        $fornitor[]=$row['Fornitore'];
        $prezz[]= $row['Prezzo'];
        $I[]=$row['ID'];
    }
    $nome = json_encode($nom);
    $fornitore = json_encode($fornitor);
    $prezzo = json_encode($prezz);
    $ID = json_encode($I);
    $obj = json_encode(array("nome" => $nome, "fornitore" => $fornitore , "prezzo" => $prezzo, "ID" => $ID));
    echo $obj;
    mysqli_close($connessione);
?>

