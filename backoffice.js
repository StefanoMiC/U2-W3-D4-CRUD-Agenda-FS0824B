const params = new URLSearchParams(window.location.search);
const id = params.get("appId");
const URL = id ? "https://striveschool-api.herokuapp.com/api/agenda/" + id : "https://striveschool-api.herokuapp.com/api/agenda/";
const method = id ? "PUT" : "POST";

const handleSubmit = e => {
  // evitiamo il ricaricamento della pagina al click del bottone submit (e conseguente avvio dell'evento submit)
  e.preventDefault();

  // stiamo creando l'oggetto che verrà poi inviato con la nostra richiesta HTTP di tipo POST
  // questo oggetto si creerà solamente all'invio del form, NON PRIMA.
  // quando il form viene inviato, e di conseguenza quando partirà l'evento submit, i campi obbligatori saranno verosimilmente già riempiti

  const newAppointment = {
    name: e.target.elements.name.value,
    description: e.target.elements.description.value,
    time: e.target.elements.time.value,
    price: e.target.elements.price.value
  };

  // non ci rimane che inviare questo oggetto al server tramite fetch per poter essere salvato.
  // ci servono anche le opzioni per impostare i dati necessari: method, body, headers.
  // questi 3 parametri sono fondamentali per il funzionamento di POST e PUT!

  // il secondo parametro della fetch è un oggetto di opzioni
  // il metodo è una proprietà di queste opzioni
  // il body è un'altra proprietà di queste opzioni
  // gli heasders sono un'altra proprietà di queste opzioni e sono a loro volta un OGGETTO!

  // qui l'endpoint dipende da come siamo arrivati su questa pagina, se per creazione sarà solo l'url normale, se per modifica avrà anche l'id
  // questo è deciso dal ternary operator alla creazione della variabile "URL" in alto

  // PER LA CREAZIONE:
  // URL:  https://striveschool-api.herokuapp.com/api/agenda,
  // Method: POST,
  // Body (payload): oggetto stringhifizzato
  // Headers: oggetto (con Content-Type)

  // PER LA MODIFICA:
  // URL:  https://striveschool-api.herokuapp.com/api/agenda/:id_dinamico,
  // Method: PUT,
  // Body (payload): oggetto stringhifizzato
  // Headers: oggetto (con Content-Type)
  fetch(URL, {
    // method: id ? "PUT" : "POST",
    // method: method,
    method: method,
    body: JSON.stringify(newAppointment), // è fondamentale fare la stringhifizzazione dell'oggetto nativo o invieremo "[object Object]"
    // un header in particolare è importantissimo, il Content-Type, per specificare il formato di invio, altrimenti non verrà riconosciuto dal server
    // l'Authorization header serve in caso di API che richiedono autenticazione tramite una API Key
    headers: {
      // questo specifica al server il tipo di dato che abbiamo inviato. riuscirà quindi a convertirlo nell'elemento nativo
      "Content-Type": "application/json"
      // eventuale chiave di autenticazione va messa qui
      // Authorization: "Bearer [YOUR API KEY]",
    }
  })
    .then(resp => {
      if (resp.ok) {
        return resp.json();
      }
    })
    .then(newAppointment => {
      // qui dentro abbiamo l'assoluta certezza che il dato è stato creato

      // Aspettiamo il valore di newAppointment per estrarre un'informazione nuova generata dal server ad es. l'_id

      // in base a come siamo arrivati qui, per creazione o modifica, creeremo il messaggio più appropriato alla fine della richiesta
      if (id) {
        alert("abbiamo modificato la risorsa con id: " + newAppointment._id);
      } else {
        e.target.reset(); // reset dei campi del form solo in modalità CREAZIONE (POST)
        alert("abbiamo creato una nuova risorsa con id: " + newAppointment._id);
      }
    })
    .catch(err => console.log(err));
};

const handleDelete = () => {
  fetch(URL, { method: "DELETE" }) // già a questo punto la risorsa è stata eliminata
    .then(resp => {
      // aspettare con un then ci può essere utile anche solo per sapere esattamente quando il server ci ha risposto per avere ulteriore conferma
      if (resp.ok) {
        return resp.json();
      }
    })
    .then(deletedObj => {
      alert("la risorsa con id " + deletedObj._id + " è stata eliminata con successo");
      // l'alert è bloccante, questa operazione avverrà solo dopo che l'utente lo chiuderà
      // se non usassimo un alert qui servirebbe ritardare l'esecuzione del metodo assign di window,
      // ma siccome alert è "bloccante" in questo specifico caso non occorre
      window.location.assign("/");
    })
    .catch(err => console.log(err));
};

window.addEventListener("DOMContentLoaded", function () {
  // al caricarimento della pagina colleghiamo l'evento submit sul nostro form
  const form = document.querySelector("form");
  // form.addEventListener("submit", handleSubmit)
  // che a sua volta quando verrà eseguito, invocherà la nostra funzione handleSubmit
  form.onsubmit = handleSubmit;

  // prendo il riferimento ai bottoni e al sottotitolo che modificheremo in seguito
  const submitBtn = document.querySelector("button[type=submit]");
  const deleteBtn = document.getElementById("deleteBtn");
  const subtitle = document.getElementById("subtitle");

  // 0) inizio codice di gestione modalità modifica
  // al caricamento della pagina facciamo richiesta al server di tornarci i dati specifici della risorsa con l'id che troviamo nella URL
  if (id) {
    // se siamo qua dentro siamo sulla pagina in modalità MODIFICA per via della presenza di un id
    // 1) il testo del subtitle e del bottone submit dovranno riflettere la modalità di modifica
    subtitle.innerText = "— Modifica risorsa";

    submitBtn.classList.add("btn-success");
    submitBtn.innerText = "Modifica";

    // 2) il bottone delete diventa visibile
    deleteBtn.classList.remove("d-none");
    // 3) assegnamo al bottone un evento di tipo click
    deleteBtn.onclick = handleDelete;

    // 4) prepopoliamo i campi con i dati di ritorno dalla chiamata su get specifica con id della risorsa
    fetch(URL)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw new Error(`Ci dispiace, non siamo riusciti a reperire i dati. Errore: ${response.statusText}`);
        }
      })
      .then(appointment => {
        console.log(appointment);
        const { name, time, description, price } = appointment;

        // prepopolazione campi input con valori reperiti dal server su risorsa specifica
        // (per agevolare l'utente ed evitare errori di battitura)
        document.getElementById("name").value = name;
        document.getElementById("time").value = time.split(".")[0];
        document.getElementById("description").value = description;
        document.getElementById("price").value = price;
      });
  } else {
    // qui dentro ci entriamo quando siamo in modalità CREAZIONE per via dell'assenza dell'id
    subtitle.innerText = "— Crea risorsa";
    submitBtn.classList.add("btn-primary");
  }
});
