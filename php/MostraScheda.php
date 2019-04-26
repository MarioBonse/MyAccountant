<?php
//file per caricare i dati di una ricetta

//file log per Errori
$ERR_LOG = "../logs/err_log.log";
$nome=$_GET["nome"];
$connessione = mysqli_connect("127.0.0.1","root");
if (mysqli_connect_errno()) {
    error_log(date('Y-m-d H:i:sO')." ".mysqli_connect_error()."\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => mysqli_connect_error())));
}
if(!mysqli_select_db($connessione,"myaccount")) {
    error_log(date('Y-m-d H:i:sO')." "."Couldn't select the database\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => "Impossibile selezinare il DB")));
}

$query="SELECT Nome, Descrizione, Prezzo, id
            FROM ricette
            WHERE nome = '".$nome."';";
if(!$res=mysqli_query($connessione,$query)) {
    error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => "Impossibile eseguire la query".$nome)));
}
$row = mysqli_fetch_assoc($res);
$id = $row["id"];
$ricetta = json_encode(array("nome" => $row["Nome"], "descrizione" => $row["Descrizione"], "prezzo" => $row["Prezzo"]));

$query = "SELECT ingredienti.Nome as Nome, composizione.quantita as Quanto,
            ingredienti.Prezzo as Prezzo, ingredienti.Fornitore as Fornitore, ingredienti.ID as ID
            FROM composizione INNER JOIN ingredienti ON composizione.ingrediente=ingredienti.ID
              WHERE composizione.ricetta = ".$id.";";
if(!$res=mysqli_query($connessione,$query)) {
    error_log(date('Y-m-d H:i:sO')." ".mysqli_error($connessione)."\r\n", 3, $ERR_LOG);
    die(json_encode(array('Error' => "Impossibile eseguire la query")));

}
$nome = array();
$quanto = array();
$prezzo = array();
$fornitore = array();
$id = array();
while($row = mysqli_fetch_assoc($res)) {
    $nome[] = $row["Nome"];
    $quanto[] = $row["Quanto"];
    $prezzo[] = $row["Prezzo"];
    $fornitore[] = $row["Fornitore"];
    $id[] = $row["ID"];
}
$ingredienti = json_encode(array("nome"=>json_encode($nome), "prezzo" => json_encode($prezzo), "quanto" =>json_encode($quanto), "fornitore"=>json_encode($fornitore), "id" => json_encode($id) ));
print(json_encode(array("ingredienti"=>$ingredienti, "ricetta"=> $ricetta)));

mysqli_close($connessione);
?>
