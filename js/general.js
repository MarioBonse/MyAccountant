var uso = 0;

function scrivirisultato(text){
    "use strict";
    if (uso == 1){
      return;
    }
    var testo = document.createTextNode(text);
    var rettangolo = document.getElementById("result");
    rettangolo.appendChild(testo);
}

function Successo(){
        if (uso == 1){
          return;
        }
        uso = 1;
        var rettangolo = document.getElementById("result")
        rettangolo.className = "mostra";
        rettangolo.style.backgroundColor = "#1B5E20";
        setTimeout(function(){
                                rettangolo.className = rettangolo.className.replace("mostra", "");
                                rettangolo.removeChild(rettangolo.firstChild);
                                uso = 0;
                              }, 3000);
}

function Fallimento(){
    "use strict";
    if (uso === 1){
      return;
    }
    uso = 1;
    var rettangolo = document.getElementById("result")
    rettangolo.className = "mostra";
    rettangolo.style.backgroundColor = "#D32F2F";
    setTimeout(function(){
                  rettangolo.className = rettangolo.className.replace("mostra", "");
                  rettangolo.removeChild(rettangolo.firstChild);
                  uso = 0;
                  }, 3000);
}

function espandi(val){
    "use strict";
    var tendine;
    val.classList.toggle("active");
    var panel = val.nextElementSibling;
    if (panel.style.maxHeight){
        if( tendine = panel.getElementsByClassName("Tendina")){
            for(var i =0; i<tendine.length; i++){
                tendine[i].style.display = "none";
            }
        }
        panel.style.maxHeight = null;
    } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
    }
}


function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

function RendiVisibileScheda(id){
    "use strict";
    var modalcontainer, box;
    box = document.getElementById(id);
    box.style.display = "block";
    modalcontainer = document.getElementById("modalcontainer");
    modalcontainer.style.display = "block";
}


function NascondiScheda(id){
    "use strict";
    var modalcontainer, box;
    box = document.getElementById(id);
    box.style.display = "none";
    modalcontainer = document.getElementById("modalcontainer");
    modalcontainer.style.display = "none";
}

function ChiudiScedaGrande(){
    "use strict";
    NascondiScheda("BoxScheda");
    var scheda = document.getElementById("BoxScheda");
    eliminaDOMsotto(scheda, 2);
}

function CreaRichiesta(){
    try {
        xmlhttp = new XMLHttpRequest();
    } catch (e1) {
        try {
            xmlhttp = new window.ActiveXObject("Msxml2.XMLHTTP");
        } catch (e2) {
            try {
                xmlhttp = new window.ActiveXObject("Microsoft.XMLHTTP");
            } catch (e3) {
                scrivirisultato("Attenzione, browser non supporta ajax");
                Fallimento();
                tendina.style.display = "none";
                return false;
            }
        }
    }
    return xmlhttp;
}

function eliminaDOMsotto(nodo, i){
    while (nodo.childNodes.length > i) {
        nodo.removeChild(nodo.lastChild);
    }
}


function eliminaDOMfiglio(nodo){
   "use strict";
    while (nodo.firstChild) {
        nodo.removeChild(nodo.firstChild);
    }
}


function eliminadasolo(nodo){
    "use strict";
    var father;
    father = nodo.parentNode;
    father.removeChild(nodo);
}

function CreaTitolo(){
    "use strict";
    var father = arguments[0];
    var riga = document.createElement("TR");
    for(var i= 1; i<arguments.length; i++){
        var cella = document.createElement("TH");
        var text = document.createTextNode(arguments[i])
        cella.appendChild(text);
        riga.appendChild(cella);
    }
    father.appendChild(riga);
}

function CreaTabella(){
    "use strict";
    var father = arguments[0];
    for(var j = 0; j<arguments[1].length; j++){
        var riga = document.createElement("TR");//creo riga
        for(var i = 1; i<arguments.length; i++){
            var cella = document.createElement("TD");
            var text = document.createTextNode(arguments[i][j]);
            cella.appendChild(text);
            riga.appendChild(cella);
        }
        father.appendChild(riga);
    }
}

function eliminacontenutorabella(tabella){
   "use strict";
   while(tabella.childNodes.length > 2){
     tabella.removeChild(tabella.lastChild);
   }
}

function creatitoloh3(father, text, classe ){
    "use strict";
    var title = document.createElement("H3");
    title.className = classe;
    title.appendChild(document.createTextNode(text));
    father.appendChild(title);
}

function CreaRiga(){
    "use strict";
    var father = arguments[0];
    var riga = document.createElement("TR");//creo riga
    for(var i = 1; i<arguments.length; i++){
        var cella = document.createElement("TD");
        cella.appendChild(arguments[i]);
        riga.appendChild(cella);
    }
    father.appendChild(riga);
}

function MessaggiaErrore(messaggio) {
    "use strict";
    scrivirisultato("Attenzione, "+messaggio);
    Fallimento();
}


function EliminaTabellaViasualizzazione(nodo1, nodo2){
    "use strict";
    eliminaDOMfiglio(nodo1);
    eliminaDOMfiglio(nodo2);
}

function CreaTabellaConFunzione(){//creo una tabella nella quale il primo elemento è un "a" con click una funzione
    "use strict";
    var father = arguments[0];
    var funzione = arguments[1];
    for(var j = 0; j<arguments[2].length; j++){
        var riga = document.createElement("TR");//creo riga
        for(var i = 2; i<arguments.length; i++){
            var cella = document.createElement("TD");
            var text = document.createTextNode(arguments[i][j]);
            if(i == 2){
                var link = document.createElement("A");
                link.appendChild(text);
                link.className = "link";
                cella.appendChild(link);
                link.onclick = funzione;
            }else {
                cella.appendChild(text);
            }
            riga.appendChild(cella);
        }
        father.appendChild(riga);
    }
}

function CreaTabellaConBottone(){//creo una tabella nella quale il primo elemento è un "a" con click una funzione
    "use strict";
    var father = arguments[0];
    var funzione = arguments[1];
    if(arguments[2]) {
        for (var j = 0; j < arguments[2].length; j++) {
            var riga = document.createElement("TR");//creo riga
            for (var i = 2; i <= arguments.length; i++) {
                var cella = document.createElement("TD");
                if (i == (arguments.length)) {
                    var button = document.createElement("BUTTON");
                    button.appendChild(document.createTextNode("modifica"));
                    button.className = "Modificatabella";
                    cella.appendChild(button);
                    cella.className = "contenitorebottone";
                    button.onclick = (function (j) {
                        return function () {
                            funzione(j);
                        };
                    })(j);
                } else {
                    var text = document.createTextNode(arguments[i][j]);
                    cella.appendChild(text);
                }
                riga.appendChild(cella);
            }
            father.appendChild(riga);
        }
    }
}
