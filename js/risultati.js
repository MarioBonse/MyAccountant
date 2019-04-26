function inizializza(){
    "use strict";
    var form = document.getElementById("SchegliProd");
    form.datainizio.onclick = function(){
        VediFormData('SchegliProd');
    };
    form.datainizio.value = "AAAA--MM--GG";
    preparatabelle("RISU");
}


function abilita(){
    document.getElementById("databox").style.display = "block";
    document.getElementById("pannelloricette").style.maxHeight = document.getElementById("pannelloricette").scrollHeight + "px";
}

function disabilita(){
    document.getElementById("databox").style.display = "none";
    document.getElementById("pannelloricette").style.maxHeight = document.getElementById("pannelloricette").scrollHeight + "px";
}


function VediFormData(idform){
    "use strict";
    var form = document.getElementById(idform);
    var wrapdata = document.getElementById("DataScomparsa");
    wrapdata.style.display = "block";
    if(!contenitoreoggettidata[idform]) {
        preparaformdata(idform, false);
    }else{
        DisegnaTabellaFormData2(idform);
    }
    AggiornaInputFormData(idform);
    var celle = wrapdata.getElementsByTagName("TD");
    for(var i = 0; i<celle.length; i++){
        celle[i].addEventListener("click", function(){
            chiudiformdata(idform);
        });
    }
    form.datainizio.onclick = function(){
      chiudiformdata(idform);
    }
}

function chiudiformdata(idform){
    "use strict";
    var wrapdata = document.getElementById("DataScomparsa");
    wrapdata.style.display = "none";
    var form = document.getElementById(idform);
    form.datainizio.onclick = function(){
      VediFormData(idform);
    }
}

function InserisciRisultato() {
    var form = document.getElementById("RISU");
    var ricavo = form.ricavo.value;
    var response, data;
    data = form.datainizio.value;
    //ogg può essere vuoto mentre gusti no
    if (isEmpty(gusti)) {
        scrivirisultato("Nessun gusto inserito");
        Fallimento();
        return false;
    }
    if (ricavo == "") {
        scrivirisultato("Nessun ricavo inserito");
        Fallimento();
        return false;
    }
    var oggetti = JSON.stringify(ogg);
    var gust = JSON.stringify(gusti);
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                response = JSON.parse(this.responseText);
                if (response.Error) {
                    scrivirisultato(response.Error);
                    Fallimento();
                    return false;
                } else {
                    scrivirisultato("Inserimento avvenuto con successo");
                    gusti = [];
                    ogg = [];
                    form.reset();
                    var ul;
                    ul = document.getElementsByClassName("ListaSotto")[0];
                    while (ul.hasChildNodes()) {
                        ul.lastElementChild.remove(false);
                    }
                    ul = document.getElementsByClassName("ListaSotto")[1];
                    while (ul.hasChildNodes()) {
                        ul.lastElementChild.remove(false);
                    }
                    document.getElementById("pannelloricette").style.maxHeight = document.getElementById("pannelloricette").scrollHeight + "px";
                    Successo();
                }
            }
        };
        xmlhttp.open("POST", "php/NuovoRisultato.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("ricavo=" + ricavo + "&oggetti=" + oggetti + "&gusti=" + gust + "&data=" + data);
    }
}



function caricarisultato() {
    "use strict";
    var form = document.getElementById("SchegliProd");
    var data = form.datainizio.value;
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);
                if(response.Error){
                  scrivirisultato(response.Error);
                  Fallimento();
                  return false;
                }else{
                  var SLT = JSON.parse(response.SLT);
                  var ricavo = response.ricavo;
                  var oggetti = JSON.parse(response.oggetti);
                  var gusti = JSON.parse(response.gusti);
                  var ingredienti = JSON.parse(response.ingredienti);
                  disegnarisultato(ricavo, data, SLT, oggetti, gusti, ingredienti);
                  var panel = document.getElementById("panel2");
                  panel.style.maxHeight = panel.scrollHeight + "px";
              }
            }
        };
        xmlhttp.open("POST", "php/vedirisultato.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("data=" + data);
    }
}

function disegnarisultato(ricavo, data, SLT, oggetti, gusti, ingredienti){
  "use strict";
  var spesatotale = 0;
  for(var i = 0; i<gusti.prezzototale.length; i++){
    gusti.prezzototale[i] = Math.floor(gusti.prezzototale[i]*100)/100;
    spesatotale += Number(gusti.prezzototale[i]);

  }
  for(var i = 0; i<oggetti.prezzototale.length; i++){
    spesatotale += Number(oggetti.prezzototale[i]);
  }
  for(var i = 0; i<SLT.prezzo.length; i++){
    spesatotale += Number(SLT.prezzo[i]);
  }
  var contenitore = document.getElementById("vedirisultato");
  contenitore.getElementsByTagName("p")[0].textContent = "Ricavo lordo = "+(Math.floor(ricavo*100)/100)+" €";
  contenitore.getElementsByTagName("p")[1].textContent = "Spesa totale = "+(Math.floor(spesatotale*100)/100)+" €";
  contenitore.getElementsByTagName("p")[2].textContent = "Ricavo netto = "+(Math.floor((Number(ricavo)-Number(spesatotale))*100)/100)+" €";
  contenitore.style.display = "block";
  var titolo = contenitore.getElementsByClassName("titolorisultato")[0];
  titolo.textContent = "Risultato del "+ data;
  var tabellagusti = contenitore.getElementsByClassName("result")[0];
  var tabellaSLT = contenitore.getElementsByClassName("result")[1];
  var tabellaingredienti = contenitore.getElementsByClassName("result")[2];
  var tabellaoggetti = contenitore.getElementsByClassName("result")[3];
  eliminacontenutorabella(tabellagusti);
  eliminacontenutorabella(tabellaSLT);
  eliminacontenutorabella(tabellaingredienti);
  eliminacontenutorabella(tabellaoggetti);
  if(isEmpty(SLT.nome)){
    contenitore.getElementsByClassName("wrapresult")[1].display = "hidden";
  }else{
    contenitore.getElementsByClassName("wrapresult")[1].display = "block";
  }
  if(isEmpty(oggetti.nome)){
    contenitore.getElementsByClassName("wrapresult")[3].display = "hidden";
  }else{
     contenitore.getElementsByClassName("wrapresult")[3].display = "block";
  }
  CreaTabella(tabellagusti, gusti.nome, gusti.quanto, gusti.prezzototale, gusti.prezzosingolo);
  CreaTabella(tabellaSLT, SLT.nome, SLT.prezzo);
  CreaTabella(tabellaingredienti, ingredienti.nome, ingredienti.quanto, ingredienti.prezzo);
  CreaTabella(tabellaoggetti, oggetti.nome, oggetti.quanto, oggetti.prezzototale, oggetti.prezzosingolo);
  chiudiformdata("RISU");
}
