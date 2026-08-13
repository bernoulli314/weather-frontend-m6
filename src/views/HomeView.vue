<script>
import {
    planetas_ss,
    exoplanetas
} from '../data/datos.js'

export default {
    data() {
        return {
            categoria: 'sistemaSolar',
            busqueda: '',
            unidad: 'C',
            planetas_ss,
            exoplanetas
        }
    },

    computed: {
        planetasFiltrados() {

            let lista

            if (this.categoria === 'sistemaSolar') {
                lista = this.planetas_ss
            } else {
                lista = this.exoplanetas
            }

            return lista.filter(planeta =>
                planeta.nombre
                    .toLowerCase()
                    .includes(
                        this.busqueda.toLowerCase()
                    )
            )
        }
    },
    methods: {
        convertirTemperatura(temp) {
            if (this.unidad === 'C') {
                return temp
            }

            return (temp * 9 / 5) + 32
        },

        cambiarUnidad() {
            this.unidad = this.unidad === 'C' ? 'F' : 'C'
        },

        volverArriba() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    }
}
</script>

<template>

    <main class="weather-content">

        <!-- Botones para cambiar de categoría -->
        <div class="navbar-nav d-flex flex-row flex-wrap">

            <button
                class="mb-2 btn btn--ss"
                @click="categoria = 'sistemaSolar'"
            >
                Sistema Solar
            </button>

            <button
                class="mb-2 btn btn--exo"
                @click="categoria = 'exoplanetas'"
            >
                Exoplanetas
            </button>

            <button
                class="mb-2 btn btn--footer"
                @click="cambiarUnidad"
            >
                Cambiar a °{{ unidad === 'C' ? 'F' : 'C' }}
            </button>

            <a class="nav-link btn"
                href="https://science.nasa.gov/"
                target="_blank"
                rel="noopener noreferrer">
                Acerca de
            </a>

        </div>


        <!-- Buscador -->

        <h1 class="text-center mb-3 fw-bold weather-content__titulo">
            PRONÓSTICO GALÁCTICO
        </h1>

        <p class="text-center weather-content__texto">
            ¿Quieres conocer el tiempo de tu planeta favorito? ¡Búscalo aquí!
        </p>

        <form
            class="input-group weather-content__input"
            @submit.prevent
        >

            <span class="input-group-text">🌌</span>
            <input
                type="text"
                class="form-control"
                v-model="busqueda"
                placeholder="Tu planeta favorito..."
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
            class="weather-content__grid row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4 mt-3"
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

                            {{ convertirTemperatura(planeta.temp) }}°{{ unidad }}

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

        <aside class="p-4 rounded shadow-sm mt-5 aside">

                <h5 class="text-center aside__texto">
                    *Planetas enanos
                </h5>

                <h3 class="text-danger mt-3 aside__titulo">
                    Más información:
                </h3>

                <p class="aside__texto">
                    Conoce más sobre tus planetas favoritos en
                    <a
                        href="https://science.nasa.gov/solar-system/planets/"
                        target="_blank"
                        rel="noopener noreferrer">
                        este enlace
                    </a>
                    o haciendo click en el siguiente logo
                </p>

                <a
                    href="https://science.nasa.gov/solar-system/planets/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="d-block text-center">
                    <img
                        class="img-fluid aside__img"
                        width="100"
                        alt="NASA Logo"
                        src="https://science.nasa.gov/wp-content/themes/nasa-child/assets/images/nasa-logo.svg">
                </a>
            </aside>

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

<style lang="scss" scoped></style>