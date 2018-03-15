// Ejecuta la función init cuando el document esté listo
$(document).ready(function () {
    $('#enviar').click(function () {
        init();
    });
});
// Funcion para inizialiar la ejecuccion de las funciones que crean el datatable y el gráfico
function init() {
    const fechas = [];
    fechas.push($('#f_inicio').val());
    fechas.push($('#f_fin').val());

    const urlAjax = 'https://crono.veosat.es/server/informes/test_informe.php';
    const urlIdiomaDataTable = 'https://cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json';

    const divChart = document.getElementById('chart');
    crearDataTable(urlAjax, urlIdiomaDataTable, fechas);
    generarGrafico(urlAjax, fechas, divChart);
}

function crearDataTable(url, urlIdioma, fechas) {
    $('#tabla').DataTable({
        retrieve: true,
        "language": {
            "url": urlIdioma
        },
        "ajax": {
            dataSrc: 'datos',
            url: url,
            type: "POST",
            dataType: "json",
            data: {
                f_inicio: fechas[0],
                f_fin: fechas[1]
            },
            error: function () {
                console.log("Error en la petición ajax.");
            }
        },
        columns: [{
            title: "#",
            data: "veh_id"
        }, {
            data: "mostrar"
        }, {
            title: "Fecha",
            data: "fecha",
            render: function (d) {
                return d.substr(0, 4) + "/" + d.substr(4, 2) + "/" + d.substr(6, 2);
            }
        }, {
            data: "ti1"
        }, {
            data: "ti2"
        }, {
            data: "ti3"
        }, {
            data: "ti4"
        }, {
            data: "d1"
        }, {
            data: "d2"
        }, {
            data: "d3"
        }, {
            data: "d4"
        }, {
            data: "t1_ralenti"
        }, {
            data: "t1_parado"
        }, {
            data: "t_conducido"
        }, {
            data: "v_max"
        }, {
            data: "v_media"
        }, {
            data: "a_fecha",
            render: function (d) {
                return d.substr(0, 4) + "/" + d.substr(4, 2) + "/" + d.substr(6, 2) + "  " + d.substr(8, 2) + ":" + d.substr(10, 2);
            }
        }, {
            data: "a_coor"
        }, {
            data: "p_fecha",
            render: function (d) {
                return d.substr(0, 4) + "/" + d.substr(4, 2) + "/" + d.substr(6, 2) + "  " + d.substr(8, 2) + ":" + d.substr(10, 2);
            }
        }, {
            data: "p_coor"
        }, {
            data: "consumo"
        }, {
            data: "consumo_medio"
        }, {
            data: "consumo_ralenti"
        }, {
            data: "consumo_conduccion"
        }, {
            data: "d1_parado"
        }, {
            data: "consumo_medio_conduccion"
        }, {
            data: "veh_desc"
        }, {
            data: "a_direccion"
        }, {
            data: "p_direccion"
        }]
    });
}

function generarGrafico(url, fechas, divChart) {
    function charts(data, ChartType) {
        let c = ChartType;
        let jsonData = data;
        google.charts.load('current', {
            'packages': ['bar']
        });
        google.charts.setOnLoadCallback(drawVisualization);

        function drawVisualization() {
            let data = new google.visualization.DataTable();
            data.addColumn('string', 'Día');
            data.addColumn('number', 'Kms');
            $.each(jsonData, function (i, jsonData) {
                let value = parseFloat(jsonData.d1);
                let fecha = jsonData.fecha;
                let name = fecha.substr(6, 2) + '/' + fecha.substr(4, 2) + '/' + fecha.substr(0, 4);
                data.addRows([
                    [name, value]
                ]);
            });

            let options = {
                title: "Word Population Density",
                colorAxis: {
                    colors: ['#54C492', '#cc0000']
                },
                datalessRegionColor: '#dedede',
                defaultColor: '#dedede'
            };
            let chart = new google.charts.Bar(divChart);
            chart.draw(data, options);
        }
    }

    function getDataFromServer() {
        $.post(url, {
                f_inicio: fechas[0],
                f_fin: fechas[1]
            },
            function (data, status) {
                let datos = JSON.parse(data);
                datos = datos.datos;
                charts(datos);
            }
        );
    }

    getDataFromServer();
}