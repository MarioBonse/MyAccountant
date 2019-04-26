/*variabili locali che contengono le informazioni della scheda visualizzata*/
var prezzoricetta;
var nomericetta;
var descrizionericetta;
var ingredientim = [];
var cambiato = 0;
var lunghezzaoriginale;


/*funzione che mostra la scheda della ricetta che si è appena cliccata*/
function mostrascheda(indice){
    "use strict";
    var tabella = document.getElementById("TabellVisualizzazioneRicette");
    nomericetta =  tabella.getElementsByTagName("TR")[indice+1].childNodes[0].textContent;
    prezzoricetta = tabella.getElementsByTagName("TR")[indice+1].childNodes[2].textContent;
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);
                if(response.Error){
                    scrivirisultato(response.Error);
                    Fallimento();
                }else{
                    var scheda = document.getElementsByClassName("scheda")[0];
                    var ricetta = JSON.parse(response.ricetta);
                    var listaingredienti = JSON.parse(response.ingredienti);
                    descrizionericetta = ricetta.descrizione;
                    var nomeingredienti = JSON.parse(listaingredienti.nome);
                    var id = JSON.parse(listaingredienti.id);
                    lunghezzaoriginale = nomeingredienti.length;
                    var quantoingredienti = JSON.parse(listaingredienti.quanto);
                    var prezzoingredienti = JSON.parse(listaingredienti.prezzo);
                    var produttori = JSON.parse(listaingredienti.fornitore);
                    ingredientim = [];
                    for(var j =0 ; j<nomeingredienti.length; j++){
                      var ingr = {nome: nomeingredienti[j], quanto: quantoingredienti[j], id: id[j], prezzo: prezzoingredienti[j]};
                      ingredientim.push(ingr);
                    }
                    RendiVisibileScheda("BoxScheda");
                    creatitoloh3(scheda,"Scheda della ricetta","titoloscheda" );
                    var bloccosinistra = document.createElement("DIV");
                    var bloccodestro = document.createElement("DIV");
                    var prezzo = document.createElement("SPAN");
                    var testo = document.createElement("P");
                    var button = document.createElement("BUTTON");
                    var tabella = document.createElement("TABLE");
                    var nomeric = document.createElement("P");
                    var contenitore = document.createElement("DIV");
                    /*nome ricetta*/
                    nomeric.appendChild(document.createTextNode(nomericetta));
                    nomeric.id = "NomeRicettaSceda";
                    /*tabella*/
                    tabella.id = "mostraingredienti";
                    CreaTitolo(tabella, "nome", "fornitore", "prezzo", "quantità");
                    CreaTabella(tabella,nomeingredienti,produttori, prezzoingredienti ,  quantoingredienti );
                    /*propietà del paragrafo p*/
                    testo.id = "descrizionericetta";
                    testo.appendChild(document.createTextNode(descrizionericetta));
                    /*propietà del blocco sinistro*/
                    creatitoloh3(contenitore,"Nome", "sottotitoli-scheda");
                    contenitore.appendChild(nomeric);
                    bloccosinistra.appendChild(contenitore);
                    contenitore = document.createElement("DIV");
                    creatitoloh3(contenitore,"Descrizione", "sottotitoli-scheda");
                    bloccosinistra.id = "bloccosinistro";
                    bloccosinistra.className = "premodifica";
                    contenitore.appendChild(testo);
                    bloccosinistra.appendChild(contenitore);
                    /*bloccodestro*/
                    creatitoloh3(bloccodestro,"Ingredienti", "sottotitoli-scheda");
                    bloccodestro.id = "bloccodestro";
                    bloccodestro.className = "premodifica";
                    bloccodestro.appendChild(tabella);
                    /*prezzo*/
                    prezzo.appendChild(document.createTextNode("prezzo di "+prezzoricetta+" \u20ac/Kg"));
                    prezzo.id = "prezzoscheda";
                    /*bottone*/
                    button.appendChild(document.createTextNode("Modifica"));
                    button.id = "ModificaRicetta";
                    button.onclick = ModificaRicetta;
                    /*aggiungiamo tutto alla scheda*/
                    scheda.appendChild(prezzo);
                    scheda.appendChild(bloccosinistra);
                    scheda.appendChild(bloccodestro);
                    scheda.appendChild(button);

                }
            }
        };
        xmlhttp.open("GET", "php/MostraScheda.php?nome="+nomericetta, true);
        xmlhttp.send();
    }
}


/*

funzione che permette di cambiare il layout affinchè si possa modificare una ricetta

 */

function ModificaRicetta(){
    "use strict";
    var scheda = document.getElementsByClassName("scheda")[0];
    /*cambio bottone*/
    var button = document.getElementById("ModificaRicetta");
    button.textContent = "Annulla";
    button.onclick = Annulla;
    /*descrizione ricetta*/
    CercaSostituisciInput(document.getElementById("descrizionericetta"),"textarea" , 0, "modificatestoricetta", descrizionericetta);
    /*nome ricetta*/
    var nomeoriginale = CercaSostituisciInput(document.getElementById("NomeRicettaSceda"),"input", 0 , "modificanome" , nomericetta );
    /*lista ingredienti*/
    for(var j = 0; j< ingredientim.length; j++){
        CercaSostituisciTAB(document.getElementById("mostraingredienti").childNodes[j+1].childNodes[3],  "modificaquanto", ingredientim[j].quanto, "number");
    }
    /*aggiungi tasto per eseguire la modifica*/
    button = document.createElement("BUTTON");
    button.id = "esegui";
    button.onclick = esegui;
    button.textContent = "Esegui";
    scheda.appendChild(button);
    /*modifica la dimensione del blocco sinistro e destro*/
    document.getElementById("bloccosinistro").className = "postmodifica";
    document.getElementById("bloccodestro").className = "postmodifica";
    /*aggiungi sistema per aggiunta di ingredienti*/
    var mainelement = creainserimentoingredienti();
    mainelement.id = "aggiungiingrediente";
    scheda.appendChild(mainelement);
}

/*

funzione di supporto che crea il form dìinserimento degli ingredienti

 */

function creainserimentoingredienti(){
    "use strict";
    var wrapper = document.createElement("DIV");
    var div0 = document.createElement("DIV");
    var label = document.createElement("LABEL");
    var input = document.createElement("INPUT");
    //prima creo il contenitore generale
    wrapper.className = "wrapmedio";
    //poi il pezzo dell'ingrediente il pezzo per l'ingrediente
    /*  <div class="WrapIngrediente">
          <label>Ingredienti</label><br>
          <input class="nomelista"  type='search' name='Nomeingr' onkeyup="CercaSuggerimentoIngrediente(this, event)" placeholder="Inserisci ingrediente già registrato.." autocomplete="off">
          <div class='Tendina'></div>
      </div>*/
    div0.className = "WrapIngrediente";
    label.textContent = "Ingrediente";
    div0.appendChild(label);
    div0.appendChild(document.createElement("BR"));
    input.className = "nomelista";
    input.type = "search";
    input.placeholder = "inserisci gusto";
    div0.appendChild(input);
    input.className = "nomelista";
    input.type = "search";
    input.placeholder = "inserisci gusto";
    input.name = "Nomeingr";
    var tendina = document.createElement("DIV");
    tendina.className = "Tendina";
    div0.appendChild(tendina);
    input.onkeyup = function(){CercaSuggerimentoIngrediente(input, event);};
    input.autocomplete = "off";
    wrapper.appendChild(div0);
    //ora il pezzo del prezzo
    /*  <div class="WrapQuanto">
          <label>Quantità</label><br>
          <input class="quantolista" type="number" name="quantoingrediente" placeholder="Inserisci quantità">
      </div>
    */
    div0 = document.createElement("DIV");
    label = document.createElement("LABEL");
    label.textContent = "Quantità";
    div0.appendChild(label);
    div0.appendChild( document.createElement("BR"));
    var input2 = document.createElement("INPUT");
    input2.className = "quantolista";
    input2.type = "number";
    input2.placeholder = "inserisci quantità";
    input2.name = "quantoingrediente";
    div0.className ="WrapQuanto";
    div0.appendChild(input2);
    wrapper.appendChild(div0);
    //infine il bottone
    /*
    <div class="WrapSmallButton">
        <button type="button" class="SmallButton" onclick="InserisciIngrediente(0,'pannelloricette')">Aggiungi</button>
    </div>
    */
    div0 = document.createElement("DIV");
    div0.className = "WrapSmallButton";
    var button = document.createElement("BUTTON");
    button.className = "BottoneAggiungiIngredienteScheda";
    button.type = "button";
    button.onclick = inseriscitabella;
    button.textContent = "Aggiungi";
    div0.appendChild(document.createElement("LABEL"));
    div0.appendChild(document.createElement("BR"));
    div0.appendChild(button);
    wrapper.appendChild(div0);
    return wrapper;
}

/*

funzione che aggiunge alla tabella di visualizzazione ingredienti il nuovo ingrediente

 */

function inseriscitabella(){
    "use strict";
    var nome = document.getElementsByClassName("nomelista")[1].value;
    var quanto = document.getElementsByClassName("quantolista")[1].value;
    for(var j=0; j<ingredientim.length; j++){
        if(nome === ingredientim[j].nome){
            document.getElementsByClassName("nomelista")[1].value = "";
            document.getElementsByClassName("quantolista")[1].value = "";
            scrivirisultato("ingrediente già presente");
            Fallimento();
            return false;
        }
    }
    if (quanto < 0) {
        scrivirisultato("Attenzione, quantità negativa");
        Fallimento();
        document.getElementsByClassName("quantolista")[1].value = "";
        return false;
    }
    if (quanto == "") {
        scrivirisultato("ingrediente quantità non inserita");
        Fallimento();
        return false;
    }
    if (nome == "") {
        scrivirisultato("Nome non inserito");
        Fallimento();
        return false;
    } else {
        var xmlhttp;
        if (xmlhttp = CreaRichiesta()) {
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(this.responseText);
                    if (result.Error) {
                        scrivirisultato(result.Error);
                        Fallimento();
                        return false;
                    } else {
                        var ingr = {nome: nome, quanto: quanto, id: result.id, prezzo: result.prezzo};
                        ingredientim.push(ingr);
                        var tabella = document.getElementById("mostraingredienti");
                        var input = document.createElement("INPUT");
                        input.value = quanto;
                        input.className = "modificaquanto";
                        input.type = "number";
                        CreaRiga(tabella,document.createTextNode(nome) ,
                            document.createTextNode(result.fornitore), document.createTextNode(result.prezzo) ,  input );
                        cambiato = 1;
                    }
                    document.getElementsByClassName("nomelista")[1].value = "";
                    document.getElementsByClassName("quantolista")[1].value = "";
                }
            };
            xmlhttp.open("GET", "php/VerificaIngrediente.php?nome=" + nome, true);
            xmlhttp.send();
        }
    }
}

function esegui(){
    "use strict";
    var nuovonome = document.getElementById("modificanome").value;
    var nuovadescrizione = document.getElementById("modificatestoricetta").value;
    if(nuovonome === "" && nuovadescrizione === ""){
      //devo eliminare la ricetta
        var conferma = confirm("Omettendo nome e descrizione eliminerà la ricetta.\n Vuoi proseguire?");
        if (conferma) {
            cambiato = 2;
        }else{
            return false;
        }
        document.getElementById("bloccosinistro").className = "premodifica";
        document.getElementById("bloccodestro").className = "premodifica";

    }
    else if(nuovonome === ""){
      scrivirisultato("Nome non inserito");
      Fallimento();
      document.getElementById("modificanome").value = nomericetta;
      return false;
    }
    else if(nuovadescrizione === ""){
      scrivirisultato("Descrizione non inserita");
      Fallimento();
      document.getElementById("modificatestoricetta").value = descrizionericetta;
      return false;
    }
    var nuovinomi = [];
    var quanto = [];
    var listainput = document.getElementsByClassName("modificaquanto");
    for (var j = 0; j < ingredientim.length; j++) {
        if (listainput[j].value != ingredientim[j].quanto) {
            cambiato = 1;
        }
        ingredientim[j].quanto = listainput[j].value;
    }
    var isoningredienti = JSON.stringify(ingredientim);
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(this.responseText);
                if (result.Error) {
                    scrivirisultato(result.Error);
                    Fallimento();
                    return false;
                } else {
                    ChiudiScedaGrande();
                    ricettario(document.getElementsByClassName("accordion")[3]);
                    ricettario(document.getElementsByClassName("accordion")[3]);
                    scrivirisultato(result.Status);
                    ingredientim = [];
                    Successo();
                }
            }
        };
        xmlhttp.open("POST", "php/ModificaRicetta.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("nuovonome=" + nuovonome + "&nuovadescrizione=" + nuovadescrizione +
        "&vecchionome=" + nomericetta+ "&listaingredienti="+isoningredienti+"&modifica="+cambiato);
    }
}



function CercaSostituisci(figlio, elemento, id, testo ){
    "use strict";
    var padre = figlio.parentNode;
    var elem = document.createElement(elemento);
    if(id) {
        elem.id = id;
    }
    elem.textContent = testo;
    padre.removeChild(figlio);
    padre.appendChild(elem);
    return testo;
}


function Annulla(){
    "use strict";
    /*bottone*/
    var button = document.getElementById("ModificaRicetta");
    button.textContent = "Modifica";
    button.onclick = ModificaRicetta;
    /*descrizione*/
    CercaSostituisci(document.getElementById("modificatestoricetta"), "P", "descrizionericetta", descrizionericetta );
    /*nome*/
    CercaSostituisci(document.getElementById("modificanome"), "P", "NomeRicettaSceda", nomericetta);
    /*tabella*/
    for(var j = 0; j< lunghezzaoriginale; j++){
        CercaSostituisci(document.getElementById("mostraingredienti").childNodes[j+1].childNodes[3], "TD", 0 , ingredientim[j].quanto);
    }
    var lunghezza = ingredientim.length;
    for(var j = lunghezzaoriginale; j<lunghezza; j++){
        eliminaDOMfiglio(document.getElementById("mostraingredienti").childNodes[j+1]);
        eliminadasolo(document.getElementById("mostraingredienti").childNodes[j+1]);
        ingredientim.pop();
    }
    /*elimino esegui*/
    document.getElementById("esegui").parentNode.removeChild(document.getElementById("esegui"));
    /*elimino form inserimento ingredienti*/
    var contenitoreform = document.getElementById("aggiungiingrediente");
    eliminaDOMfiglio(contenitoreform);
    var father = contenitoreform.parentNode;
    father.removeChild(contenitoreform);
    /*  sistemo le classi di blococdestro e sinistro*/
    document.getElementById("bloccosinistro").className = "premodifica";
    document.getElementById("bloccodestro").className = "premodifica";

}


function CercaSostituisciTAB(figlio, classe, testo , tipo){
    "use strict";
    var padre = figlio.parentNode;
    var cella = document.createElement("TD");
    var input = document.createElement("INPUT");
    input.className = classe;
    input.type = tipo;
    input.value = testo;
    cella.appendChild(input);
    padre.removeChild(figlio);
    padre.appendChild(cella);
    return testo;
}



function CercaSostituisciInput(figlio,tag , idoclasse, id, valore, tipo){//se idoclasse =0 id se 1 classe
    "use strict";
    var padre = figlio.parentNode;
    var input = document.createElement(tag);
    if(idoclasse) {
        input.className = id;
    }else{
        input.id = id;
    }
    if(tipo){
        input.type = tipo;
    }
    input.value = valore;
    padre.removeChild(figlio);
    padre.appendChild(input);
    return input;
}
