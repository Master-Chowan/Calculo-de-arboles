function downloadSTL() {
    const radius = storedValues.radius || 20;
    const length = storedValues.length || 180;

    // Crear una escena de Three.js
    const scene = new THREE.Scene();

    // Crear la geometría del cilindro
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 320);

    // Rotar el cilindro para que esté horizontal
    geometry.rotateZ(Math.PI / 2);

    // Crear un material (no afecta al STL, pero es necesario para crear el mesh)
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    // Crear el mesh y añadirlo a la escena
    const cylinder = new THREE.Mesh(geometry, material);
    scene.add(cylinder);

    // Crear el exportador STL
    const exporter = new THREE.STLExporter();

    // Exportar la escena a STL
    const stlString = exporter.parse(scene);

    // Crear un Blob con el contenido STL
    const blob = new Blob([stlString], { type: 'text/plain' });

    // Crear un enlace de descarga
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'cylinder.stl';
    link.click();

    // Liberar el objeto URL
    URL.revokeObjectURL(link.href);
}