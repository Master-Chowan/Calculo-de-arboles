let storedValues = {};

// Dibuja el cilindro en 2D
function createCylinder2D() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const coordsDisplay = document.getElementById('coords');

    // Evento para mostrar las coordenadas del mouse
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) - 43).toFixed(0);
        const y = -1 * (((event.clientY - rect.top) - 177).toFixed(0));
        coordsDisplay.textContent = `Coordenadas del mouse: (${x}, ${y})`;
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
        for (let i = -50; i <= 800; i += 50) {
            let x = centerX + i;
            ctx.moveTo(x, centerY - 5);
            ctx.lineTo(x, centerY + 5);

            ctx.stroke();

            // Números en el eje X
            if (i !== 0) {
                ctx.fillText(i, x - 5, centerY + 15);
                ctx.fillStyle = 'black';
            }
            ctx.fillText('Eje X', 870, 195);
        }

        // Dibujar eje Y
        ctx.beginPath();
        ctx.moveTo(40, 0); // Desde el borde superior
        ctx.lineTo(40, canvas.height); // Hasta el borde inferior
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Dibujar números y marcas en el eje Y
        for (let i = -250; i <= 250; i += 50) {
            let y = centerY - i;
            ctx.moveTo(centerX - 5, y);
            ctx.lineTo(centerX + 5, y);
            ctx.stroke();

            // Números en el eje Y
            if (i !== 0) {
                ctx.fillText(i, centerX + 10, y + 3);
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
        const width = document.getElementById('length').value;
        const height = document.getElementById('radius').value;

        // Dibujar el rectángulo
        //ctx.beginPath();
        ctx.fillStyle = "#b8b8b8";
        ctx.fillRect(40, canvas.height / 2 - height / 2, width, height);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(40, canvas.height / 2 - height / 2, width, height);
    }
    drawRectangle();
    drawAxes();
}

// Dibuja el cilindro en 3D
function createCylinder3D(radius, length) {
    const resolution = 50; // Resolución (número de segmentos)

    // Generar los vértices del cilindro (ahora Z es el radio y Y el eje vertical)
    let xs = [];
    let ys = [];
    let zs = [];

    for (let i = 0; i < resolution; i++) {
        const theta = (i / resolution) * 2 * Math.PI; // Ángulo
        zs.push(radius * Math.cos(theta)); // Coordenada Z (radio)
        ys.push(radius * Math.sin(theta)); // Coordenada Y (radio)
        xs.push(0); // Inicio del cilindro en el eje X (largo)

        zs.push(radius * Math.cos(theta)); // Coordenada Z (radio)
        ys.push(radius * Math.sin(theta)); // Coordenada Y (radio)
        xs.push(length); // Fin del cilindro a lo largo del eje X (largo)
    }

    // Crear índices para las caras del cilindro
    let i = [];
    let j = [];
    let k = [];

    for (let iBase = 0; iBase < resolution; iBase++) {
        const nextBase = (iBase + 1) % resolution;

        // Dos triángulos por cada cara lateral
        i.push(iBase * 2);
        j.push(nextBase * 2);
        k.push(iBase * 2 + 1);

        i.push(nextBase * 2);
        j.push(nextBase * 2 + 1);
        k.push(iBase * 2 + 1);
    }

    // Definir la traza del cilindro
    let trace = {
        x: xs,
        y: ys,
        z: zs,
        i: i,
        j: j,
        k: k,
        opacity: 0.8,
        type: 'mesh3d',
        color: 'lightblue',
    };

    // Configuración del layout con cuadrícula extensa
    let layout = {
        title: 'Cilindro (Radio en Y y Z, Largo en X)',
        scene: {
            xaxis: {
                title: 'Eje X (Largo)',
                range: [-10, 890], // Rango del eje X (largo del cilindro + un margen)
                showgrid: true, // Mostrar la cuadrícula
                zeroline: true,
                showline: true,
                gridwidth: 2, // Ancho de la cuadrícula
                gridcolor: 'lightgray', // Color de la cuadrícula
                linecolor: 'black', // Color de las líneas de los ejes
                linewidth: 3, // Ancho de las líneas de los ejes
                tickfont: {
                    size: 10, // Tamaño de las etiquetas
                    color: 'black',
                }
            },
            yaxis: {
                title: 'Eje Y (Radio)',
                range: [-120, 120], // Rango del eje Y (radio del cilindro + un margen)
                showgrid: true, // Mostrar la cuadrícula
                zeroline: true,
                showline: true,
                gridwidth: 2, // Ancho de la cuadrícula
                gridcolor: 'lightgray', // Color de la cuadrícula
                linecolor: 'black', // Color de las líneas de los ejes
                linewidth: 3, // Ancho de las líneas de los ejes
                tickfont: {
                    size: 10, // Tamaño de las etiquetas
                    color: 'black',
                }
            },
            zaxis: {
                title: 'Eje Z (Radio)',
                range: [-120, 120], // Rango del eje Z (radio del cilindro + un margen)
                showgrid: true, // Mostrar la cuadrícula
                zeroline: true,
                showline: true,
                gridwidth: 2, // Ancho de la cuadrícula
                gridcolor: 'lightgray', // Color de la cuadrícula
                linecolor: 'black', // Color de las líneas de los ejes
                linewidth: 3, // Ancho de las líneas de los ejes
                tickfont: {
                    size: 10, // Tamaño de las etiquetas
                    color: 'black',
                }
            },
            aspectratio: {
                x: 6, y: 1, z: 1 // Relación de aspecto ajustada para un cilindro largo y delgado
            }
        }
    };

    return { traces: [trace], layout };
}

function updateCylinders() {
    let radius = parseFloat(document.getElementById('radius').value);
    let length = parseFloat(document.getElementById('length').value);

    if (isNaN(radius) || isNaN(length) || radius <= 0 || length <= 0) {
        alert("Please enter valid positive numbers for radius and length.");
        return;
    }

    //let {traces: traces2D, layout: layout2D} = createCylinder2D(radius, length);
    //Plotly.newPlot('plot2D', traces2D, layout2D);


    let { traces: traces3D, layout: layout3D } = createCylinder3D(radius, length);
    Plotly.newPlot('plot3D', traces3D, layout3D);

    // Store values
    storedValues = {
        radius: radius,
        length: length,
        forceX: parseFloat(document.getElementById('forceX').value) || 0,
        forceY: parseFloat(document.getElementById('forceY').value) || 0,
        forceZ: parseFloat(document.getElementById('forceZ').value) || 0,
        coordX: parseFloat(document.getElementById('coordX').value) || 0,
        coordY: parseFloat(document.getElementById('coordY').value) || 0,
        coordZ: parseFloat(document.getElementById('coordZ').value) || 0
    };

    console.log("Stored values:", storedValues);
}

// Initial plot
//updateCylinders();