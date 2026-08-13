<script setup>

import { ref, computed } from 'vue'
import { todosLosPlanetas } from '../data/datos.js'
import {
    calcularEstadisticasPlaneta
} from '../utils/clima.js'
import WeatherApp from '../classes/WeatherApp.js'

// Recibimos el id desde Vue Router
const props = defineProps({

    id: {
        type: String,
        required: true
    }

})

// Buscamos el planeta correspondiente al id
const planeta = computed(() => {

    return todosLosPlanetas.find(
        p => p.id === props.id
    )

})

// Calculamos las estadísticas del planeta
const estadisticas = computed(() => {

    if (!planeta.value) {
        return null
    }

    return calcularEstadisticasPlaneta(
        planeta.value.pronostico
    )

})

// Categorías de temperatura
const categorias = computed(() => {

    if (!estadisticas.value) {
        return []
    }

    return [

        {
            nombre: '🧊 Mundo Congelado (-∞ a -5 °C)',
            dias: estadisticas.value.diasCongelados
        },

        {
            nombre: '🌍 Temperaturas Habitables (-4 a 100 °C)',
            dias: estadisticas.value.diasHabitables
        },

        {
            nombre: '🌋 Infierno Volcánico (101 a 2000 °C)',
            dias: estadisticas.value.diasVolcanicos
        },

        {
            nombre: '☀️ Dominio Estelar (2001 a 6000 °C)',
            dias: estadisticas.value.diasEstelares
        },

        {
            nombre: '⚛️ Reino del Plasma (+6000 °C)',
            dias: estadisticas.value.diasPlasma
        }

    ]

})

// ===================================
// TIERRA / OPEN-METEO
// ===================================

// Instancia de nuestra aplicación del clima
const weatherApp = new WeatherApp()

// Campos del formulario
const ciudad = ref('')
const pais = ref('')

// Resultado de la búsqueda
const resultadoClima = ref(null)

// Estado de carga
const cargando = ref(false)

// Error de búsqueda
const errorClima = ref('')

// -----------------------------------
// Buscar clima
// -----------------------------------

const buscarClima = async () => {

    errorClima.value = ''

    resultadoClima.value = null

    cargando.value = true

    try {

        resultadoClima.value =
            await weatherApp.buscarCiudad(
                ciudad.value,
                pais.value
            )

    } catch (error) {

        errorClima.value =
            error.message

    } finally {

        cargando.value = false

    }

}

const volverArriba = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }

</script>

<template>

    <main class="weather-content">

        <!-- Si encontramos el planeta -->
        <div v-if="planeta">

            <RouterLink
                to="/"
                class="btn btn-outline-info mb-4"
            >
                ← Volver al inicio
            </RouterLink>


            <!-- Información principal -->
            <section class="row g-4">

                <!-- Imagen -->
                <div class="col-md-5">

                    <div class="card place-card h-100">

                        <div class="card-img-top">

                            <img
                                :src="planeta.imagen_url"
                                :alt="planeta.nombre"
                                class="img-fluid"
                            >

                        </div>

                    </div>

                </div>

                <!-- Información -->
                <div class="col-md-7">

                    <h1 class="weather-content__titulo">
                        {{ planeta.icono }}
                        {{ planeta.nombre }}
                    </h1>

                    <p class="weather-content__texto">
                        💧 Humedad:
                        {{ planeta.humedad }}
                    </p>

                    <p class="weather-content__texto">
                        💨 Viento:
                        {{ planeta.viento }}
                    </p>

                    <p class="weather-content__texto">
                        ⚖️ Gravedad:
                        {{ planeta.gravedad }}
                    </p>

                    <p class="weather-content__texto">
                        🪨 Composición:
                        {{ planeta.composicion }}
                    </p>

                    <p class="weather-content__texto">
                        {{ planeta.descripcion }}
                    </p>

                </div>

            </section>

            <!-- ================================= -->
            <!-- BUSCADOR DE TIERRA -->
            <!-- ================================= -->

            <section
                v-if="planeta.id === 'tierra'"
                class="mt-5"
            >

                <h2 class="weather-content__titulo">
                    🌍 Buscar clima terrestre
                </h2>

                <form
                    @submit.prevent="buscarClima"
                    class="row g-3"
                >

                    <!-- Ciudad -->
                    <div class="col-md-5">

                        <label
                            for="ciudad"
                            class="form-label"
                        >
                            Ciudad
                        </label>

                        <input
                            id="ciudad"
                            type="text"
                            class="form-control"
                            v-model="ciudad"
                            placeholder="Ej: La Serena"
                            required
                        >

                    </div>

                    <!-- País -->
                    <div class="col-md-5">

                        <label
                            for="pais"
                            class="form-label"
                        >
                            País
                        </label>

                        <input
                            id="pais"
                            type="text"
                            class="form-control"
                            v-model="pais"
                            placeholder="Ej: Chile"
                            required
                        >

                    </div>

                    <!-- Botón -->
                    <div class="col-md-2 d-flex align-items-end">

                        <button
                            type="submit"
                            class="btn btn-outline-info w-100"
                            :disabled="cargando"
                        >

                            {{ cargando ? 'Buscando...' : 'Buscar' }}

                        </button>

                    </div>

                </form>

                <section
                    v-if="resultadoClima"
                    class="mt-5"
                >

                    <h2 class="weather-content__titulo">

                        📅 Pronóstico semanal

                    </h2>


                    <div class="row row-cols-1 row-cols-md-3 g-4">

                        <div
                            v-for="dia in resultadoClima.pronostico"
                            :key="dia.fecha"
                            class="col"
                        >

                            <div class="card h-100 place-card">

                                <div
                                    class="card-body text-center place-card__body"
                                >

                                    <h4 class="place-card__name">

                                        {{
                                            new Date(dia.fecha)
                                                .toLocaleDateString(
                                                    "es-CL",
                                                    {
                                                        weekday: "long"
                                                    }
                                                )
                                        }}

                                    </h4>


                                    <div class="display-4 place-card__icon">

                                        {{ dia.icono }}

                                    </div>


                                    <h4 class="place-card__temp">

                                        🌡️ max: {{ dia.maxima }}°C /
                                        min: {{ dia.minima }}°C

                                    </h4>


                                    <p class="place-card__status">

                                        {{ dia.estado }}

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                <!-- Error -->
                <p
                    v-if="errorClima"
                    class="weather-content__texto mt-3"
                >

                    ⚠️ {{ errorClima }}

                </p>

            </section>

            <!-- Estadísticas -->
            <section class="estadisticas-temp mt-5">

                <h2 class="weather-content__titulo">
                    📊 Estadísticas de temperatura
                </h2>

                <div class="row g-3">

                    <!-- Promedio -->
                    <div class="col-md-4">

                        <div class="place-card text-center h-100">

                            <div class="card-body">

                                <h4>🌡️ Promedio</h4>

                                <h2>
                                    {{ estadisticas.promedio }} °C
                                </h2>

                            </div>

                        </div>

                    </div>

                    <!-- Máxima -->
                    <div class="col-md-4">

                        <div class="place-card text-center h-100">

                            <div class="card-body">

                                <h4>🔺 Máxima</h4>

                                <h2>
                                    {{ estadisticas.tmax }} °C
                                </h2>

                            </div>

                        </div>

                    </div>

                    <!-- Mínima -->
                    <div class="col-md-4">

                        <div class="place-card text-center h-100">

                            <div class="card-body">

                                <h4>🔻 Mínima</h4>

                                <h2>
                                    {{ estadisticas.tmin }} °C
                                </h2>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            <!-- Clasificación térmica -->
            <section class="mt-5">

                <h2 class="weather-content__titulo">

                    🌡️ Clasificación térmica

                </h2>

                <div
                    v-for="categoria in categorias"
                    :key="categoria.nombre"
                    v-show="categoria.dias > 0"
                    class="mb-3"
                >

                    <h4 class="weather-content__texto">

                        {{ categoria.nombre }}:
                        {{ categoria.dias }} días

                    </h4>

                </div>


                <p class="weather-content__texto">

                    {{ estadisticas.resumen }}

                </p>

            </section>


            <!-- Pronóstico -->

            <section v-if="planeta.id !=='tierra'" class="mt-5">

                <h2 class="weather-content__titulo">

                    📅 Pronóstico semanal

                </h2>


                <div class="row row-cols-1 row-cols-md-3 g-4">

                    <div
                        v-for="dia in planeta.pronostico"
                        :key="dia.dia"
                        class="col"
                    >

                        <div class="card h-100 place-card">

                            <div
                                class="card-body text-center place-card__body"
                            >

                                <h3 class="place-card__name">

                                    {{ dia.dia }}

                                </h3>


                                <div
                                    class="display-4 place-card__icon"
                                >

                                    {{ dia.icono }}

                                </div>


                                <h4 class="place-card__temp">

                                    {{ dia.temp }}

                                </h4>


                                <p class="place-card__status">

                                    {{ dia.estado }}

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


        </div>


        <!-- Si no existe el planeta -->

        <div v-else>

            <h1 class="weather-content__titulo">

                🔭 Lugar no encontrado

            </h1>


            <p class="weather-content__texto">

                No encontramos un planeta con el identificador
                "{{ id }}".

            </p>


            <RouterLink
                to="/"
                class="btn btn-outline-info"
            >
                ← Volver al inicio
            </RouterLink>

        </div>

    </main>

    <footer class="text-center p-3 mt-5 rounded footer">

            <div class="row">

                <div class="col-sm-12 mb-3">

                    <button
                        class="btn btn--footer"
                        @click="volverArriba">
                        Volver arriba
                    </button>

                </div>

            </div>

            <p class="mb-0 footer__texto">
                DERECHOS RESERVADOS 2026
                <br>
                CREADO POR BERNOULLI314
            </p>

    </footer>

</template>

<style lang="scss" scoped>

</style>