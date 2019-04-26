<?php
include "utility.php";
function aggiornaprezzooggetto($connessione, $nome, $prezzo, $vecchioprezzo){
    $query="UPDATE oggetti
        SET prezzo = ".$prezzo."
        WHERE nome = '".$nome."';"; //che abbia la parola ricercata in qualunque posizione

    if(!mysqli_query($connessione,$query)) {
        esciedannulla($connessione, "Impossibile eseguire la query");
    }
    $query = "  SELECT ID
            FROM oggetti
            WHERE Nome = '".$nome."';";
    if(!$res=mysqli_query($connessione,$query)) {
        esciedannulla($connessione, "Impossibile eseguire la query");
    }
    $id = $row = mysqli_fetch_assoc($res)["ID"];
    mysqli_free_result($res);
    if(aggiornastoricoprezzi($id, $prezzo, $connessione, "StoricoPrezziOggetti")) {
        return true;
    }else{
        return false;
    }
}
?>
