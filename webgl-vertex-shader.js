global.THREE = require('three');

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const eases = require('eases');
const BezierEasing = require('bezier-easing');

const settings = {
  animate: true,
  dimensions: [520, 520],
  fps: 30,
  duration: 10,
  // Get a WebGL canvas rather than 2D
  context: 'webgl',
  // Turn on MSAA
  attributes: { antialias: true }
};

const sketch = ({ context, width, height }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('hsl(0, 0%, 95%)', 1);

  // Setup a camera, we will update its settings on resize
  const camera = new THREE.OrthographicCamera();

  // Setup your scene
  const scene = new THREE.Scene();

  // Re-use the same Geometry across all our cubes
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  // Basic "unlit" material with no depth

  const palette = random.pick(palettes);

  // Create a fragment shader

  const fragmentShader = /* glsl*/ `
    varying vec2 vUv;
    uniform vec3 color;
    void main() {
      gl_FragColor = vec4(vec3(color * vUv.y), 1.0);
    }
  `;
  // Creates a vertex shader
  const vertexShader = /* glsl*/ `
    varying vec2 vUv;
    uniform float time;
    void main(){
      vUv = uv;
      vec3 pos = position.xyz * sin(time);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  // Creates and array of meshes
  const meshes = [];
  // Create the mesh
  for (let i = 0; i < 100; i++) {
    const material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        color: { value: new THREE.Color(random.pick(palette))},
        time: { value: 0 }
      }
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.multiplyScalar(0.5);
    // Then add the group to the scene
    scene.add(mesh);
    meshes.push(mesh);
  }
  scene.add(new THREE.AmbientLight('hsl(0, 0%, 50%)'));
  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(0, 0, 4);
  scene.add(light);

  const easeFn = BezierEasing(0.18, 0.7, 0.31, 0.88);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);

      // Setup an isometric perspective
      const aspect = viewportWidth / viewportHeight;
      const zoom = 2;
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;
      camera.near = -100;
      camera.far = 100;
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update camera properties
      camera.updateProjectionMatrix();
    },
    // And render events here
    render({ playhead, time }) {
      // Draw scene with our camera
      const t = Math.sin(playhead * Math.PI);
      scene.rotation.y = easeFn(t);
      meshes.forEach(mesh => {
        mesh.material.uniforms.time.value = time;
      });
      renderer.render(scene, camera);
    },
    // Dispose of WebGL context (optional)
    unload() {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
