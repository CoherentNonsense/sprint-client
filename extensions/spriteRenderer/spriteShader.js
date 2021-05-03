
export const vertexShaderSource = `#version 300 es
in vec4 a_position;
in vec2 a_texcoord;
in float a_brightness;

out vec2 v_texcoord;
out float brightness;

void main()
{
    gl_Position = a_position;
    v_texcoord = a_texcoord;
    brightness = a_brightness;
}
`;


export const fragmentShaderSource = `#version 300 es
precision lowp float;

in vec2 v_texcoord;
in float brightness;
uniform sampler2D u_texture;

out vec4 color;

void main()
{
    color = texture(u_texture, v_texcoord) * vec4(brightness, brightness, brightness, 1.0);
}
`;