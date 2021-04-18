import Shader from "./shader.js";
import { vertexShaderSource, fragmentShaderSource } from "./spriteShader.js";

class Renderer
{
  constructor(canvas)
  {
    this.canvas = canvas;
    this.running = false;

    this.vbo;
    this.vao;
    this.ebo;

    this.maxQuads = 128 * 128;
    this.maxVertices;
    this.vertices;
    this.indices;
    this.spriteCount = 0;
    this.vertexPtr = 0;
    this.indexPtr = 0;

    this.spritesheet = new Image();
    this.spritesheet.crossOrigin = "";


    this.textureId;
    // Download spritesheet
    this.spritesheet.src = "https://i.ibb.co/NVM1Gxr/spritesheet.png";
    this.spritesheet.addEventListener("load", () => {
      this.running = true;
      this.init();
    });
  }


  init()
  {
    // Create WebGl context
    this.webGl = this.canvas.getContext("webgl2");

    // Check if webGl is supported
    if (this.webGl === null)
    {
      alert("WebGl is not supported on this browser.");
      return;
    }


    // Create shader
    this.shader = new Shader(this.webGl);
    this.shader.compile(vertexShaderSource, fragmentShaderSource);

    if (!this.shader.compiled)
    {
      alert("Failed to initialize sprite renderer. ERROR:shader_compilation");
      return;
    }

    // Create texture (spritesheet)
    this.textureId = this.webGl.createTexture();
    this.webGl.bindTexture(this.webGl.TEXTURE_2D, this.textureId);
    this.webGl.texParameteri(this.webGl.TEXTURE_2D, this.webGl.TEXTURE_MIN_FILTER, this.webGl.NEAREST_MIPMAP_NEAREST);
    this.webGl.texParameteri(this.webGl.TEXTURE_2D, this.webGl.TEXTURE_MIN_FILTER, this.webGl.NEAREST);
    this.webGl.texParameteri(this.webGl.TEXTURE_2D, this.webGl.TEXTURE_MAG_FILTER, this.webGl.NEAREST);
    this.webGl.blendFunc(this.webGl.SRC_ALPHA, this.webGl.ONE_MINUS_SRC_ALPHA);
    this.webGl.enable(this.webGl.BLEND);
    this.webGl.texImage2D(this.webGl.TEXTURE_2D, 0, this.webGl.RGBA, this.webGl.RGBA, this.webGl.UNSIGNED_BYTE, this.spritesheet);

    // Create vbo
    const floatsPerVertex = 4; // u, v, x, y
    const verticesPerQuad = 4; // It's a square, you know it :|
    this.maxVertices = this.maxQuads * verticesPerQuad * floatsPerVertex;

    this.vertices = new Float32Array(this.maxVertices);
    this.vbo = this.webGl.createBuffer();
    this.webGl.bindBuffer(this.webGl.ARRAY_BUFFER, this.vbo);
    this.webGl.bufferData(this.webGl.ARRAY_BUFFER, this.vertices, this.webGl.DYNAMIC_DRAW);

    // Create ebo
    const indicesPerQuad = 6; // Two triangles
    const indexSize = this.maxQuads * indicesPerQuad;

    this.indices = this._generateIndices(indexSize);
    this.ebo = this.webGl.createBuffer();
    this.webGl.bindBuffer(this.webGl.ELEMENT_ARRAY_BUFFER, this.ebo)
    this.webGl.bufferData(this.webGl.ELEMENT_ARRAY_BUFFER, this.indices, this.webGl.DYNAMIC_DRAW);


    // State setup (Tell WebGl what data to use)
    this.webGl.useProgram(this.shader.programId);
    
    this.webGl.enableVertexAttribArray(this.shader.getAttribute("a_position"));
    this.webGl.vertexAttribPointer(
      this.shader.getAttribute("a_position"),
      2,
      this.webGl.FLOAT,
      false,
      4 * 4,
      0
    );

    this.webGl.enableVertexAttribArray(this.shader.getAttribute("a_texcoord"));
    this.webGl.vertexAttribPointer(
      this.shader.getAttribute("a_texcoord"),
      2,
      this.webGl.FLOAT,
      false,
      4 * 4,
      2 * 4
    );

    this.webGl.uniform1i(this.shader.getUniform("u_texture"), 0);

    this.resize();
}


  startDraw()
  {
    if (!this.running) return;
  }

  render() {
    if (!this.running) return;
    this.webGl.bufferSubData(this.webGl.ARRAY_BUFFER, 0, this.vertices, 0, this.vertexPtr);
    this.webGl.drawElements(this.webGl.TRIANGLES, this.indexPtr, this.webGl.UNSIGNED_SHORT, 0);

    this.indexPtr = 0;
    this.vertexPtr = 0;
  }

  drawSprite(u, v, x, y)
  {
    if (!this.running) return;

    if (this.vertexPtr >= this.maxVertices)
    {
      this.render();
    }

    const x1 = x;
    const y1 = y;
    const x2 = x + 1;
    const y2 = y - 1;

    const u1 = u + 0.05;
    const v1 = v + 0.05;
    const u2 = u + 0.95;
    const v2 = v + 0.95;

    // Top Left
    this.addAttribute(this.normalizePosition(x1, y1));
    this.addAttribute(this.normalizeTexture(u1, v1));

    // Bottom Left
    this.addAttribute(this.normalizePosition(x1, y2));
    this.addAttribute(this.normalizeTexture(u1, v2));

    // Top Right
    this.addAttribute(this.normalizePosition(x2, y1));
    this.addAttribute(this.normalizeTexture(u2, v1));

    // Bottom Right
    this.addAttribute(this.normalizePosition(x2, y2));
    this.addAttribute(this.normalizeTexture(u2, v2));

    this.indexPtr += 6;
  }

  addAttribute(vec2)
  {
      this.vertices[this.vertexPtr++] = vec2.x;
      this.vertices[this.vertexPtr++] = vec2.y;
  }

  normalizePosition(x, y)
  {
      return {
          x: (x - 0.5) / 15.5,
          y: (y + 0.5) / 15.5
      };
  }

  normalizeTexture(x, y)
  {
      return {
          x: x * 16 / this.spritesheet.width,
          y: y * 16 / this.spritesheet.height,
      };
  }

  resize()
  {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.webGl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  _generateIndices(n_indicies)
  {
    const indicies = new Uint16Array(n_indicies);
    for (let i = 0, j = 0; i < n_indicies; i += 6, j += 4)
    {
        indicies[ i ] = j;
        indicies[i+1] = j + 1;
        indicies[i+2] = j + 2;
        indicies[i+3] = j + 1;
        indicies[i+4] = j + 3;
        indicies[i+5] = j + 2;
    }

    return indicies;
}

}

export default Renderer;