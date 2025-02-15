let scene, camera, renderer, heartMesh, heartParticles, particleSystem, particles = [], isRotating = false;
const music = document.getElementById("music");
let lightDirection;  // Luz direccional para sombra dinámica

function init() {
    // Escena, cámara y renderizado
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Habilitar transparencia

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Fondo transparente
    document.getElementById("scene-container").appendChild(renderer.domElement);

    // Luz de ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Luz puntual
    const light = new THREE.PointLight(0xffffff, 0.7, 100);
    light.position.set(20, 5, 20);
    scene.add(light);

    // Luz direccional
    lightDirection = new THREE.DirectionalLight(0xffffff, 1);
    lightDirection.position.set(1, 1, 1).normalize();
    scene.add(lightDirection);

    // Corazón 3D
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(2, 2, 4, -2, 0, -4);
    heartShape.bezierCurveTo(-4, -2, -2, 2, 0, 0);

    const extrudeSettings = { depth: 1, bevelEnabled: true, bevelSize: 0.3, bevelThickness: 0.5 };
    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

    const material = new THREE.MeshStandardMaterial({
        color: 0xff4d6d,
        roughness: 0.4,
        metalness: 0,
        emissive: 0xff4d6d,
        emissiveIntensity: 10,
        envMapIntensity: 20
    });

    heartMesh = new THREE.Mesh(geometry, material);
    heartMesh.rotation.x = Math.PI / 30;
    scene.add(heartMesh);

    // Corazón de partículas
    createHeartParticles();
    addText();

    // Posición de la cámara
    camera.position.z = 20;

    animate();

    // Solo mantener un solo controlador de click para evitar conflictos
    document.getElementById("scene-container").addEventListener("click", function() {
        isRotating = !isRotating;
        if (isRotating) {
            music.currentTime = 15;  // Comienza desde los 60 segundos (1 minuto)
            music.play();
        } else {
            music.pause();
            music.currentTime = 0;  // Reinicia la música al principio si se detiene
        }
    });
}

function addText() {
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new THREE.TextGeometry('I LOVE YOU', {
            font: font,
            size: 1.5,
            height: 0.3,
            curveSegments: 10,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1
        });

        const textMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffd700,
            emissiveIntensity: 1.5,
        });

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(-5, 5, 1);
        textMesh.rotation.y = Math.PI * 0.02;

        scene.add(textMesh);
    });
}

function createHeartParticles() {
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterials = [
        new THREE.MeshBasicMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.5 }),
        new THREE.MeshBasicMaterial({ color: 0xff66b2, emissive: 0xff66b2, emissiveIntensity: 0.5 }),
        new THREE.MeshBasicMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 })
    ];

    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(4, 4, 10, -4, 0, -8);
    heartShape.bezierCurveTo(-10, -4, -4, 4, 0, 0);

    const points = heartShape.getPoints(100);
    const offsetY = 2;

    points.forEach(point => {
        const material = particleMaterials[Math.floor(Math.random() * particleMaterials.length)];
        const particle = new THREE.Mesh(particleGeometry, material);
        particle.position.set(point.x, point.y + offsetY, Math.random() * 2 - 1);
        scene.add(particle);
        particles.push(particle);
    });
}

function animate() {
    requestAnimationFrame(animate);

    if (isRotating) {
        heartMesh.rotation.y += 0.02;
        heartMesh.material.emissiveIntensity = 0.1;
        lightDirection.intensity = 0.7;
    } else {
        heartMesh.material.emissiveIntensity = 0.3;
        lightDirection.intensity = 1;
    }

    particles.forEach(particle => {
        particle.position.x += (Math.random() - 0.5) * 0.03;
        particle.position.y += (Math.random() - 0.5) * 0.03;
        particle.position.z += (Math.random() - 0.5) * 0.03;
    });

    renderer.render(scene, camera);
}

document.addEventListener("DOMContentLoaded", () => {
    setInterval(() => {
        let heart = document.createElement("img");
        heart.src = "img/corazon2.png";
        heart.classList.add("floating-heart");
        heart.style.left = Math.random() * 100 + "vw";
        document.body.appendChild(heart);

        setTimeout(() => { heart.remove(); }, 5000);
    }, 500);
});

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
