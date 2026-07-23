import { useEffect, useRef } from "react";



const TEXT_SETS = [
  {
    title: '<span style="color:#581a8a">Gen-Z</span> taste<br>with<br><span style="color:#581a8a">millennial</span> experience',
    sub: "We are a team of 50+ creative Gen Zs ruling over millennials",
  },
  {
    title: 'Business/ Startup<br>Yours<br><span style="color:#b84a6a">Responsibility</span> <span style="color:#1a1418">Ours</span>',
    sub: "You don't need to worry. We do everything in a creative manner",
  },
  {
    title: 'Your <span style="color:#020c47">Brand</span> is<br>in Right Hand<br><span style="color:#020c47">Diva!</span>',
    sub: "We will scroll reels, You scroll website and explore Belvo",
  },
];

const heroStyles = `
@media (max-width: 1000px) {
  .hero-layout { padding: 2rem 2.5rem; }
  .hero-subtitle { max-width: 65%; }
}
@media (max-width: 700px) {
  .hero-layout { padding: 1.5rem; }
  .hero-title { max-width: 100%; font-size: clamp(3rem, 12vw, 5rem); }
  .hero-subtitle { max-width: 100%; font-size: 0.8rem; }
}
`;

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(0);
  const targetRef = useRef(0);
  const lastSnapRef = useRef(-1);
  const settledRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: true, premultipliedAlpha: false });
    if (!gl) return;

    function resize() {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = rect.width * dpr;
      const h = rect.height * dpr;
      canvas!.width = w;
      canvas!.height = h;
      canvas!.style.width = rect.width + "px";
      canvas!.style.height = rect.height + "px";
      gl!.viewport(0, 0, w, h);
    }

    window.addEventListener("resize", resize);
    new ResizeObserver(() => resize()).observe(canvas.parentElement!);

    const vsSource = `attribute vec2 a_position;void main(){gl_Position=vec4(a_position,0.0,1.0);}`;

    const fsSource = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_state;
vec3 purplePalette(float t){vec3 a=vec3(0.922,0.871,0.961);vec3 b=vec3(0.820,0.722,0.882);vec3 c=vec3(0.690,0.569,0.780);vec3 d=vec3(0.871,0.780,0.922);float p=mod(t,1.0)*3.0;if(p<1.0)return mix(a,b,p);if(p<2.0)return mix(b,c,p-1.0);return mix(c,d,p-2.0);}
vec3 pinkPalette(float t){vec3 a=vec3(0.980,0.788,0.835);vec3 b=vec3(0.902,0.447,0.553);vec3 c=vec3(0.929,0.675,0.663);vec3 d=vec3(0.961,0.820,0.780);float p=mod(t,1.0)*3.0;if(p<1.0)return mix(a,b,p);if(p<2.0)return mix(b,c,p-1.0);return mix(c,d,p-2.0);}
vec3 bluePalette(float t){vec3 a=vec3(0.808,0.878,0.969);vec3 b=vec3(0.620,0.729,0.902);vec3 c=vec3(0.455,0.592,0.831);vec3 d=vec3(0.749,0.827,0.941);float p=mod(t,1.0)*3.0;if(p<1.0)return mix(a,b,p);if(p<2.0)return mix(b,c,p-1.0);return mix(c,d,p-2.0);}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float smoothNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*f*(f*(f*6.0-15.0)+10.0);float a=hash(i);float b=hash(i+vec2(1.0,0.0));float c=hash(i+vec2(0.0,1.0));float d=hash(i+vec2(1.0,1.0));return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
float fbm(vec2 p){float v=0.0;float amp=0.6;float freq=0.8;for(int i=0;i<5;i++){v+=amp*smoothNoise(p*freq);amp*=0.5;freq*=1.7;}return v*0.8+0.1;}
float dither(vec2 uv,float t){return fract(sin(dot(uv*512.0,vec2(12.9898,78.233))+t)*43758.5453);}
void main(){
vec2 uv=gl_FragCoord.xy/u_resolution;
vec2 p=uv*2.0-1.0;
float aspect=u_resolution.x/u_resolution.y;
p.x*=aspect;
float t=u_time*0.2;
vec2 flow1=vec2(fbm(p*0.6+vec2(t*0.18,0.0)),fbm(p*0.6+vec2(0.0,t*0.15)))*2.0-1.0;
vec2 warp1=p+flow1*1.0;
vec2 flow2=vec2(fbm(warp1*1.3+vec2(t*0.10,t*0.08)),fbm(warp1*1.3+vec2(t*0.08,t*0.12)+3.7))*2.0-1.0;
vec2 warped=warp1+flow2*0.8;
vec2 flow3=vec2(fbm(warped*2.0+vec2(t*0.12,-t*0.10)+1.2),fbm(warped*2.0+vec2(-t*0.10,t*0.15)+8.4))*2.0-1.0;
vec2 finalUV=warped+flow3*0.5;
float mixVal=0.0;
float n1=fbm(finalUV*0.5+t*0.02);
float n2=fbm(finalUV*0.8-t*0.035+2.0);
float n3=fbm(finalUV*1.3+t*0.04+4.5);
float n4=fbm(finalUV*2.0-t*0.03+7.1);
float n5=fbm(finalUV*3.0+t*0.035+10.2);
mixVal=n1*0.25+n2*0.25+n3*0.20+n4*0.16+n5*0.14;
mixVal=clamp(mixVal*1.3-0.15,0.0,1.0);
float wave=sin(t*0.10+finalUV.x*0.5+finalUV.y*0.25)*0.18;
float colorPos=mixVal*4.0+wave+finalUV.x*0.03;
colorPos=mod(colorPos,4.0)/4.0;
vec3 purple=purplePalette(colorPos*4.0+t*0.015);
vec3 pink=pinkPalette(colorPos*4.0+t*0.015);
vec3 blue=bluePalette(colorPos*4.0+t*0.015);
vec3 color;
if(u_state<1.0)color=mix(purple,pink,u_state);
else color=mix(pink,blue,u_state-1.0);
color+=(dither(gl_FragCoord.xy,t)*2.0-1.0)/255.0;
float vignette=1.0-length(p*0.55)*0.3;
color*=mix(vignette,1.0,0.3);
vec3 auraP1=vec3(0.85,0.72,0.92);vec3 auraP2=vec3(0.75,0.60,0.85);vec3 auraP3=vec3(0.65,0.50,0.78);
vec3 auraK1=vec3(0.98,0.65,0.78);vec3 auraK2=vec3(0.90,0.45,0.60);vec3 auraK3=vec3(0.80,0.35,0.55);
vec3 auraB1=vec3(0.65,0.78,0.95);vec3 auraB2=vec3(0.50,0.65,0.88);vec3 auraB3=vec3(0.38,0.52,0.78);
float s=u_state;
vec3 a1=s<1.0?mix(auraP1,auraK1,s):mix(auraK1,auraB1,s-1.0);
vec3 a2=s<1.0?mix(auraP2,auraK2,s):mix(auraK2,auraB2,s-1.0);
vec3 a3=s<1.0?mix(auraP3,auraK3,s):mix(auraK3,auraB3,s-1.0);
float aura1=exp(-length(p*0.65-vec2(0.08,0.04))*1.8)*0.40;
color+=a1*aura1;
float aura2=exp(-length(p*0.45+vec2(0.18,-0.08))*1.6)*0.28;
color+=a2*aura2;
float aura3=exp(-length(p*0.85-vec2(-0.12,0.12))*2.0)*0.18;
color+=a3*aura3;
float edgeFade=1.0-abs(p.x*p.y)*0.10;
color=mix(color,color*0.92,1.0-edgeFade);
gl_FragColor=vec4(color,1.0);
}`;

    function compileShader(source: string, type: number) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      u_resolution: gl.getUniformLocation(program, "u_resolution"),
      u_time: gl.getUniformLocation(program, "u_time"),
      u_state: gl.getUniformLocation(program, "u_state"),
    };

    function advance() {
      if (!settledRef.current) return;
      settledRef.current = false;
      targetRef.current = (targetRef.current + 1) % 3;
    }

    function retreat() {
      if (!settledRef.current) return;
      if (targetRef.current > 0) {
        settledRef.current = false;
        targetRef.current -= 1;
      }
    }

    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerDown = false;

    const onPointerDown = (e: PointerEvent) => {
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      pointerDown = true;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!pointerDown) return;
      pointerDown = false;
      const dy = e.clientY - pointerStartY;
      if (dy > 40) advance();
      else if (dy < -40) retreat();
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!settledRef.current) return;
      if (Math.abs(e.deltaY) < 20 && Math.abs(e.deltaX) < 20) return;
      if (e.deltaY > 20) advance();
      else if (e.deltaY < -20) retreat();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!settledRef.current) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        advance();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        retreat();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("keydown", onKeyDown);

    let startTime = performance.now();

    function render() {
      const elapsed = (performance.now() - startTime) / 1000;
      const diff = targetRef.current - stateRef.current;
      if (Math.abs(diff) < 0.01) {
        stateRef.current = targetRef.current;
        settledRef.current = true;
      } else {
        stateRef.current += diff * 0.15;
      }

      const snap = Math.round(stateRef.current);
      if (snap !== lastSnapRef.current) {
        lastSnapRef.current = snap;
        if (titleRef.current) titleRef.current.innerHTML = TEXT_SETS[snap].title;
        if (subRef.current) subRef.current.textContent = TEXT_SETS[snap].sub;
      }

      gl.useProgram(program);
      gl.uniform2f(uniforms.u_resolution, canvas!.width, canvas!.height);
      gl.uniform1f(uniforms.u_time, elapsed);
      gl.uniform1f(uniforms.u_state, stateRef.current);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }

    resize();
    render();

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("wheel", onWheel);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "#0a0810",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
            pointerEvents: "none",
            zIndex: 1,
            background: "#0a0810",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 6,
            pointerEvents: "none",
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.06 0"/></filter><rect width="100%" height="100%" filter="url(%23g)" opacity="0.12"/></svg>')`,
            backgroundSize: "200px 200px",
            opacity: 0.15,
            mixBlendMode: "soft-light" as any,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            pointerEvents: "none",
            background: "radial-gradient(ellipse at center, transparent 60%, #0a0810 100%)",
            opacity: 0.4,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            height: "100%",
            padding: "3.5rem 4.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "#1a1418",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              textAlign: "left",
            }}
          >
            <h1
              ref={titleRef}
              style={{
                fontSize: "clamp(3.5rem, 10vw, 7rem)",
                fontWeight: 900,
                letterSpacing: "-0.045em",
                lineHeight: 0.88,
                fontFamily: "'Inter', 'Helvetica Neue', 'GT America', sans-serif",
                color: "#161014",
                textShadow: "0 4px 30px rgba(0,0,0,0.02)",
                background: "rgba(255,245,240,0.04)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
                padding: "0.2rem 1rem 0.2rem 0",
                borderRadius: "16px",
                display: "inline-block",
              }}
              dangerouslySetInnerHTML={{ __html: TEXT_SETS[0].title }}
            />
            <div
              ref={subRef}
              style={{
                marginTop: "0.5rem",
                fontSize: "clamp(0.85rem, 1.3vw, 1.25rem)",
                fontWeight: 400,
                letterSpacing: "-0.01em",
                color: "#1f181c",
                maxWidth: "48%",
                lineHeight: 1.5,
                opacity: 0.85,
                background: "rgba(255,245,240,0.04)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
                padding: "0.15rem 1rem",
                borderRadius: "40px",
              }}
            >
              {TEXT_SETS[0].sub}
            </div>
          </div>

          <div style={{ marginTop: "auto", alignSelf: "flex-end" }}>
            <div
              onClick={() => { window.location.href = "/about#explore"; }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") { window.location.href = "/about#explore"; } }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(255,245,240,0.12)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "2px solid #1a1418",
                padding: "0.9rem 2.2rem",
                borderRadius: "60px",
                fontWeight: 600,
                fontSize: "1rem",
                letterSpacing: "0.02em",
                color: "#1a1418",
                boxShadow: "0 8px 32px -8px rgba(0,0,0,0.12)",
                cursor: "pointer",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#581a8a";
                (e.currentTarget as HTMLElement).style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#1a1418";
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              explore videos
            </div>
          </div>
        </div>

        <style>{heroStyles}</style>
      </div>

    </>
  );
}
