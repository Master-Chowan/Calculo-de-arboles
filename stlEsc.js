function downloadSTLEsc() {
    // Crear una escena de Three.js
    const scene = new THREE.Scene();

    // Iterar sobre los cilindros definidos en radios y largos
    let inix = 0; // Posición inicial en X para el primer cilindro

    for (let i = 0; i < diametros.length; i++) {
        const diameter = diametros[i]; // Diametro del cilindro actual
        const length = largos[i]; // Longitud del cilindro actual

        // Crear la geometría del cilindro
        const geometry = new THREE.CylinderGeometry(diameter, diameter, length, 50);

        // Rotar el cilindro para que esté horizontal (en el eje X)
        geometry.rotateZ(Math.PI / 2);

        // Trasladar el cilindro a su posición en X
        geometry.translate(inix + length / 2, 0, 0);

        // Crear un material (necesario para el mesh, pero no afecta el STL)
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

        // Crear el mesh del cilindro y añadirlo a la escena
        const cylinder = new THREE.Mesh(geometry, material);
        scene.add(cylinder);

        // Actualizar la posición para el siguiente cilindro
        inix += length;
    }

    // Crear el exportador STL
    const exporter = new THREE.STLExporter();

    // Exportar la escena a STL
    const stlString = exporter.parse(scene);

    // Crear un Blob con el contenido STL
    const blob = new Blob([stlString], { type: 'text/plain' });

    // Crear un enlace de descarga
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'cylinders.stl';
    link.click();

    // Liberar el objeto URL
    URL.revokeObjectURL(link.href);
}
