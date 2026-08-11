<script setup>

import { ref, computed } from 'vue'

import {
    planetas_ss,
    exoplanetas
} from '../data/datos.js'


// Categoría actualmente seleccionada

const categoria = ref('sistemaSolar')


// Texto ingresado en el buscador

const busqueda = ref('')


// Lista de planetas que se muestra en pantalla

const planetasFiltrados = computed(() => {

    let lista

    if (categoria.value === 'sistemaSolar') {

        lista = planetas_ss

    } else {

        lista = exoplanetas

    }


    return lista.filter(planeta =>

        planeta.nombre
            .toLowerCase()
            .includes(
                busqueda.value.toLowerCase()
            )

    )

})

</script>


<template>

    <main class="weather-content">

        <!-- Título -->

        <h1 class="weather-content__titulo">

            🌌 El Tiempo en tu Planeta

        </h1>


        <!-- Botones para cambiar de categoría -->

        <div class="weather-content__filtros">

            <button
                class="btn btn-outline-info"
                @click="categoria = 'sistemaSolar'"
            >
                Sistema Solar
            </button>


            <button
                class="btn btn-outline-info"
                @click="categoria = 'exoplanetas'"
            >
                Exoplanetas
            </button>

        </div>


        <!-- Buscador -->

        <form
            class="weather-content__busqueda"
            @submit.prevent
        >

            <input
                type="text"
                class="form-control"
                v-model="busqueda"
                placeholder="Buscar planeta..."
            >

        </form>


        <!-- Mensaje cuando no hay resultados -->

        <p
            v-if="planetasFiltrados.length === 0"
            class="weather-content__texto"
        >

            🔭 No se encontró ningún planeta.

        </p>


        <!-- Tarjetas -->

        <div
            v-else
            id="contenedor_planetas"
            class="row row-cols-1 row-cols-md-3 g-4"
        >

            <div
                v-for="planeta in planetasFiltrados"
                :key="planeta.id"
                class="col"
            >

                <div class="card h-100 place-card">

                    <div class="card-body place-card__body">

                        <h5 class="place-card__name">

                            {{ planeta.nombre }}

                        </h5>


                        <div class="icono-planeta place-card__icon">

                            {{ planeta.icono }}

                        </div>


                        <div class="temperatura place-card__temp">

                            {{ planeta.temp }}

                        </div>


                        <p class="estado place-card__status">

                            {{ planeta.estado }}

                        </p>


                        <RouterLink
                            :to="`/lugar/${planeta.id}`"
                            class="btn btn-outline-info place-card__link"
                        >

                            Ver detalle

                        </RouterLink>

                    </div>

                </div>

            </div>

        </div>

    </main>

</template>