var globalConfirmados = document.querySelector('#global-confirmados');
var globalMuertos = document.querySelector('#global-muertos');
var mexicoActivos = document.querySelector('#mexico-activos');
var mexicoPorcentaje = document.querySelector('#mexico-porcentaje');
var tituloPrincipal = document.querySelector("#titulo-principal");

var datosGrafico = {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Datos COVID-19'
    },
    xAxis: {
        categories: []//Aquí van los paises
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Valores'
        }
    },
    tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true
    },
    plotOptions: {
        column: {
            stacking: 'percent'
        }
    },
    series: [{
        name: 'Activos',
        data: []
    }, {
        name: 'Recuperados',
        data: []
    }, {
        name: 'Muertos',
        data: []
    }]
};

document.addEventListener('DOMContentLoaded', function () {
    console.log("¡Estamos en vivo!");
    actualizarDatosCovid();
    animateText(tituloPrincipal, 1, 32, "px", 1500);
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

                    /*datosGrafico.xAxis.categories.push("Afganistan");
                    datosGrafico.series[0].data.push(10);
                    datosGrafico.series[1].data.push(10);
                    datosGrafico.series[2].data.push(10);*/

                    for (var key in json) {
                        if (json.hasOwnProperty(key)) {
                            if (json[key].All.continent == "North America"){
                                datosGrafico.xAxis.categories.push(json[key].All.country);
                                datosGrafico.series[0].data.push(json[key].All.confirmed - json[key].All.recovered - json[key].All.deaths);
                                datosGrafico.series[1].data.push(json[key].All.recovered);
                                datosGrafico.series[2].data.push(json[key].All.deaths);
                            }
                        }
                    }

                    Highcharts.chart('grafico', datosGrafico);
                })
        });
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        obj.innerHTML = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2 }).format(Math.floor(progress * (end - start) + start));
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function animateText(obj, startSize, endSize, unit, duration) {
    let startTimestamp = null;

    const stepAnimateText = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        //const progess = (timestamp - startTimestamp)/duration;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const size = Math.ceil(progress * (endSize - startSize) + startSize);
        const customStyle = { 'font-size': size + unit };
        Object.assign(obj.style, customStyle);

        if (progress < 1) {
            window.requestAnimationFrame(stepAnimateText);
        }
    }
    window.requestAnimationFrame(stepAnimateText);
}