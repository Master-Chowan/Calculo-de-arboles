const diametros = [];
const largos = [];
let apoyos = [];
const fuerzasX = [];
const fuerzasY = [];
const fuerzasZ = [];
const coordenadasX = [];
const coordenadasY = [];
const coordenadasZ = [];
const vectorPosA1i = [];
const vectorPosA1j = [];
const vectorPosA1k = [];
const vectorPosA2i = [];
const vectorPosA2j = [];
const vectorPosA2k = [];
const momentosA1i = [];
const momentosA1j = [];
const momentosA1k = [];
const momentosA2i = [];
const momentosA2j = [];
const momentosA2k = [];
const fc1 = [];
const fc2 = [];

let largoTotal = 0;
let forceCant = 1;
let cilCant = 1;
let forceCount = 1;
let forceCountAct = 1;
let apoyoCountAct = 1;
let apoyoCount = 2;
let cilGuard = 0;
let sumMoment1i = 0;
let sumMoment1j = 0;
let sumMoment1k = 0;
let sumMoment2i = 0;
let sumMoment2j = 0;
let sumMoment2k = 0;

const materialsData = {
    "aisi1020": {
        "yield_strength": 350,
        "ultimate_strength": 420,
        "endurance_limit": 180
    },
    "aisi1045": {
        "yield_strength": 530,
        "ultimate_strength": 585,
        "endurance_limit": 240
    },
    "aisi4140": {
        "yield_strength": 655,
        "ultimate_strength": 700,
        "endurance_limit": 340
    }
};

function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

window.onload = function () {
    const remove = getParameterByName('remove');
    if (remove === 'true') {
        const boton = document.getElementById('btnAddCil');
        if (boton) {
            boton.remove(); // Eliminar el botón del DOM
        }
    }
};

function cambiarUnidades() {
    const unitType = document.getElementById("unitType").value;
    const unitLabel = unitType === "mm" ? "mm" : "in";
    const forceLabel = unitType === "mm" ? "N" : "lbf";

    document.querySelectorAll('.unit-label').forEach(label => {
        label.textContent = unitLabel;
    });

    document.querySelectorAll('.force-label').forEach(label => {
        label.textContent = forceLabel;
    });
}

function cambiarMaterial() {
    // Obtener la opción seleccionada
    const selectedMaterial = document.getElementById("material-select").value;

    // Obtener los datos del material seleccionado
    const material = materialsData[selectedMaterial];

    // Actualizar los valores de los inputs
    document.getElementById("yield-strength").value = material.yield_strength;
    document.getElementById("ultimate-strength").value = material.ultimate_strength;
    document.getElementById("endurance-limit").value = material.endurance_limit;
}

function agregarCilindro() {
    const container = document.getElementById('inputContainer');

    const div = document.createElement('div');
    div.className = 'entrada-dual';
    div.id = `cilindro-${cilCant + 1}`; // Asignamos un ID único al bloque

    div.innerHTML = `
        <div class="input-group">
            <label for="diameter${cilCant + 1}">Diametro ${cilCant + 1} : </label>
            <input type="number" id="diameter${cilCant + 1}" value="0" step="0.1">
            <span id="diameterUnit" class="unit-label">mm</span>
        </div>
        <div class="input-group">
            <label for="length${cilCant + 1}">Largo ${cilCant + 1} : </label>
            <input type="number" id="length${cilCant + 1}" value="0" step="0.1">
            <span id="lengthUnit" class="unit-label">mm</span>
        </div>
        
        <button class="rojo" onclick="eliminarCilindro(${cilCant + 1})" id="btnElimCil${cilCant + 1}">Eliminar Cilindro</button>
    `;
    cilCant++;
    container.appendChild(div);
    cambiarUnidades();
}

function guardarCilindro() {
    for (let i = cilGuard; i < cilCant; i++) {
        const diametro = document.getElementById('diameter' + (i + 1)).value;
        const largo = document.getElementById('length' + (i + 1)).value;
        if (diametro <= 0 || largo <= 0) {
            alert("Por favor, ingrese valores mayor que cero para el eje.");
            return;
        }
        if (diametro && largo) {
            diametros.push(parseFloat(diametro));
            largos.push(parseFloat(largo));
            largoTotal += parseFloat(largo);
        } else {
            console.error(`Error: Valor inválido en cilindro ${i}`);
        }
        cilGuard++;

    }
    scaleFactor = Math.max(1, 180 / largoTotal);
    createCylinderEsc2D()
    // document.getElementById("chatInput").value = "Qué es un eje mecánico";
    // sendMessage();
}

// Función para eliminar un cilindro dado su índice
function eliminarCilindro(id) {
    // Encontrar el índice en las listas con base en el ID del cilindro
    const index = id - 1;

    if (index >= 0 && index <= cilCant) {
        largoTotal -= parseFloat(largos[index]);
        diametros.splice(index, 1);
        largos.splice(index, 1);
        const div = document.getElementById(`cilindro-${id}`);
        if (div) {
            div.remove();
        }
        if (diametros.length > 0) createCylinderEsc2D();
    } else {
        console.error(`Error: Índice ${index} fuera de rango.`);
    }
}

function replaceButton() {
    apoyoCount--;
    var container2 = document.getElementById("button-apoyo");
    container2.innerHTML = `
        <button id="add-apoyo" onclick="addApoyoInput(); cambiaAgregar()">Agregar 3er Apoyo</button>
        <button onclick="guardarApoyo()">Guardar Apoyos</button>
        `;
    const div = document.getElementById(`apoyo-3`);
    if (div) {
        div.remove();
    }
}

function cambiaAgregar() {
    var container1 = document.getElementById("button-apoyo");
    container1.innerHTML = `
        <button class="rojo" id="rem-apoyo" onclick="replaceButton()">Elimina Apoyo</button>
        <button onclick="guardarApoyo()">Guardar Apoyos</button>
        `;
}

function agregarApoyo() {
    apoyoCount++;
    const container = document.getElementById('inputContainer2');
    const div = document.createElement('div');
    div.className = 'input-group';
    div.id = `apoyo-3`;

    div.innerHTML = `
        <div class="input-group">
            <label for="support3">Apoyo 3: </label>
            <input type="number" id="support3" value="0" min="0.1" step="0.1">
            <span id="supportUnit" class="unit-label">mm</span>
        </div>
        
    `;
    container.appendChild(div);
    cambiarUnidades();
}

function guardarApoyo() {
    apoyos = [];
    const canvas4 = document.getElementById('layer4');
    const ctx4 = canvas4.getContext('2d', { willReadFrequently: true });
    ctx4.clearRect(0, 0, canvas4.width, canvas4.height);
    const sy = canvas4.height / 2;
    if (diametros.length == 0) {
        alert("No existe el cilindro");
        return;
    }

    for (let i = apoyoCountAct; i <= apoyoCount; i++) {
        const sup = document.getElementById("support" + i).value;
        const valorApoyo = parseFloat(sup);
        if ((valorApoyo < 0) || (valorApoyo > largoTotal)) {
            alert("Apoyo fuera del cilindro");
            return;
        }
        apoyos.push(valorApoyo);
        ctx4.beginPath();
        ctx4.arc(((apoyos[i - 1] * 2) * scaleFactor) + 40, sy, 6, 0, 6 * Math.PI);  // Dibuja el punto
        ctx4.fillStyle = 'brown';
        ctx4.fill();
        ctx4.font = '10pt Verdana';
        ctx4.fillText('A' + i, ((apoyos[i - 1] * 2) * scaleFactor) + 40, sy - 10);
    }
    // document.getElementById("chatInput").value = "Qué es un apoyo";
    // sendMessage();
}

function agregarFuerzas() {
    forceCount++;
    forceCant++;
    const container1 = document.getElementById('inputFuerzas');

    const div = document.createElement('div');
    div.className = 'fuerza-group';
    div.id = `fuerCoord-${forceCount}`;

    div.innerHTML = `
                        <div class="entrada-triple">
                            <label>Fuerza ${forceCount}:</label>
                            <div class="input-group">
                                <label for="forceX${forceCount}"> X: </label>
                                <input type="number" id="forceX${forceCount}" value="0" step="0.1">
                                <span id="forceXUnit" class="force-label">N</span>
                            </div>
                            <div class="input-group">
                                <label for="forceY${forceCount}"> Y: </label>
                                <input type="number" id="forceY${forceCount}" value="0" step="0.1">
                                <span id="forceYUnit" class="force-label">N</span>
                            </div>
                            <div class="input-group">
                                <label for="forceZ${forceCount}"> Z: </label>
                                <input type="number" id="forceZ${forceCount}" value="0" step="0.1">
                                <span id="forceZUnit" class="force-label">N</span>
                            </div>
                        </div>
                        <div class="entrada-triple">
                            <label>Coordenadas:</label>
                            <div class="input-group">
                                <label for="coordEnX${forceCount}"> X: </label>
                                <input type="number" id="coordEnX${forceCount}" value="0" step="0.1">
                                <span id="coordXUnit" class="unit-label">mm</span>
                            </div>
                            <div class="input-group">
                                <label for="coordEnY${forceCount}"> Y: </label>
                                <input type="number" id="coordEnY${forceCount}" value="0" step="0.1">
                                <span id="coordYUnit" class="unit-label">mm</span>
                            </div>
                            <div class="input-group">
                                <label for="coordEnZ${forceCount}"> Z: </label>
                                <input type="number" id="coordEnZ${forceCount}" value="0" step="0.1">
                                <span id="coordZUnit" class="unit-label">mm</span>
                            </div>
                        </div>
    `;
    container1.appendChild(div);
    cambiarUnidades();
}

function guardarFuerzas() {
    const canvas3 = document.getElementById('layer3');
    const ctx3 = canvas3.getContext('2d', { willReadFrequently: true });
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
    for (let k = forceCountAct; k <= forceCount; k++) {
        let fuerzaX = document.getElementById("forceX" + k).value;
        let fuerzaY = document.getElementById("forceY" + k).value;
        let fuerzaZ = document.getElementById("forceZ" + k).value;
        let coordX = document.getElementById("coordEnX" + k).value;
        let coordY = document.getElementById("coordEnY" + k).value;
        let coordZ = document.getElementById("coordEnZ" + k).value;

        if (fuerzaX == 0 && fuerzaY == 0 && fuerzaZ == 0) {
            alert("Por favor, ingrese valores.");
            return;
        }
        if (diametros.length == 0) {
            alert("No existe el eje");
            return;
        }
        fuerzasX.push(parseFloat(fuerzaX));
        fuerzasY.push(parseFloat(fuerzaY));
        fuerzasZ.push(parseFloat(fuerzaZ));
        coordenadasX.push(parseFloat(coordX));
        coordenadasY.push(parseFloat(coordY));
        coordenadasZ.push(parseFloat(coordZ));
        forceCountAct++;
        dibujarFuerzas();

    }
    actualizarListaFuerza();
    // document.getElementById("chatInput").value = "Qué es una fuerza";
    // sendMessage();
}

function eliminarFuerza(indexx) {
    fuerzasX[indexx] = 0;
    fuerzasY[indexx] = 0;
    fuerzasZ[indexx] = 0;
    coordenadasX[indexx] = 0;
    coordenadasY[indexx] = 0;
    coordenadasZ[indexx] = 0;
    const div = document.getElementById(`fuerCoord-${indexx + 1}`);
    if (div) {
        div.remove();
    }
    forceCant--;
    // respectoA1();
    // respectoA2();
    // momentosA1();
    // momentosA2();
    actualizarListaFuerza();
    dibujarFuerzas();
}

function actualizarListaFuerza() {
    let listaFuerzas = document.getElementById("listaFuerzas");
    listaFuerzas.innerHTML = ""; // Limpiar la lista de fuerzas
    fuerzasX.forEach((fuerzaX, indexx) => {
        if ((fuerzasX[indexx] != 0) || (fuerzasY[indexx] != 0) || (fuerzasZ[indexx] != 0)) {
            let li = document.createElement("li");
            //let li = document.createElement("li");
            li.innerHTML = `<b>F&#8593 ${indexx + 1}:</b> (${fuerzaX} i, ${fuerzasY[indexx]} j, ${fuerzasZ[indexx]} k) `;
            let botonEliminarF = document.createElement("button");
            botonEliminarF.textContent = "Eliminar";
            botonEliminarF.classList.add("rojo");
            botonEliminarF.onclick = () => eliminarFuerza(indexx); // Asignar el evento de eliminar
            li.appendChild(botonEliminarF);
            listaFuerzas.appendChild(li);
        }});
        if (forceCount > 0) {
            respectoA1();
            respectoA2();
            momentosA1();
            momentosA2();
        }
    
}

function respectoA1() {
    let listaFuerzasRes1 = document.getElementById("listaFuerzasRes1");
    listaFuerzasRes1.innerHTML = ""; // Limpiar la lista de fuerzas
    fuerzasX.forEach((fuerza, i1) => {
        
        if ((fuerzasX[i1] != 0) || (fuerzasY[i1] != 0) || (fuerzasZ[i1] != 0)) {
            let liR1 = document.createElement("li");
            vectorPosA1i[i1 + 1] = Math.abs(apoyos[0] - coordenadasX[i1]);
            vectorPosA1j[i1 + 1] = coordenadasY[i1];
            vectorPosA1k[i1 + 1] = coordenadasZ[i1];
            liR1.innerHTML = `<b>r&#8593 F${i1 + 1}-A1:</b> (${vectorPosA1i[i1 + 1]} i, ${vectorPosA1j[i1 + 1]} j, ${vectorPosA1k[i1 + 1]} k) <br>`;
            listaFuerzasRes1.appendChild(liR1);
        } 
    });
    vectorPosA1i[0] = apoyos[0] - apoyos[1];
    vectorPosA1j[0] = 0;
    vectorPosA1k[0] = 0;
    if (forceCant > 0) {
        let liRR1 = document.createElement("li");
        liRR1.innerHTML += `<b>r&#8593 A2-A1:</b> (${apoyos[0] - apoyos[1]} i, 0 j, 0 k)`;
        listaFuerzasRes1.appendChild(liRR1);
    }
}

function respectoA2() {
    let listaFuerzasRes2 = document.getElementById("listaFuerzasRes2");
    listaFuerzasRes2.innerHTML = ""; // Limpiar la lista de fuerzas
    fuerzasX.forEach((fuerza, i2) => {
        if ((fuerzasX[i2] != 0) || (fuerzasY[i2] != 0) || (fuerzasZ[i2] != 0)) {
            let liR2 = document.createElement("li");
            vectorPosA2i[i2 + 1] = Math.abs(apoyos[1] - coordenadasX[i2]);
            vectorPosA2j[i2 + 1] = coordenadasY[i2];
            vectorPosA2k[i2 + 1] = coordenadasZ[i2];
            liR2.innerHTML = `<b>r&#8593 F${i2 + 1}-A2:</b> (${vectorPosA2i[i2 + 1]} i, ${vectorPosA2j[i2 + 1]} j, ${vectorPosA2k[i2 + 1]} k) <br>`;
            listaFuerzasRes2.appendChild(liR2);
        } 
    });
    vectorPosA2i[0] = apoyos[1] - apoyos[0];
    vectorPosA2j[0] = 0;
    vectorPosA2k[0] = 0;
    if (forceCant > 0) {
        let liRR2 = document.createElement("li");
        liRR2.innerHTML += `<b>r&#8593 A1-A2:</b> (${apoyos[1] - apoyos[0]} i, 0 j, 0 k)`;
        listaFuerzasRes2.appendChild(liRR2);
    }
}

function momentosA1() {
    let listaMomentosA1 = document.getElementById("listaMomentosA1");
    listaMomentosA1.innerHTML = "";
    fuerzasX.forEach((fuerza, l1) => {
        if ((fuerzasX[l1] != 0) || (fuerzasY[l1] != 0) || (fuerzasZ[l1] != 0)) {
            let momentA1 = document.createElement("li");
            momentosA1i[l1 + 1] = vectorPosA1j[l1 + 1] * fuerzasZ[l1] - vectorPosA1k[l1 + 1] * fuerzasY[l1];  // Componente i (x)
            momentosA1j[l1 + 1] = vectorPosA1k[l1 + 1] * fuerzasX[l1] - vectorPosA1i[l1 + 1] * fuerzasZ[l1];  // Componente j (y)
            momentosA1k[l1 + 1] = vectorPosA1i[l1 + 1] * fuerzasY[l1] - vectorPosA1j[l1 + 1] * fuerzasX[l1];  // Componente k (z)
            sumMoment1k += momentosA1k[l1 + 1];
            sumMoment1j += momentosA1j[l1 + 1];
            sumMoment1i += fuerzasX[l1];
            momentA1.innerHTML = `<b>M&#8593 F${l1 + 1}:</b>  (${momentosA1i[l1 + 1]} i, ${momentosA1j[l1 + 1]} j, ${momentosA1k[l1 + 1]} k)`;
            listaMomentosA1.appendChild(momentA1);
        }
    });
    momentosA1j[0] = apoyos[1] - apoyos[0];
    momentosA1k[0] = apoyos[0] - apoyos[1];
    momentosA1i[0] = 0;
    fc1[0] = sumMoment1j / momentosA1j[0];
    fc1[1] = sumMoment1k / momentosA1k[0];
    fc1[2] = sumMoment1i;
    if (forceCant > 0) {
        let momentA1 = document.createElement("li");
        momentA1.innerHTML = `<b>M&#8593 A1: </b>(${momentosA1j[0]}Fc j, ${momentosA1k[0]}Fc k) <br>
                                <b>Fc&#8593 1 : </b> (${fc1[2]} i, ${fc1[0]} j, ${fc1[1]} k)`;
        listaMomentosA1.appendChild(momentA1);
    }
}

function momentosA2() {
    let listaMomentosA2 = document.getElementById("listaMomentosA2");
    listaMomentosA2.innerHTML = "";
    fuerzasX.forEach((fuerza, l) => {
        if ((fuerzasX[l] != 0) || (fuerzasY[l] != 0) || (fuerzasZ[l] != 0)) {
            let momentA2 = document.createElement("li");
            momentosA2i[l + 1] = vectorPosA2j[l + 1] * fuerzasZ[l] - vectorPosA2k[l + 1] * fuerzasY[l];  // Componente i (x)
            momentosA2j[l + 1] = vectorPosA2k[l + 1] * fuerzasX[l] - vectorPosA2i[l + 1] * fuerzasZ[l];  // Componente j (y)
            momentosA2k[l + 1] = vectorPosA2i[l + 1] * fuerzasY[l] - vectorPosA2j[l + 1] * fuerzasX[l];  // Componente k (z)
            sumMoment2k += momentosA2k[l + 1];
            sumMoment2j += momentosA2j[l + 1];
            sumMoment2i += fuerzasX[l];
            momentA2.innerHTML = `<b>M&#8593 F${l + 1}:</b>  (${momentosA2i[l + 1]} i, ${momentosA2j[l + 1]} j, ${momentosA2k[l + 1]} k)`;
            listaMomentosA2.appendChild(momentA2);
        }
    });
    momentosA2j[0] = apoyos[1] - apoyos[0];
    momentosA2k[0] = apoyos[0] - apoyos[1];
    momentosA2i[0] = 0;
    fc2[0] = sumMoment2j / momentosA2j[0];
    fc2[1] = sumMoment2k / momentosA2k[0];
    fc2[2] = sumMoment2i;

    if (forceCant > 0) {
        let momentA2 = document.createElement("li");
        momentA2.innerHTML = `<b>M&#8593 A2: </b>(${momentosA2j[0]}Fc j, ${momentosA2k[0]}Fc k) <br>
                                <b>Fc&#8593 2 : </b> (${fc2[2]} i, ${fc2[0]} j, ${fc2[1]} k)`;
        listaMomentosA2.appendChild(momentA2);
    }
}

function dibujarEjesCoord(scaleFactor = 1) {
    const canvas2 = document.getElementById('layer2');
    const ctx2 = canvas2.getContext('2d', { willReadFrequently: true });
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    const centerX = 40;
    const centerY = 175;

    // Eje X
    ctx2.beginPath();
    ctx2.moveTo(0, canvas2.height / 2);
    ctx2.lineTo(canvas2.width, canvas2.height / 2);
    ctx2.strokeStyle = '#264EB1';
    ctx2.lineWidth = 1;
    ctx2.stroke();

    // Números y marcas en el eje X ajustados por el scaleFactor
    ctx2.fillStyle = '#264EB1';
    ctx2.font = '8pt Verdana';

    for (let i = -40; i <= 800; i += 40) {
        let x = centerX + i;
        ctx2.moveTo(x, centerY - 5);
        ctx2.lineTo(x, centerY + 5);
        ctx2.stroke();
        if (i !== 0) {
            ctx2.fillText(((i / 2) / scaleFactor).toFixed(1), (x - 5), centerY + 20); // Ajustar números
        }
    }
    ctx2.fillText('Eje X', 750, 215);

    // Eje Y
    ctx2.beginPath();
    ctx2.moveTo(40, 0);
    ctx2.lineTo(40, canvas2.height);
    ctx2.stroke();
    for (let i = -120; i <= 200; i += 40) {
        let y = centerY - i;
        ctx2.moveTo(centerX - 5, y);
        ctx2.lineTo(centerX + 5, y);
        ctx2.stroke();
        if (i !== 0) {
            ctx2.fillText(((i / 2) / scaleFactor).toFixed(1), centerX + 10, y + 3); // Ajustar números
        }
    }
    ctx2.fillText('Eje Y', 80, 30);
}

function createCylinderEsc2D() {
    const canvas1 = document.getElementById('layer1');
    const ctx1 = canvas1.getContext('2d', { willReadFrequently: true });
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    let inix = 40;
    let width = 40;
    let height = canvas1.height / 2;
    for (let i = 0; i < diametros.length; i++) {
        scaleFactor = Math.max(1, 180 / largoTotal);
        width = (largos[i] * 2) * scaleFactor;
        height = (diametros[i] * 2) * scaleFactor;
        ctx1.fillStyle = "#a8b0c2";
        ctx1.fillRect(inix, canvas1.height / 2 - height / 2, width, height);
        ctx1.strokeStyle = '#1A2EDB';
        ctx1.lineWidth = 1;
        ctx1.strokeRect(inix, canvas1.height / 2 - height / 2, width, height);
        inix += width;
    }
    dibujarEjesCoord(scaleFactor);
}

function dibujarFuerzas() {
    const canvas3 = document.getElementById('layer3');
    const ctx3 = canvas3.getContext('2d', { willReadFrequently: true });
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
    const coordsDisplay = document.getElementById('coords');
    canvas3.addEventListener('mousemove', (event) => {
        const rect = canvas3.getBoundingClientRect();
        const x = ((event.clientX - rect.left) - 40).toFixed(0);
        const y = -1 * (((event.clientY - rect.top) - 175).toFixed(0));
        coordsDisplay.textContent = `Coordenadas del mouse: (${((x / 2) / scaleFactor).toFixed(1)}, ${((y / 2) / scaleFactor).toFixed(1)})`;
    });

    // Evento click para dibujar la flecha en la capa de flechas
    for (let l = 0; l <= coordenadasX.length; l++) {
        if ((fuerzasX[l] != 0) || (fuerzasY[l] != 0) || (fuerzasZ[l] != 0)) {
            const x = (coordenadasX[l] * 2 * scaleFactor) + 40;
            const y = (coordenadasY[l] * -2 * scaleFactor) + 175;
            // Obtener las coordenadas desde los inputs
            const forceX = fuerzasX[l];
            const forceY = fuerzasY[l];
            const forceZ = fuerzasZ[l];

            // Dibujar flecha para el eje X
            ctx3.beginPath();
            if (forceX >= 0) {
                // Flecha a la derecha
                ctx3.moveTo(x - 20, y);
                ctx3.lineTo(x, y);  // Línea hacia la derecha
                // Punta de la flecha
                ctx3.lineTo(x - 10, y - 5);
                ctx3.moveTo(x, y);
                ctx3.lineTo(x - 10, y + 5);
            } else if (forceX < 0) {
                // Flecha a la izquierda
                ctx3.moveTo(x + 20, y);
                ctx3.lineTo(x, y);  // Línea hacia la izquierda
                // Punta de la flecha
                ctx3.lineTo(x + 10, y - 5);
                ctx3.moveTo(x, y);
                ctx3.lineTo(x + 10, y + 5);
            }
            ctx3.strokeStyle = 'red';
            ctx3.lineWidth = 2;
            ctx3.stroke();

            // Dibujar flecha para el eje Y
            ctx3.beginPath();
            if (forceY >= 0) {
                // Flecha hacia arriba
                ctx3.moveTo(x, y + 20);
                ctx3.lineTo(x, y);  // Línea hacia arriba
                // Punta de la flecha
                ctx3.lineTo(x - 5, y + 10);
                ctx3.moveTo(x, y);
                ctx3.lineTo(x + 5, y + 10);
            } else if (forceY < 0) {
                // Flecha hacia abajo
                ctx3.moveTo(x, y - 20);
                ctx3.lineTo(x, y);  // Línea hacia abajo
                // Punta de la flecha
                ctx3.lineTo(x - 5, y - 10);
                ctx3.moveTo(x, y);
                ctx3.lineTo(x + 5, y - 10);
            }
            ctx3.strokeStyle = 'green';
            ctx3.lineWidth = 2;
            ctx3.stroke();

            // Dibujar símbolo para el eje Z
            ctx3.beginPath();
            ctx3.arc(x, y, 10, 0, 2 * Math.PI);  // Dibujar un círculo
            ctx3.strokeStyle = 'blue';
            ctx3.lineWidth = 2;
            ctx3.stroke();
            if (forceZ >= 0) {
                // Dibuja un punto en el centro
                ctx3.beginPath();
                ctx3.arc(x, y, 2, 0, 2 * Math.PI);  // Punto en el centro del círculo
                ctx3.fillStyle = 'blue';
                ctx3.fill();
            } else if (forceZ < 0) {
                // Dibuja una X en el centro
                ctx3.beginPath();
                ctx3.moveTo(x - 5, y - 5);
                ctx3.lineTo(x + 5, y + 5);
                ctx3.moveTo(x + 5, y - 5);
                ctx3.lineTo(x - 5, y + 5);
                ctx3.stroke();
            }
        }
    };
}

// Dibuja el cilindro en 3D
function createCylinderEsc3D() {
    const resolution = 150; // Resolución (número de segmentos)
    let inix = 0; // Posición inicial en X para el primer cilindro
    let traces = []; // Acumulador de trazas
    
    for (let i = 0; i < diametros.length; i++) {
        // Definir el diametro y la longitud del cilindro
        let diameter = diametros[i];
        let length = largos[i];

        // Vectores para las coordenadas del cilindro
        let xs = [];
        let ys = [];
        let zs = [];

        // Generar los vértices del cilindro
        for (let j = 0; j < resolution; j++) {
            const theta = (j / resolution) * 2 * Math.PI; // Ángulo en radianes
            zs.push(diameter * Math.cos(theta)); // Coordenada Z
            ys.push(diameter * Math.sin(theta)); // Coordenada Y
            xs.push(inix); // Inicio del cilindro en X

            zs.push(diameter * Math.cos(theta));
            ys.push(diameter * Math.sin(theta));
            xs.push(inix + length); // Fin del cilindro en X
        }

        // Índices para las caras laterales
        let indicesI = [];
        let indicesJ = [];
        let indicesK = [];

        for (let iBase = 0; iBase < resolution; iBase++) {
            const nextBase = (iBase + 1) % resolution;

            // Definir las caras laterales del cilindro
            indicesI.push(iBase * 2);
            indicesJ.push(nextBase * 2);
            indicesK.push(iBase * 2 + 1);
            indicesI.push(nextBase * 2);
            indicesJ.push(nextBase * 2 + 1);
            indicesK.push(iBase * 2 + 1);
        }

        // Añadir tapas superior e inferior
        for (let j = 1; j < resolution - 1; j++) {
            indicesI.push(0);               // Centro de la tapa inferior
            indicesJ.push(j * 2);           // Vértice de la tapa inferior
            indicesK.push((j + 1) * 2);     // Siguiente vértice

            indicesI.push(1);               // Centro de la tapa superior
            indicesJ.push(j * 2 + 1);       // Vértice de la tapa superior
            indicesK.push((j + 1) * 2 + 1); // Siguiente vértice
        }

        // Definir la traza del cilindro con relleno
        let trace = {
            x: xs,
            y: ys,
            z: zs,
            i: indicesI,
            j: indicesJ,
            k: indicesK,
            opacity: 1.0, // Opacidad completa para relleno
            type: 'mesh3d',
            color: 'lightblue',
            flatshading: true, // Sombreado para mayor realismo
        };
        traces.push(trace); // Añadir la traza del cilindro
        // Actualizar la posición `inix` para el siguiente cilindro
        inix += length;
    }

    // Configuración del layout
    let layout = {
        //title: 'Cilindro Final',
        scene: {
            xaxis: {
                visible: false, // Eje X invisible
            },
            yaxis: {
                visible: false, // Eje Y invisible
            },
            zaxis: {
                visible: false, // Eje Z invisible
            },
            aspectratio: { x: 5, y: 1, z: 1 }
        }
    };
    return { traces, layout };
}

function updateCylindersEsc() {
    if (diametros.length == 0) {
        alert("Guardar un eje en Datos de entrada primero");
        return;
    }
    let { traces: traces3D, layout: layout3D } = createCylinderEsc3D();
    Plotly.newPlot('plot3D', traces3D, layout3D);
}

dibujarEjesCoord(1);
// Cálculos matemáticos
