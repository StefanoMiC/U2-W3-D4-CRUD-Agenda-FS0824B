const isLoading = bool => {
  const spinner = document.querySelector(".spinner-border");
  if (bool) {
    spinner.classList.remove("d-none");
  } else {
    spinner.classList.add("d-none");
  }
};

const generateAlert = msg => {
  const ul = document.getElementById("appointments-list");
  const alert = document.createElement("div");

  alert.className = "alert alert-danger";
  alert.innerText = msg;

  ul.parentNode.insertBefore(alert, ul);
};

const getAppointments = function () {
  // al caricamento del dom (pagina), avviamo una chiamata HTTP di tipo GET (implicito)
  fetch("https://striveschool-api.herokuapp.com/api/agenda/")
    .then(response => {
      console.log(response);
      if (response.ok) {
        // restituiamo il dato convertito in array da JSON
        return response.json();
      } else {
        throw new Error(`Ci dispiace, non siamo riusciti a reperire i dati. Errore: ${response.statusText}`);
      }
    })
    .then(appointments => {
      // otteniamo l'array come parametro appointments
      // qui dentro ci saremo nel momento esatto in cui avremo ricevuto il dato,
      // è il punto giusto per fare tutta la DOM Manipulation che serve
      const ul = document.getElementById("appointments-list");

      // cicliamo appointments per generare tanti elementi "li" nella pagina quanti sono gli oggetti contenuti nell'array
      appointments.forEach(appoinment => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex align-items-center";
        listItem.innerHTML = `<span class="me-auto">${appoinment.name}</span> 
        <span class="badge ${appoinment.price > 0 ? "text-bg-dark" : "text-bg-success"} me-2">
        ${appoinment.price > 0 ? appoinment.price + "€" : "gratis"}</span>
        <a href="./details.html?appId=${appoinment._id}">VEDI DETTAGLI</a>`;
        ul.appendChild(listItem);
      });
    })
    .catch(error => {
      generateAlert(error.message);
      console.log(error);
    })
    .finally(() => {
      isLoading(false); // stiamo rendendo invisibile lo spinner sia in caso di successo sia di errore
    });
};

window.addEventListener("DOMContentLoaded", function () {
  getAppointments();
});
