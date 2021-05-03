var globalConfirmados = document.querySelector('#global-confirmados');
var globalMuertos = document.querySelector('#global-muertos');
var mexicoActivos = document.querySelector('#mexico-activos');
var mexicoPorcentaje = document.querySelector('#mexico-porcentaje');

document.addEventListener('DOMContentLoaded', function () {
    console.log("¡Estamos en vivo!");
    actualizarDatosCovid();
});

function actualizarDatosCovid() {
    var url = "https://covid-api.mmediagroup.fr/v1/cases"

    fetch(url)
        .then(function (response) {
            response.json()
                .then(function (json) {
                    //console.log(json);
                    //console.log(json.Guanajuato.confirmed);
                    //globalConfirmados.textContent = json.Global.All.confirmed;
                    //globalMuertos.textContent = json.Global.All.deaths;
                    //mexicoActivos.textContent = json.Mexico.All.confirmed - json.Mexico.All.recovered;
                    //mexicoPorcentaje.textContent = (((json.Mexico.All.confirmed + json.Mexico.All.recovered + json.Mexico.All.deaths) * 100) / json.Mexico.All.population).toPrecision(2);
                    animateValue(globalConfirmados, 0, json.Global.All.confirmed, 1000);
                    animateValue(globalMuertos, 0, json.Global.All.deaths, 1000);
                    animateValue(mexicoActivos, 0, json.Mexico.All.confirmed - json.Mexico.All.recovered, 1000);
                    animateValue(mexicoPorcentaje, 0, (((json.Mexico.All.confirmed + json.Mexico.All.recovered + json.Mexico.All.deaths) * 100) / json.Mexico.All.population).toPrecision(2), 1000);
                })
        });
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        obj.innerHTML = new Intl.NumberFormat("es-MX", {maximumFractionDigits:2}).format(Math.floor(progress * (end - start) + start));
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}