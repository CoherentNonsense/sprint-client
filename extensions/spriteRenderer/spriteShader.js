
export const vertexShaderSource = `#version 300 es
in vec4 a_position;
in vec2 a_texcoord;

out vec2 v_texcoord;

void main()
{
    gl_Position = a_position;
    v_texcoord = a_texcoord;
}
`;


export const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec2 v_texcoord;
uniform sampler2D u_texture;

out vec4 color;

void main()
{
    color = texture(u_texture, v_texcoord);
}
`;