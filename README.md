# Generative Art Experiments with Canvas and WebGL

## Purpose

Store the learning and showcase the progression through ![Creative Coding with Canvas & WebGL](https://frontendmasters.com/courses/canvas-webgl/) by Matt DesLauriers on Frontend Masters

## Objectives

- Learn underlying principles of generative art using Canvas 
- Learn about WebGL via Three.js
- Get a better understading of working within a 3D environment
- Learning more about Meshes, Materials, vectors, shaders, animation

## Step-by-step account

### sketch.js

- Using canvas-sketch I created a grid on a canvas and placed a object at each coordinate of that grid (text or shapes)
- Used a lerping function to create a border around the edge of the canvas
- Used 2d noise functions to modify the object radii and rotation
- Filtered the grid points to create some organic clustering, after having attempted Gaussian distribution
- Randomly picked a color pallete

### Generated examples

...

### shader.js

- Basic implementations of a shader inside canvas-sketch using glslify
- Learned the basics of glsl markup, concepts and variable types
- Practiced passing down uniforms to the shader code
- Used native functions like length() and smoothstep() to create a circle mask on top of the vector
- Used sin(), cos(), and mix() to generate intersting colors and gradients
- Used 3D noise functions to create an shimmering surface color effect

### Generated example

...

### webgl.js

- Basic implementation of WebGL to generate an array of 3D shapes
- Learned ThreeJS basics on lights, cameras, material, meshes, geometry, vectors
- Randomly placed boxes of random dimensions and random colors
- Worked with sin(), playhead, and PI to create a smooth rotation animation 
- Used bezier-easing to define a custom easing

### Generated example

...

### webgl-vertex-shader.js

- Learned the principles of shaders inside ThreeJS
- Added a fragment and vertex shaders to a material
- Learned how to scale geometry using vertex shaders
- Learned how to pass down uniforms from ThreeJS to be used inside shaders

### Generated example

...

### webgl-vertex-shader-warp.js

- Building upon the previous examples to warp geometry using vertex shader noise functions

### Generated example

...

### webgl-vertex-shader-planet.js

- Further build-up on the last two vertex-shader examples
- Layering up multiple 4D noise functions to vertex shader in order to create the illusion of a surface map
- Adding a 3D noise function in order to produce a colorised shimmer effect
- Padding down updated uniform values from ThreeJS to each mesh

### Generated example

...
