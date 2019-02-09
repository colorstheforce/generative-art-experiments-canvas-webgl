global.THREE = require('three');

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const eases = require('eases');
const BezierEasing = require('bezier-easing');
const glslify = require('glslify');

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

  // SphereGeometry takes a radius and a density for the Sphere
  const geometry = new THREE.SphereGeometry(1, 32, 32);

  // Basic "unlit" material with no depth

  const palette = random.pick(palettes);

  // Create a fragment shader

  const fragmentShader = glslify(/* glsl*/ `
    varying vec2 vUv;
    #pragma glslify: noise = require('glsl-noise/simplex/3d');
    uniform vec3 color;
    uniform float time;
    void main() {
      // 0.3 is noise amplitude and 3.0 is noise frequency 
      float offset = 0.3 * noise(vec3(vUv.xy * 5.0, time));
      gl_FragColor = vec4(vec3(color + vUv.y + offset), 1.0);
    }
  `);
  // Creates a vertex shader
  const vertexShader = glslify(/* glsl*/ `
    varying vec2 vUv;
    uniform float time;
    #pragma glslify: noise = require('glsl-noise/simplex/4d');

    void main(){
      vUv = uv;
      vec3 pos = position.xyz;
      // 0.05 is noise amplitude and 4.0 is noise frequency 
      pos += 0.05 * normal * noise(vec4(pos.xyz * 4.0, 0.0));
      // 0.15 is noise amplitude and 1.0 is noise frequency 
      pos += 0.15 * normal * noise(vec4(pos.xyz * 1.0, 0.0));
      // 0.15 is noise amplitude and 2.0 is noise frequency 
      pos += 0.15 * normal * noise(vec4(pos.xyz * 1000.0, 0.0));
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `);

  // Creates and array of meshes
  const meshes = [];
  // Create the mesh
  for (let i = 0; i < 1; i++) {
    const material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        color: { value: new THREE.Color(random.pick(palette)) },
        time: { value: 0 }
      }
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.multiplyScalar(1);
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
