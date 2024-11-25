// Appena si avvia lo script cercherà nell'oggetto window il riferimento alla location.search, che è una stringa
// questa stringa viene passata al costruttore URLSearchParams per generare un oggetto avanzato con cui possiamo
// gestire il singolo parametro che abbiamo nella URL in questo momento
// o una serie di parametri che potrebbero esserci nella URL in uno scenario più realistico.

const URL = "https://striveschool-api.herokuapp.com/api/agenda/";
const params = new URLSearchParams(window.location.search); // oggetto costruito a partire dai parametri nella URL es. ?appId=2938123
const id = params.get("appId"); // metodo sull'oggetto URLSearchParams che ci estrae il valore corrispondente alla chiave "appId" da noi scelta e
// applicata al link in homepage
console.log("RESOURCE ID:", id);
window.addEventListener("DOMContentLoaded", function () {
  // al caricamento della pagina facciamo richiesta al server di tornarci i dati specifici della risorsa con l'id che troviamo nella URL

  fetch(URL + id)
    .then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error(`Ci dispiace, non siamo riusciti a reperire i dati. Errore: ${response.statusText}`);
      }
    })
    .then(appointment => {
      // destrutturazione dell'oggetto appointment
      const { name, time, description, price, _id, createdAt, updatedAt } = appointment;

      const appointmentContainer = document.getElementById("appointments-details");

      // svuotiamo il contenitore (togliendo anche lo spinner di conseguenza) e creiamo la struttura già con i dati ottenuti dal server
      appointmentContainer.innerHTML = `
        
                    <h1 class="display-5">${name}</h1>
                    <p class="font-monospace">${new Date(time).toLocaleString()}</p>
                    <p class="lead">${description}</p>
                    <p class="display-6 text-primary">${price > 0 ? price + "€" : "gratis"}</p>
                    <h6 class="bg-light ps-2 py-3">Server Details:</h6>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item ps-2"><strong>id:</strong> ${_id}</li>
                        <li class="list-group-item ps-2"><strong>createdAt:</strong> ${new Date(createdAt).toLocaleString()}</li>
                        <li class="list-group-item ps-2"><strong>updatedAt:</strong> ${new Date(updatedAt).toLocaleString()}</li>
                    </ul>
                    <button class="btn btn-success" onclick="handleClick()">Modifica</button>
                    <a class="btn btn-success" href="./backoffice.html?appId=${id}">Modifica2</a>
    
        `;
    })
    .catch(err => console.log(err));
});

const handleClick = () => {
  window.location.assign("./backoffice.html?appId=" + id);
};
