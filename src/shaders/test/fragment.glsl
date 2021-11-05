precision mediump float;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying float vRandom;

    void main()
        {
            vec3 color = mix(uColor1, uColor2, vRandom);
            gl_FragColor.xyz = color;
            gl_FragColor.a = 1.0;
        }
    