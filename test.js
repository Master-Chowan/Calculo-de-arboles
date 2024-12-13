function calcularMomentos(longitud, fuerzas, posiciones) {
    const intervalos = 100; // Dividir el eje en puntos
    const dx = longitud / intervalos;
    const momentosXY = [];
    const momentosXZ = [];
    const posicionesX = [];

    for (let i = 0; i <= intervalos; i++) {
        const x = i * dx;
        posicionesX.push(x);

        let momentoXY = 0;
        let momentoXZ = 0;

        for (let j = 0; j < fuerzas.length; j++) {
            const F = fuerzas[j]; // Fuerza [Fx, Fy, Fz]
            const pos = posiciones[j]; // Posición de la fuerza

            const distancia = x - pos[0];
            if (distancia > 0) {
                momentoXY += -F[1] * distancia; // Proyección en XY
                momentoXZ += F[2] * distancia;  // Proyección en XZ
            }
        }

        momentosXY.push(momentoXY);
        momentosXZ.push(momentoXZ);
    }

    return { posicionesX, momentosXY, momentosXZ };
}

// Ejemplo de uso
const longitud = 10; // Longitud del eje
const fuerzas = [
    [0, -100, 0], // Fuerza 1: [Fx, Fy, Fz]
    [0, 0, 50]    // Fuerza 2: [Fx, Fy, Fz]
];
const posiciones = [
    [4, 0, 0], // Posición de la fuerza 1
    [7, 0, 0]  // Posición de la fuerza 2
];

const { posicionesX, momentosXY, momentosXZ } = calcularMomentos(longitud, fuerzas, posiciones);

// Graficar con Plotly
Plotly.newPlot("grafico", [
    {
        x: posicionesX,
        y: momentosXY,
        mode: "lines",
        name: "Momento XY",
        line: { color: "blue" }
    },
    {
        x: posicionesX,
        y: momentosXZ,
        mode: "lines",
        name: "Momento XZ",
        line: { color: "red" }
    }
], {
    title: "Diagramas de Momentos",
    xaxis: { title: "Posición sobre el eje (m)" },
    yaxis: { title: "Momento (Nm)" }
});
