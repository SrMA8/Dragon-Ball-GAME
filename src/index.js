import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/main.css';

import Swal from "sweetalert2";
import Acciones from "./Acciones.js";
import { atk_basico, atk_especial, cargar_ki, usar_semilla } from './interfaz.js';

const audioSeleccion = new Audio('./audios/pelea.mp4');
const audioRound = new Audio('./audios/roud.mp3');
const audioCombate = new Audio('./audios/portaDBZ.mp4');

audioSeleccion.loop = true;
audioCombate.loop = true;

audioSeleccion.volume = 0.5;
audioRound.volume = 0.8;
audioCombate.volume = 0.6;

let audioIniciado = false;

window.addEventListener('click', () => {
    if (!audioIniciado) {
        audioSeleccion.play().catch(err => console.log("Audio selección iniciado:", err));
        audioIniciado = true;
    }
}, { once: true });

const datosMapas = {
    "admosera": { nombre: "Atmósfera Terrestre", img: "./img/escenarios/admosera.jpg" },
    "anenmba": { nombre: "Infierno (Janemba)", img: "./img/escenarios/anenmba.jpg" },
    "brolypelea": { nombre: "Planeta Vampa (Broly)", img: "./img/escenarios/brolypelea.jpg" },
    "dystopia": { nombre: "Ciudad Distópica", img: "./img/escenarios/dystopia.jpg" },
    "mundobylls": { nombre: "Planeta de Bills", img: "./img/escenarios/mundobylls.jpg" },
    "palacio": { nombre: "Templo Sagrado de Kami", img: "./img/escenarios/palacio.jpg" },
    "torneodelpoder": { nombre: "Torneo del Poder", img: "./img/escenarios/torneodelpoder.jpg" }
};

const estilosPersonajes = {
    "Goku": { borde: "4px solid #ff9800", sombra: "0 0 20px rgba(255, 152, 0, 0.8)", colorTexto: "text-warning" },
    "Vegeta": { borde: "4px solid #0d6efd", sombra: "0 0 20px rgba(13, 110, 253, 0.8)", colorTexto: "text-primary" },
    "Trunks": { borde: "4px solid #6f42c1", sombra: "0 0 20px rgba(111, 66, 193, 0.8)", colorTexto: "text-info" },
    "Gohan": { borde: "4px solid #6610f2", sombra: "0 0 20px rgba(102, 16, 242, 0.8)", colorTexto: "text-purple" },
    "Vegitto": { borde: "4px solid #0dcaf0", sombra: "0 0 20px rgba(13, 202, 240, 0.8)", colorTexto: "text-info" },
    "Cell": { borde: "4px solid #198754", sombra: "0 0 20px rgba(25, 135, 84, 0.8)", colorTexto: "text-success" },
    "Piccolo": { borde: "4px solid #20c997", sombra: "0 0 20px rgba(32, 201, 151, 0.8)", colorTexto: "text-success" },
    "Gogeta": { borde: "4px solid #dc3545", sombra: "0 0 20px rgba(220, 53, 69, 0.8)", colorTexto: "text-danger" }
};

const btn_player1 = document.getElementById("btn_player1");
const btn_player2 = document.getElementById("btn_player2");
const nombre1 = document.getElementById("player1");
const nombre2 = document.getElementById("player2");
const nombres = document.getElementById("nombres");
const tarjetas = document.getElementById("tarjetas");
const seccionPersonajes = document.getElementById("seccion_personajes");

const username1 = document.getElementById("username1");
const personaje1 = document.getElementById("personaje1"); 
const img1 = document.getElementById("img1");
const vida1 = document.getElementById("vida1");
const energia1 = document.getElementById("energia1");
const ki1 = document.getElementById("ki1");
const badgeSemilla1 = document.getElementById("badge_semilla1");
const cardJugador1 = document.getElementById("card_jugador1");

const username2 = document.getElementById("username2");
const personaje2 = document.getElementById("personaje2");
const img2 = document.getElementById("img2");
const vida2 = document.getElementById("vida2");
const energia2 = document.getElementById("energia2");
const ki2 = document.getElementById("ki2");
const badgeSemilla2 = document.getElementById("badge_semilla2");
const cardJugador2 = document.getElementById("card_jugador2");

let pj1 = "", pj2 = "";
let jugador1, jugador2;

let turno = 1;
let espera1 = 1, espera2 = 1;
let fin = false;

const seccionMapas = document.getElementById("seccion_mapas");
const btnMapa = document.getElementById("btn_mapa");
const tituloMapa = document.getElementById("titulo_mapa");
let mapaP1 = "";
let mapaP2 = "";
let turnoMapa = 1;

const barras = () => {
    if (jugador1) {
        vida1.style.width = `${jugador1.getVida()}%`;
        vida1.innerText = `${jugador1.getVida()}%`;
        energia1.style.width = `${jugador1.getEnergia()}%`;
        energia1.innerText = `${jugador1.getEnergia()}%`;
        ki1.style.width = `${jugador1.getKi()}%`;
        ki1.innerText = `${jugador1.getKi()}%`;
        badgeSemilla1.innerText = jugador1.getSemilla();
    }
    if (jugador2) {
        vida2.style.width = `${jugador2.getVida()}%`;
        vida2.innerText = `${jugador2.getVida()}%`;
        energia2.style.width = `${jugador2.getEnergia()}%`;
        energia2.innerText = `${jugador2.getEnergia()}%`;
        ki2.style.width = `${jugador2.getKi()}%`;
        ki2.innerText = `${jugador2.getKi()}%`;
        badgeSemilla2.innerText = jugador2.getSemilla();
    }
};

if (nombre1) {
    nombre1.addEventListener("input", (event) => {
        event.target.value = event.target.value.replace(/[^a-zA-Z0-9]+/, "");
    });
}

if (nombre2) {
    nombre2.addEventListener("input", (event) => {
        event.target.value = event.target.value.replace(/[^a-zA-Z0-9]+/, "");
    });
}

const remover_seleccion = (color, elementos) => {
    elementos.map((elemento) => {
        elemento.classList.remove("bg-warning");
        elemento.classList.add("bg-" + color);
    });
};

const msj_error = (msj) => {
    Swal.fire({
        icon: "warning",
        title: "Error!",
        text: msj
    });
};

const btn_py1 = document.getElementById("btn_py1");
const btn_py2 = document.getElementById("btn_py2");

const actualizar_turnos = () => {
    [...btn_py1.querySelectorAll("button")].map(boton => {
        const especial = boton.textContent.trim().toLowerCase().includes("ataque especial");
        boton.disabled = fin || turno !== 1 || (especial && espera1 > 0);
    });
    [...btn_py2.querySelectorAll("button")].map(boton => {
        const especial = boton.textContent.trim().toLowerCase().includes("ataque especial");
        boton.disabled = fin || turno !== 2 || (especial && espera2 > 0);
    });
};

const revisar_fin = () => {
    const v1 = jugador1.getVida();
    const v2 = jugador2.getVida();
    if (v1 > 0 && v2 > 0) return false;
    fin = true;
    const ganador = v1 <= 0 ? nombre2.value : nombre1.value;
    const personaje = v1 <= 0 ? pj2 : pj1;
    setTimeout(() => {
        Swal.fire({
            icon: "success",
            title: "¡Combate terminado!",
            text: `${ganador} (${personaje}) ha derrotado a su oponente.`,
            confirmButtonText: "Volver a Jugar <i class='fa-solid fa-rotate-right'></i>",
            confirmButtonColor: "#dc3545",
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });
    }, 1600);
    return true;
};

const iniciar_combate = () => {
    nombres.classList.add("d-none");

    audioSeleccion.pause();
    audioSeleccion.currentTime = 0;
    audioRound.play().catch(err => console.log("Error audio round:", err));

    let intervalo;
    Swal.fire({
        icon: "info",
        title: "Final round....fight",
        html: "Comienza en <b>5</b> segundos",
        timer: 5000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            const contador = Swal.getHtmlContainer().querySelector("b");
            intervalo = setInterval(() => {
                contador.textContent = Math.ceil(Swal.getTimerLeft() / 1000);
            }, 200);
        },
        willClose: () => clearInterval(intervalo)
    }).then(() => {
        audioCombate.play().catch(err => console.log("Error audio combate:", err));

        tarjetas.classList.remove("d-none");
        actualizar_turnos();
    });
};

document.querySelectorAll(".mapa-opcion").forEach((tarjeta) => {
    tarjeta.addEventListener("click", () => {
        document.querySelectorAll(".mapa-opcion").forEach(t => t.classList.remove("border-danger", "border-primary", "border-4"));
        const colorBorde = turnoMapa === 1 ? "border-danger" : "border-primary";
        tarjeta.classList.add(colorBorde, "border-4");

        const idMapa = tarjeta.getAttribute("data-mapa");
        if (turnoMapa === 1) {
            mapaP1 = idMapa;
        } else {
            mapaP2 = idMapa;
        }
    });
});

if (btnMapa) {
    btnMapa.addEventListener("click", () => {
        if (turnoMapa === 1) {
            if (mapaP1 === "") {
                return msj_error(`${nombre1.value} debe seleccionar un escenario`);
            }
            turnoMapa = 2;
            tituloMapa.innerHTML = `<i class="fa-solid fa-map"></i> ${nombre2.value}: Selecciona tu Escenario`;
            document.querySelectorAll(".mapa-opcion").forEach(t => t.classList.remove("border-danger", "border-primary", "border-4"));
            Swal.fire({
                icon: "info",
                title: `Turno de ${nombre2.value}`,
                text: "Elige tu escenario de pelea",
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            if (mapaP2 === "") {
                return msj_error(`${nombre2.value} debe seleccionar un escenario`);
            }

            let mapaGanadorClave = "";
            let mensajeEscenario = "";

            if (mapaP1 === mapaP2) {
                mapaGanadorClave = mapaP1;
                mensajeEscenario = `¡Ambos eligieron el mismo mapa! Se jugará en: <b>${datosMapas[mapaGanadorClave].nombre}</b>`;
            } else {
                const opciones = [mapaP1, mapaP2];
                mapaGanadorClave = opciones[Math.floor(Math.random() * opciones.length)];
                mensajeEscenario = `Eligieron mapas distintos:<br>
                ${nombre1.value}: <b>${datosMapas[mapaP1].nombre}</b><br>
                ${nombre2.value}: <b>${datosMapas[mapaP2].nombre}</b><br><br>
                ¡Sorteo ganador: <b>${datosMapas[mapaGanadorClave].nombre}</b>!`;
            }

            document.body.style.backgroundImage = `url('${datosMapas[mapaGanadorClave].img}')`;
            seccionMapas.classList.add("d-none");

            Swal.fire({
                icon: "success",
                title: "¡Escenario Definido!",
                html: mensajeEscenario,
                timer: 3500,
                showConfirmButton: false
            }).then(() => {
                iniciar_combate();
            });
        }
    });
}

const player1 = document.getElementById("py1");
[...player1.querySelectorAll("img")].map((imagen) => {
    imagen.addEventListener('click', (event) => {
        remover_seleccion("danger", [...player1.querySelectorAll("img")]);
        event.target.classList.add("bg-warning");
        event.target.classList.remove("bg-danger");
        pj1 = event.target.alt;
    });
});

btn_player1.addEventListener("click", () => {
    if (nombre1.value == "") {
        return msj_error("El jugador 1 no ha ingresado un nombre de usuario!");
    } else if (pj1 == "") {
        return msj_error("El jugador 1 debe seleccionar un personaje!");
    }
    jugador1 = new Acciones(nombre1.value);
    nombre1.disabled = true;
    player1.classList.add("d-none");
    
    username1.innerText = nombre1.value;
    personaje1.innerText = pj1;
    img1.src = `./img/${pj1}/base.png`;

    if (estilosPersonajes[pj1]) {
        cardJugador1.style.border = estilosPersonajes[pj1].borde;
        cardJugador1.style.boxShadow = estilosPersonajes[pj1].sombra;
        username1.className = `h4 ${estilosPersonajes[pj1].colorTexto}`;
    }

    if (jugador1 && jugador2) {
        seccionPersonajes.classList.add("d-none");
        seccionMapas.classList.remove("d-none");
        document.body.style.backgroundImage = `url('./img/naveespacial.jpg')`;
    }
});

const player2 = document.getElementById("py2");
[...player2.querySelectorAll("img")].map((imagen) => {
    imagen.addEventListener('click', (event) => {
        remover_seleccion("primary", [...player2.querySelectorAll("img")]);
        event.target.classList.add("bg-warning");
        event.target.classList.remove("bg-primary");
        pj2 = event.target.alt;
    });
});

btn_player2.addEventListener("click", () => {
    if (nombre2.value == "") {
        return msj_error("Ingresa tu nombre jugador 2");
    } else if (pj2 == "") {
        return msj_error("Debes seleccionar un personaje jugador 2");
    }
    jugador2 = new Acciones(nombre2.value);
    nombre2.disabled = true;
    player2.classList.add("d-none");
    
    username2.innerText = nombre2.value;
    personaje2.innerText = pj2;
    img2.src = `./img/${pj2}/base.png`;

    if (estilosPersonajes[pj2]) {
        cardJugador2.style.border = estilosPersonajes[pj2].borde;
        cardJugador2.style.boxShadow = estilosPersonajes[pj2].sombra;
        username2.className = `h4 ${estilosPersonajes[pj2].colorTexto}`;
    }

    if (jugador1 && jugador2) {
        seccionPersonajes.classList.add("d-none");
        seccionMapas.classList.remove("d-none");
        document.body.style.backgroundImage = `url('./img/naveespacial.jpg')`;
    }
});

if (btn_py1) {
    [...btn_py1.querySelectorAll("button")].map(boton => {
        boton.addEventListener("click", () => {
            if (!jugador1 || !jugador2 || fin) return;
            if (turno !== 1) return msj_error("No es tu turno jugador 1!");
            const accion = boton.textContent.trim().toLowerCase();
            const especial = accion.includes("ataque especial");
            if (especial && espera1 > 0) {
                return msj_error("Este ataque solo se puede usar cada dos turnos");
            }
            if (accion.includes("semilla") && jugador1.getVida() >= 100) {
                return msj_error("Vida al maximo, no puedes usar semillas sabandija");
            }
            if (accion.includes("ataque básico")) {
                atk_basico(jugador1, jugador2, pj1);
            } else if (especial) {
                atk_especial(jugador1, jugador2, pj1);
            } else if (accion.includes("cargar ki")) {
                cargar_ki(jugador1);
            } else if (accion.includes("semilla")) {
                if (jugador1.getSemilla() <= 0) {
                    return msj_error("¡Ya no te quedan semillas del ermitaño en toda la pelea!");
                }
                usar_semilla(jugador1);
            }
            if (especial) {
                espera1 = 1;
            } else if (espera1 > 0) {
                espera1--;
            }
            turno = 2;
            barras();
            revisar_fin();
            actualizar_turnos();
        });
    });
}

if (btn_py2) {
    [...btn_py2.querySelectorAll("button")].map(boton => {
        boton.addEventListener("click", () => {
            if (!jugador1 || !jugador2 || fin) return;
            if (turno !== 2) return msj_error("No es tu turno jugador 2");
            const accion = boton.textContent.trim().toLowerCase();
            const especial = accion.includes("ataque especial");
            if (especial && espera2 > 0) {
                return msj_error("Este ataque solo se puede usar cada dos turnos");
            }
            if (accion.includes("semilla") && jugador2.getVida() >= 100) {
                return msj_error("Vida al maximo, no puedes usar semillas sabandija");
            }
            if (accion.includes("ataque básico")) {
                atk_basico(jugador2, jugador1, pj2);
            } else if (especial) {
                atk_especial(jugador2, jugador1, pj2);
            } else if (accion.includes("cargar ki")) {
                cargar_ki(jugador2);
            } else if (accion.includes("semilla")) {
                if (jugador2.getSemilla() <= 0) {
                    return msj_error("¡Ya no te quedan semillas del ermitaño en toda la pelea!");
                }
                usar_semilla(jugador2);
            }
            if (especial) {
                espera2 = 1;
            } else if (espera2 > 0) {
                espera2--;
            }
            turno = 1;
            barras();
            revisar_fin();
            actualizar_turnos();
        });
    });
}