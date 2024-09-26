// Dibuja el cilindro en 2D

const radios = [30, 50, 80, 30];
const largos = [60, 80, 100, 60];

function createCylinderEsc2D() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const coordsDisplay = document.getElementById('coords');

    // Evento para mostrar las coordenadas del mouse
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) - 43).toFixed(0);
        const y = -1 * (((event.clientY - rect.top) - 177).toFixed(0));
        coordsDisplay.textContent = `Coordenadas del mouse: (${x / 2}, ${y / 2})`;
    });
    // canvas.addEventListener("click", (event) => {

    //     const rect = canvas.getBoundingClientRect();
    //     const x = event.clientX - rect.left; // Coordenada X relativa al canvas
    //     const y = event.clientY - rect.top;  // Coordenada Y relativa al canvas

    //     // Limpiar el canvas antes de dibujar una nueva flecha
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);

    //     // Dibujar la línea principal de la flecha
    //     const lineLength = 20; // Longitud de la línea de la flecha
    //     ctx.beginPath();
    //     ctx.moveTo(x, y); // Punto inicial de la línea
    //     ctx.lineTo(x, y - lineLength); // Punto final de la línea (hacia arriba)
    //     ctx.strokeStyle = 'black';
    //     ctx.lineWidth = 2;
    //     ctx.stroke();

    //     // Dibujar la punta de la flecha (un triángulo pequeño)
    //     ctx.beginPath();
    //     ctx.moveTo(x, y - lineLength); // Punto de inicio de la punta de la flecha
    //     ctx.lineTo(x - 5, y - lineLength + 10); // Línea hacia la izquierda
    //     ctx.lineTo(x + 5, y - lineLength + 10); // Línea hacia la derecha
    //     ctx.closePath(); // Cerrar el triángulo
    //     ctx.fillStyle = 'black';
    //     ctx.fill();

    // });


    // Función para dibujar los ejes de coordenadas
    function drawAxes() {

        // Coordenadas del centro del canvas
        const centerX = 40;
        const centerY = 175;

        // Dibujar eje X
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2); // Desde el borde izquierdo
        ctx.lineTo(canvas.width, canvas.height / 2); // Hasta el borde derecho
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Dibujar números y marcas en el eje X
        for (let i = -50; i <= 800; i += 30) {
            let x = centerX + i;
            ctx.moveTo(x, centerY - 5);
            ctx.lineTo(x, centerY + 5);

            ctx.stroke();

            // Números en el eje X
            if (i !== 0) {
                ctx.fillText(i / 2, (x - 5), centerY + 15);
                ctx.fillStyle = 'black';
            }
            ctx.fillText('Eje X', 850, 195);
        }

        // Dibujar eje Y
        ctx.beginPath();
        ctx.moveTo(40, 0); // Desde el borde superior
        ctx.lineTo(40, canvas.height); // Hasta el borde inferior
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Dibujar números y marcas en el eje Y
        for (let i = -150; i <= 200; i += 30) {
            let y = centerY - i;
            ctx.moveTo(centerX - 5, y);
            ctx.lineTo(centerX + 5, y);
            ctx.stroke();

            // Números en el eje Y
            if (i !== 0) {
                ctx.fillText(i / 2, centerX + 10, (y + 3));
            }
            ctx.fillText('Eje Y', 5, 30);

        }
    }

    // Función para dibujar el rectángulo
    function drawRectangle() {
        //if (isNaN(radius) || isNaN(length) || radius <= 0 || length <= 0) {
        //    alert("Please enter valid positive numbers for radius and length.");
        //   return;
        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar los ejes
        drawAxes();

        // Obtener los valores del formulario
        
        let inix = 40;
        let width = 40;

        // Se ajusta la altura inicial
        let height = canvas.height / 2;

        for (let i = 0; i < radios.length; i++) {
            // Actualizar ancho y alto
            width = largos[i] * 2;  // Usamos el valor de `largos[i]` directamente
            height = radios[i] * 2; // Usamos el valor de `radios[i]` directamente

            // Dibujar el rectángulo
            ctx.fillStyle = "#b8b8b8";
            ctx.fillRect(inix, canvas.height / 2 - height / 2, width, height);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.strokeRect(inix, canvas.height / 2 - height / 2, width, height);

            // Actualizar la posición `inix` para el siguiente rectángulo
            inix += width;


        }
    }
    drawRectangle();
    drawAxes();
}
// Dibuja el cilindro en 3D
function createCylinderEsc3D() {
    const resolution = 50; // Resolución (número de segmentos)
    let inix = 0; // Posición inicial en X para el primer cilindro
    let traces = []; // Acumulador de trazas

    for (let i = 0; i < radios.length; i++) {
        // Definir el radio y la longitud del cilindro
        let radius = radios[i];  
        let length = largos[i];

        // Vectores para las coordenadas del cilindro
        let xs = [];
        let ys = [];
        let zs = [];

        // Generar los vértices del cilindro
        for (let j = 0; j < resolution; j++) {
            const theta = (j / resolution) * 2 * Math.PI; // Ángulo en radianes
            zs.push(radius * Math.cos(theta)); // Coordenada Z
            ys.push(radius * Math.sin(theta)); // Coordenada Y
            xs.push(inix); // Inicio del cilindro en X

            zs.push(radius * Math.cos(theta)); 
            ys.push(radius * Math.sin(theta));
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
        title: 'Cilindro con Relleno (Radio en Y y Z, Largo en X)',
        scene: {
            xaxis: {
                title: 'Eje X (Largo)',
                range: [-10, inix + 10], // Ajuste según la longitud total
                showgrid: true,
                zeroline: true,
                showline: true,
                gridwidth: 2,
                gridcolor: 'lightgray',
                linecolor: 'black',
                linewidth: 3,
                tickfont: { size: 10, color: 'black' },
            },
            yaxis: {
                title: 'Eje Y (Radio)',
                range: [-120, 120],
                showgrid: true,
                zeroline: true,
                showline: true,
                gridwidth: 2,
                gridcolor: 'lightgray',
                linecolor: 'black',
                linewidth: 3,
                tickfont: { size: 10, color: 'black' },
            },
            zaxis: {
                title: 'Eje Z (Radio)',
                range: [-120, 120],
                showgrid: true,
                zeroline: true,
                showline: true,
                gridwidth: 2,
                gridcolor: 'lightgray',
                linecolor: 'black',
                linewidth: 3,
                tickfont: { size: 10, color: 'black' },
            },
            aspectratio: { x: 6, y: 1, z: 1 }
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
