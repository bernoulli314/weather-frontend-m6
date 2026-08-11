// Convierte los códigos meteorológicos de Open-Meteo
// en una descripción y un ícono.

export function obtenerDescripcionClima(codigo) {

    switch (codigo) {

        case 0:
            return {
                descripcion: "Despejado",
                icono: "☀️"
            };

        case 1:
            return {
                descripcion: "Mayormente despejado",
                icono: "🌤️"
            };

        case 2:
            return {
                descripcion: "Parcialmente nublado",
                icono: "⛅"
            };

        case 3:
            return {
                descripcion: "Nublado",
                icono: "☁️"
            };

        case 48:
            return {
                descripcion: "Niebla",
                icono: "🌫️"
            };

        case 51:
            return {
                descripcion: "Llovizna ligera",
                icono: "🌦️"
            };

        case 53:
            return {
                descripcion: "Llovizna moderada",
                icono: "🌦️"
            };

        case 55:
            return {
                descripcion: "Llovizna intensa",
                icono: "🌧️"
            };

        case 56:
            return {
                descripcion: "Llovizna helada ligera",
                icono: "🥶"
            };

        case 57:
            return {
                descripcion: "Llovizna helada intensa",
                icono: "🧊"
            };

        case 61:
            return {
                descripcion: "Lluvia ligera",
                icono: "🌦️"
            };

        case 63:
            return {
                descripcion: "Lluvia moderada",
                icono: "🌧️"
            };

        case 65:
            return {
                descripcion: "Lluvia intensa",
                icono: "🌧️"
            };

        case 66:
            return {
                descripcion: "Lluvia helada ligera",
                icono: "🥶"
            };

        case 67:
            return {
                descripcion: "Lluvia helada intensa",
                icono: "🧊"
            };

        case 71:
            return {
                descripcion: "Nevada ligera",
                icono: "🌨️"
            };

        case 73:
            return {
                descripcion: "Nevada moderada",
                icono: "❄️"
            };

        case 75:
            return {
                descripcion: "Nevada intensa",
                icono: "❄️"
            };

        case 77:
            return {
                descripcion: "Granos de nieve",
                icono: "🧊"
            };

        case 80:
            return {
                descripcion: "Chubascos ligeros",
                icono: "🌦️"
            };

        case 81:
            return {
                descripcion: "Chubascos moderados",
                icono: "🌧️"
            };

        case 82:
            return {
                descripcion: "Chubascos intensos",
                icono: "⛈️"
            };

        case 85:
            return {
                descripcion: "Nevadas intermitentes",
                icono: "🌨️"
            };

        case 86:
            return {
                descripcion: "Nevadas intensas",
                icono: "❄️"
            };

        case 95:
            return {
                descripcion: "Tormenta eléctrica",
                icono: "⛈️"
            };

        case 96:
            return {
                descripcion: "Tormenta con granizo ligero",
                icono: "⛈️🧊"
            };

        case 99:
            return {
                descripcion: "Tormenta con granizo intenso",
                icono: "🌩️🧊"
            };

        default:
            return {
                descripcion: "Condición desconocida",
                icono: "❓"
            };
    }
}


// Obtiene el clima actual desde la respuesta de Open-Meteo.

export function obtenerClimaActual(datosClima) {

    return {
        temperatura: datosClima.current.temperature_2m,

        estado: obtenerDescripcionClima(
            datosClima.current.weather_code
        )
    };
}


// Prepara el pronóstico para poder mostrarlo fácilmente
// mediante un v-for en Vue.

export function obtenerPronostico(datosClima) {

    const pronostico = [];

    const dias = datosClima.daily.time;
    const maximas = datosClima.daily.temperature_2m_max;
    const minimas = datosClima.daily.temperature_2m_min;
    const codigos = datosClima.daily.weather_code;

    for (let i = 0; i < dias.length; i++) {

        const estado = obtenerDescripcionClima(
            codigos[i]
        );

        pronostico.push({

            fecha: dias[i],

            maxima: maximas[i],

            minima: minimas[i],

            estado: estado.descripcion,

            icono: estado.icono

        });
    }

    return pronostico;
}


// Calcula las estadísticas de la semana
// utilizando los datos obtenidos desde Open-Meteo.

export function calcularEstadisticas(datosClima) {

    const maximas =
        datosClima.daily.temperature_2m_max;

    const minimas =
        datosClima.daily.temperature_2m_min;

    const codigos =
        datosClima.daily.weather_code;


    const promedios = [];

    for (let i = 0; i < maximas.length; i++) {

        promedios.push(
            (maximas[i] + minimas[i]) / 2
        );
    }


    let suma = 0;

    for (const temperatura of promedios) {

        suma += temperatura;

    }


    const promedio =
        suma / promedios.length;

    const maxima =
        Math.max(...maximas);

    const minima =
        Math.min(...minimas);


    let diasSoleados = 0;

    let diasLluviosos = 0;


    for (const codigo of codigos) {

        if (codigo === 0) {
            diasSoleados++;
        }

        if (codigo >= 61 && codigo <= 65) {
            diasLluviosos++;
        }
    }


    return {

        promedio: promedio.toFixed(1),

        maxima,

        minima,

        diasSoleados,

        diasLluviosos

    };
}


// Genera las alertas meteorológicas
// utilizando las estadísticas calculadas.

export function obtenerAlertas(estadisticas) {

    const alertas = [];


    if (estadisticas.promedio > 30) {

        alertas.push(
            "🔥 Alerta de calor."
        );

    }


    if (estadisticas.diasLluviosos >= 3) {

        alertas.push(
            "🌧️ Semana lluviosa."
        );

    }


    if (alertas.length === 0) {

        alertas.push(
            "✅ No existen alertas meteorológicas."
        );

    }


    return alertas;
}


// Calcula las estadísticas específicas
// de los planetas utilizando su pronóstico mock.

export function calcularEstadisticasPlaneta(pronostico) {

    let suma = 0;

    let max = parseInt(
        pronostico[0].temp
    );

    let min = parseInt(
        pronostico[0].temp
    );


    let diasCongelados = 0;

    let diasHabitables = 0;

    let diasVolcanicos = 0;

    let diasEstelares = 0;

    let diasPlasma = 0;


    for (const dia of pronostico) {

        const temperatura =
            parseInt(dia.temp);


        suma += temperatura;


        if (temperatura > max) {
            max = temperatura;
        }


        if (temperatura < min) {
            min = temperatura;
        }


        if (temperatura <= -5) {

            diasCongelados++;

        } else if (
            temperatura > -5 &&
            temperatura <= 100
        ) {

            diasHabitables++;

        } else if (
            temperatura > 100 &&
            temperatura <= 2000
        ) {

            diasVolcanicos++;

        } else if (
            temperatura > 2000 &&
            temperatura <= 6000
        ) {

            diasEstelares++;

        } else {

            diasPlasma++;

        }
    }


    const categorias = {

        "Mundo Congelado":
            diasCongelados,

        "Temperaturas Habitables":
            diasHabitables,

        "Infierno Volcánico":
            diasVolcanicos,

        "Dominio Estelar":
            diasEstelares,

        "Reino del Plasma":
            diasPlasma

    };


    const descripciones = {

        "Mundo Congelado":
            "Temperaturas donde predominan hielos, océanos congelados y atmósferas extremadamente frías.",

        "Temperaturas Habitables":
            "Zona compatible con agua líquida y condiciones similares a las de la Tierra.",

        "Infierno Volcánico":
            "Rocas incandescentes, volcanismo extremo y ambientes incompatibles con la vida terrestre.",

        "Dominio Estelar":
            "Temperaturas comparables a las superficies de muchas estrellas, donde la materia comienza a comportarse de formas extremas.",

        "Reino del Plasma":
            "Materia completamente ionizada, radiación intensa y condiciones propias de estrellas muy calientes y fenómenos energéticos."

    };


    let categoriaMayor = "";

    let mayor = -1;


    for (const categoria in categorias) {

        if (categorias[categoria] > mayor) {

            mayor = categorias[categoria];

            categoriaMayor = categoria;

        }
    }


    return {

        promedio:
            Math.round(
                (suma / pronostico.length) * 100
            ) / 100,

        tmax: max,

        tmin: min,

        diasCongelados,

        diasHabitables,

        diasVolcanicos,

        diasEstelares,

        diasPlasma,

        resumen:
            descripciones[categoriaMayor]

    };
}