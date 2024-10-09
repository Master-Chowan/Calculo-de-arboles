// Dibuja el cilindro en 2D

const diametros = [];
const largos = [];
const fuerzasX = [];
const fuerzasY = [];
const fuerzasZ = [];
const coordenadasX = [];
const coordenadasY = [];
const coordenadasZ = [];
let largoTotal = 0;
let cilCount = 1;  // Contador de cilindros agregados
let cilCountAct = 1;
let forceCount = 1;  // Contador de fuerzas agregadas
let forceCountAct = 1;

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

function addCilInput() {
    cilCount++;

    const container = document.getElementById('inputContainer');

    const div = document.createElement('div');
    div.className = 'entrada-dual';
    div.id = `cilindro-${cilCount}`; // Asignamos un ID único al bloque

    div.innerHTML = `
        <div class="input-group">
            <label for="diameter${cilCount}">Diametro ${cilCount} : </label>
            <input type="number" id="diameter${cilCount}" value="0" step="0.1">
            <span id="diameterUnit" class="unit-label">mm</span>
        </div>
        <div class="input-group">
            <label for="length${cilCount}">Largo ${cilCount} : </label>
            <input type="number" id="length${cilCount}" value="0" step="0.1">
            <span id="lengthUnit" class="unit-label">mm</span>
        </div>
        
    `;
    container.appendChild(div);
    cambiarUnidades();
}

function replaceButton() {
    var container2 = document.getElementById("button-apoyo");
    container2.innerHTML = `
        <button id="add-apoyo" onclick="addApoyoInput(); cambiaAgregar()">Agregar 3er Apoyo</button>
        <button onclick="guardarSoporte()">Guardar Apoyos</button>
        `;
    const div = document.getElementById(`apoyo-3`);
    if (div) {
        div.remove(); // Elimina el bloque de la página
    }
}

function cambiaAgregar() {
    var container1 = document.getElementById("button-apoyo");
    container1.innerHTML = `
        <button id="rem-apoyo" onclick="replaceButton()">Elimina Apoyo</button>
        <button onclick="guardarSoporte()">Guardar Apoyos</button>
        `;

}

function addApoyoInput() {
    const container = document.getElementById('inputContainer2');
    const div = document.createElement('div');
    div.className = 'input-group';
    div.id = `apoyo-3`; // Asignamos un ID único al bloque

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

function addFCInput() {
    forceCount++;

    const container1 = document.getElementById('inputContainer1');

    const div = document.createElement('div');
    div.className = 'fuerza-coord';
    div.id = `fuerCoord-${forceCount}`; // Asignamos un ID único al bloque

    div.innerHTML = `
                        <div class="entrada-tipo">
                            <label>Fuerza 2:</label>
                            <div class="input-group">
                                <label for="length${forceCount}">F${forceCount} en X: </label>
                                <input type="number" id="forceX${forceCount}" value="0" step="0.1">
                                <span id="forceXUnit" class="force-label">N</span>
                            </div>
                            <div class="input-group">
                                <label for="length${forceCount}">F${forceCount} en Y: </label>
                                <input type="number" id="forceY${forceCount}" value="0" step="0.1">
                                <span id="forceYUnit" class="force-label">N</span>
                            </div>
                            <div class="input-group">
                                <label for="length${forceCount}">F${forceCount} en Z: </label>
                                <input type="number" id="forceZ${forceCount}" value="0" step="0.1">
                                <span id="forceZUnit" class="force-label">N</span>
                            </div>
                        </div>
                        <br>
                        <div class="entrada-tipo">
                            <label>Coordenadas:</label>
                            <div class="input-group">
                                <label for="length${forceCount}"> X: </label>
                                <input type="number" id="coordEnX${forceCount}" value="0" step="0.1">
                                <span id="coordXUnit" class="unit-label">mm</span>
                            </div>
                            <div class="input-group">
                                <label for="length${forceCount}"> Y: </label>
                                <input type="number" id="coordEnY${forceCount}" value="0" step="0.1">
                                <span id="coordYUnit" class="unit-label">mm</span>
                            </div>
                            <div class="input-group">
                                <label for="length${forceCount}"> Z: </label>
                                <input type="number" id="coordEnZ${forceCount}" value="0" step="0.1">
                                <span id="coordZUnit" class="unit-label">mm</span>
                            </div>
                        </div>
    `;
    container1.appendChild(div);
    cambiarUnidades();
}
// Guarda las dimensiones del cilindro
function guardarCilindro() {

    for (let i = cilCountAct; i <= cilCount; i++) {
        const diametro = document.getElementById('diameter' + i).value;
        const largo = document.getElementById('length' + i).value;

        if (diametro && largo) {
            diametros.push(parseFloat(diametro));
            largos.push(parseFloat(largo));
            largoTotal += parseFloat(largo);
        } else {
            console.error(`Error: Valor inválido en cilindro ${i}`);
        }
        cilCountAct += 1;
    }

    // Actualizar las listas en la interfaz
    actualizarListaCil();

}

// Función para eliminar un cilindro dado su índice
function eliminarCilindro(index) {
    largoTotal -= parseFloat(largos[index]);
    diametros.splice(index, 1); // Eliminar el diametro en el índice dado

    largos.splice(index, 1); // Eliminar el largo en el índice dado
    const div = document.getElementById(`cilindro-${index + 1}`);
    if (div) {
        div.remove(); // Elimina el bloque de la página
    }


    // Actualizar las listas en la interfaz
    actualizarListaCil();
    createCylinderEsc2D()
}

// Función para actualizar las listas en la página
function actualizarListaCil() {
    let listaCilindros = document.getElementById("listaCilindros");
    //let listaLargos = document.getElementById("listaLargos");

    listaCilindros.innerHTML = ""; // Limpiar la lista de diametros

    // Mostrar cada valor en las listas con la opción de eliminar
    diametros.forEach((diametro, index) => {
        let li = document.createElement("li");
        li.style.marginBottom = "10px"; // Espacio entre elementos
        li.textContent = `Cilindro ${index + 1}: Diametro = ${diametro}, Largo = ${largos[index]} `;
        let botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.onclick = () => eliminarCilindro(index); // Asignar el evento de eliminar
        li.appendChild(botonEliminar);
        listaCilindros.appendChild(li);
    });
    createCylinderEsc2D()

}

// Guarda las fuerzas y su coordenada
function guardarFuerzas() {

    for (let k = forceCountAct; k <= forceCount; k++) {
        // Obtener los valores de los inputs
        let fuerzaX = document.getElementById("forceX" + k).value;
        let fuerzaY = document.getElementById("forceY" + k).value;
        let fuerzaZ = document.getElementById("forceZ" + k).value;
        let coordX = document.getElementById("coordEnX" + k).value;
        let coordY = document.getElementById("coordEnY" + k).value;
        let coordZ = document.getElementById("coordEnZ" + k).value;

        // Validar que los valores no estén vacíos
        if (fuerzaX == 0 && fuerzaY == 0 && fuerzaZ == 0) {
            alert("Por favor, ingrese valores.");
            return;
        }

        // Agregar los valores a las respectivas listas
        fuerzasX.push(parseFloat(fuerzaX));
        fuerzasY.push(parseFloat(fuerzaY));
        fuerzasZ.push(parseFloat(fuerzaZ));
        coordenadasX.push(parseFloat(coordX));
        coordenadasY.push(parseFloat(coordY));
        coordenadasZ.push(parseFloat(coordZ));
        forceCountAct ++;
    }
    // Actualizar las listas en la interfaz
    actualizarListaFuerza();

    // Limpiar los inputs
    // document.getElementById("forceX").value = "0";
    // document.getElementById("forceY").value = "0";
    // document.getElementById("forceZ").value = "0";
    // document.getElementById("coordEnX").value = "0";
    // document.getElementById("coordEnY").value = "0";
    // document.getElementById("coordEnZ").value = "0";
}

// Función para eliminar un cilindro dado su índice
function eliminarFuerza(indexx) {
    fuerzasX.splice(indexx, 1); // Eliminar el diametro en el índice dado
    fuerzasY.splice(indexx, 1); // Eliminar el diametro en el índice dado
    fuerzasZ.splice(indexx, 1); // Eliminar el diametro en el índice dado
    coordenadasX.splice(indexx, 1); // Eliminar el largo en el índice dado
    coordenadasY.splice(indexx, 1); // Eliminar el largo en el índice dado
    coordenadasZ.splice(indexx, 1); // Eliminar el largo en el índice dado
    const div = document.getElementById(`fuerCoord-${indexx + 1}`);
    if (div) {
        div.remove(); // Elimina el bloque de la página
    }
    // Actualizar las listas en la interfaz
    actualizarListaFuerza();
}

// Función para actualizar las listas en la página
function actualizarListaFuerza() {
    let listaFuerzas = document.getElementById("listaFuerzas");
    //let listaLargos = document.getElementById("listaLargos");

    listaFuerzas.innerHTML = ""; // Limpiar la lista de fuerzas

    // Mostrar cada valor en las listas con la opción de eliminar
    fuerzasX.forEach((fuerzaX, indexx) => {
        let li = document.createElement("li");
        //let li = document.createElement("li");
        li.innerHTML = `F&#8593 ${indexx + 1}: (${fuerzaX} i, ${fuerzasY[indexx]} j, ${fuerzasZ[indexx]} k) <br> XYZ (${coordenadasX[indexx]}, ${coordenadasY[indexx]}, ${coordenadasZ[indexx]}) `;
        let botonEliminarF = document.createElement("button");
        botonEliminarF.textContent = "Eliminar";
        botonEliminarF.onclick = () => eliminarFuerza(indexx); // Asignar el evento de eliminar
        li.appendChild(botonEliminarF);
        listaFuerzas.appendChild(li);
    });

}

function dibujarFlechas(scaleFactor = 1) {
    const canvas3 = document.getElementById('layer3');
    const ctx3 = canvas3.getContext('2d'); // Capa para las flechas
    const coordsDisplay = document.getElementById('coords');
    // Evento para mostrar las coordenadas del mouse en la capa superior
    canvas3.addEventListener('mousemove', (event) => {
        const rect = canvas3.getBoundingClientRect();
        const x = ((event.clientX - rect.left) - 40).toFixed(0);
        const y = -1 * (((event.clientY - rect.top) - 175).toFixed(0));
        coordsDisplay.textContent = `Coordenadas del mouse: (${((x / 2) / scaleFactor).toFixed(1)}, ${((y / 2) / scaleFactor).toFixed(1)}, ${largoTotal}, ${scaleFactor})`;
        // document.getElementById("coordEnX").value = ((x / 2) / scaleFactor).toFixed(1);
        // document.getElementById("coordEnY").value = ((y / 2) / scaleFactor).toFixed(1);
    });

    // Evento click para dibujar la flecha en la capa de flechas
    canvas3.addEventListener("click", (event) => {
        const rect = canvas3.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Limpiar solo la capa de flechas
        ctx3.clearRect(0, 0, canvas3.width, canvas3.height);

        // Obtener las coordenadas desde los inputs
        const forceX = parseFloat(document.getElementById("forceX").value);
        const forceY = parseFloat(document.getElementById("forceY").value);
        const forceZ = parseFloat(document.getElementById("forceZ").value);

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

        // Llama a la función guardarFuerzas para registrar las coordenadas
        guardarFuerzas();
    });
}
// Función para dibujar los ejes con escala ajustada
function drawAxes(scaleFactor = 1) {
    const canvas2 = document.getElementById('layer2');
    const ctx2 = canvas2.getContext('2d'); // Capa para los ejes
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    const centerX = 40;
    const centerY = 175;

    // Eje X
    ctx2.beginPath();
    ctx2.moveTo(0, canvas2.height / 2);
    ctx2.lineTo(canvas2.width, canvas2.height / 2);
    ctx2.strokeStyle = 'black';
    ctx2.lineWidth = 1;
    ctx2.stroke();

    // Números y marcas en el eje X ajustados por el scaleFactor
    ctx2.fillStyle = 'black';
    ctx2.font = '10pt Verdana';

    for (let i = -40; i <= 800; i += 40) {
        let x = centerX + i;  // Ajustar por el scaleFactor
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

    // Números y marcas en el eje Y ajustados por el scaleFactor
    for (let i = -120; i <= 200; i += 40) {
        let y = centerY - i;  // Ajustar por el scaleFactor
        ctx2.moveTo(centerX - 5, y);
        ctx2.lineTo(centerX + 5, y);
        ctx2.stroke();
        if (i !== 0) {
            ctx2.fillText(((i / 2) / scaleFactor).toFixed(1), centerX + 10, y + 3); // Ajustar números
        }
    }

    ctx2.fillText('Eje Y', 80, 30);
}
// Generar cilindro en 2 dimensiones
function createCylinderEsc2D() {
    const canvas1 = document.getElementById('layer1');
    const ctx1 = canvas1.getContext('2d'); // Capa para los rectángulos







    // Dibujar los elementos

    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    let inix = 40;
    let width = 40;
    let height = canvas1.height / 2;
    let scaleFactor = 1; // Factor de escala por defecto

    for (let i = 0; i < diametros.length; i++) {
        scaleFactor = Math.max(1, 300 / largoTotal);
        width = (largos[i] * 2) * scaleFactor;
        height = (diametros[i] * 2) * scaleFactor;

        ctx1.fillStyle = "#ced5d8";
        ctx1.fillRect(inix, canvas1.height / 2 - height / 2, width, height);
        ctx1.strokeStyle = 'black';
        ctx1.lineWidth = 1;
        ctx1.strokeRect(inix, canvas1.height / 2 - height / 2, width, height);

        inix += width;
    }

    // Dibujar los ejes ajustados por el scaleFactor
    drawAxes(scaleFactor);
    dibujarFlechas(scaleFactor);
}

// Dibuja el cilindro en 3D
function createCylinderEsc3D() {
    const resolution = 50; // Resolución (número de segmentos)
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
        title: 'Cilindro Final',
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
            aspectratio: { x: 1, y: 1, z: 1 }
        }
    };

    return { traces, layout };
}

function updateCylindersEsc() {
    let { traces: traces3D, layout: layout3D } = createCylinderEsc3D();
    Plotly.newPlot('plot3D', traces3D, layout3D);

    storedValues = {
        forceX: parseFloat(document.getElementById('forceX').value) || 0,
        forceY: parseFloat(document.getElementById('forceY').value) || 0,
        forceZ: parseFloat(document.getElementById('forceZ').value) || 0,
        coordX: parseFloat(document.getElementById('coordX').value) || 0,
        coordY: parseFloat(document.getElementById('coordY').value) || 0,
        coordZ: parseFloat(document.getElementById('coordZ').value) || 0
    };

    console.log("Stored values:", storedValues);
}