import { useEffect, useRef, type CSSProperties } from 'react';

export interface SmoothDarkThemeBackgroundProps {
  className?: string;
  includeAurora?: boolean;
  includeParticles?: boolean;
  includeSmoke?: boolean;
  includeRadialGlow?: boolean;
}

interface DarkSmokeBackgroundProps {
  speed?: number;
  intensity?: number;
  grainStrength?: number;
  vignette?: number;
  color?: [number, number, number];
  className?: string;
  mouseRadius?: number;
  mouseBrightness?: number;
  mouseStirStrength?: number;
  mouseSwirlStrength?: number;
  mouseSmoothing?: number;
  mouseDecay?: number;
  renderScale?: number;
}

interface DarkParticleBackgroundProps {
  className?: string;
}

export const DARK_BACKGROUND_ROOT_CLASS = 'relative min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans antialiased overflow-x-clip';
export const DARK_BACKGROUND_BASE_CLASS = 'fixed inset-0 bg-dark-950 -z-20 pointer-events-none transition-colors duration-300';
export const DARK_STACK_SECTION_BACKGROUND_CLASS = 'relative w-full min-h-[100svh] bg-[#030303] border-t-0 shadow-none';
export const DARK_STICKY_SECTION_BACKGROUND_CLASS = 'sticky top-0 h-[100svh] w-full overflow-hidden bg-[#030303] border-t-0 shadow-none';
export const DARK_PARTICLE_CANVAS_CLASS = 'fixed inset-0 pointer-events-none z-[-1]';
export const DARK_RADIAL_SOFT_CENTER_CLASS = 'absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-screen bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.02)_0%,_transparent_60%)] pointer-events-none -z-10';

export const DARK_HERO_READABILITY_OVERLAY_STYLE: CSSProperties = {
  background: 'radial-gradient(ellipse 85% 65% at 50% 45%, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.45) 100%)',
};

const DARK_VERT = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const DARK_FRAG = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_speed;
uniform float u_intensity;
uniform float u_grainStrength;
uniform float u_vignette;
uniform vec3 u_color;
uniform vec2 u_mouse;
uniform float u_mouseInfluence;
uniform float u_mouseRadius;
uniform float u_mouseBrightness;
uniform float u_mouseStir;
uniform vec2 u_mouseVel;
uniform float u_mouseSwirl;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  float t = u_time * u_speed;

  vec2 mouse = u_mouse;
  mouse.x *= u_resolution.x / u_resolution.y;
  vec2 toUv = uv - mouse;
  float md = length(toUv);

  float sigma = max(u_mouseRadius * 0.5, 0.02);
  float infl = u_mouseInfluence * exp(-(md * md) / (2.0 * sigma * sigma));

  vec2 tang = vec2(-toUv.y, toUv.x);
  vec2 vel = u_mouseVel;
  vel.x *= u_resolution.x / u_resolution.y;
  vec2 stir = (tang * u_mouseSwirl + toUv * 0.2 + vel * 1.5) * (u_mouseStir * infl);
  vec2 suv = uv + stir;

  float q1 = fbm(suv * 2.0 + t);
  float q2 = fbm(suv * 2.0 + vec2(5.2, 1.3) + t * 0.8);

  float r1 = fbm(suv * 2.0 + 3.0 * vec2(q1, q2) + vec2(1.7, 9.2));
  float r2 = fbm(suv * 2.0 + 3.0 * vec2(q1, q2) + vec2(8.3, 2.8));

  float f = fbm(suv * 2.0 + 3.0 * vec2(r1, r2));
  float smoke = f * f * 1.5;
  smoke *= u_intensity;
  smoke *= (1.0 + u_mouseBrightness * infl);

  vec3 color = u_color * smoke;

  float grain = (hash(gl_FragCoord.xy + u_time * 100.0) - 0.5) * u_grainStrength;
  color += grain;

  vec2 vuv = gl_FragCoord.xy / u_resolution.xy;
  float vig = 1.0 - dot(vuv - 0.5, vuv - 0.5) * u_vignette;
  color *= clamp(vig, 0.0, 1.0);

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

const DARK_BACKGROUND_CSS = `
.smooth-dark-theme-background {
  position: fixed;
  inset: 0;
  z-index: -20;
  width: 100%;
  min-height: 100svh;
  color-scheme: dark;
  background-color: #000000;
  isolation: isolate;
  overflow: hidden;
  pointer-events: none;
}

.smooth-dark-theme-background__base {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-color: #000000;
}

.smooth-dark-theme-background__aurora {
  position: absolute;
  inset: -20% -10%;
  z-index: 1;
  pointer-events: none;
  filter: blur(55px) saturate(120%);
  opacity: 0.8;
  background:
    radial-gradient(42% 52% at 18% 22%, rgba(255, 255, 255, 0.16), transparent 62%),
    radial-gradient(38% 48% at 82% 18%, rgba(180, 190, 210, 0.16), transparent 62%),
    radial-gradient(48% 58% at 65% 82%, rgba(120, 130, 150, 0.14), transparent 62%),
    radial-gradient(44% 52% at 30% 78%, rgba(200, 205, 215, 0.14), transparent 62%);
  background-size: 200% 200%, 200% 200%, 200% 200%, 200% 200%;
  animation: smooth-dark-aurora-drift 24s ease-in-out infinite;
}

.smooth-dark-theme-background__particles {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

.smooth-dark-theme-background__radial-soft-center {
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  max-width: 80rem;
  height: 100vh;
  transform: translateX(-50%);
  z-index: 4;
  pointer-events: none;
  background: radial-gradient(ellipse at top, rgba(255, 255, 255, 0.02) 0%, transparent 60%);
}

.smooth-dark-theme-background__hero-readability-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 85% 65% at 50% 45%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.45) 100%);
}

.smooth-dark-theme-background__section-surface {
  background-color: #030303;
}

.smooth-dark-theme-background__dot-grid {
  background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1.5px, transparent 1.5px);
  background-size: 24px 24px;
}

.smooth-dark-theme-background__line-grid {
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
}

@keyframes smooth-dark-aurora-drift {
  0%, 100% {
    background-position: 0% 50%, 100% 0%, 50% 100%, 0% 100%;
  }

  50% {
    background-position: 100% 50%, 0% 100%, 50% 0%, 100% 0%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .smooth-dark-theme-background__aurora {
    animation: none;
  }
}
`;

function SmoothDarkBackgroundStyles() {
  return <style>{DARK_BACKGROUND_CSS}</style>;
}

export function DarkSmokeBackground({
  speed = 0.08,
  intensity = 0.5,
  grainStrength = 0.04,
  vignette = 2.5,
  color = [0.55, 0.55, 0.55],
  className = '',
  mouseRadius = 0.3,
  mouseBrightness = 0.22,
  mouseStirStrength = 0.5,
  mouseSwirlStrength = 1.6,
  mouseSmoothing = 0.12,
  mouseDecay = 0.96,
  renderScale = 0.7,
}: DarkSmokeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return;

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const finePointer = window.matchMedia?.('(pointer: fine)').matches ?? false;
    const mouseEnabled = finePointer && !reducedMotion;

    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    const buf = gl.createBuffer();
    if (!vs || !fs || !program || !buf) return;

    gl.shaderSource(vs, DARK_VERT);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) return;

    gl.shaderSource(fs, DARK_FRAG);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const pos = gl.getAttribLocation(program, 'position');
    if (pos >= 0) {
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    }

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uSpeed = gl.getUniformLocation(program, 'u_speed');
    const uIntensity = gl.getUniformLocation(program, 'u_intensity');
    const uGrainStrength = gl.getUniformLocation(program, 'u_grainStrength');
    const uVignette = gl.getUniformLocation(program, 'u_vignette');
    const uColor = gl.getUniformLocation(program, 'u_color');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uMouseInfluence = gl.getUniformLocation(program, 'u_mouseInfluence');
    const uMouseRadius = gl.getUniformLocation(program, 'u_mouseRadius');
    const uMouseBrightness = gl.getUniformLocation(program, 'u_mouseBrightness');
    const uMouseStir = gl.getUniformLocation(program, 'u_mouseStir');
    const uMouseVel = gl.getUniformLocation(program, 'u_mouseVel');
    const uMouseSwirl = gl.getUniformLocation(program, 'u_mouseSwirl');

    let animId = 0;
    let isVisible = true;
    let isTabActive = true;
    const startTime = performance.now();
    const mouse = { tx: 0.5, ty: 0.5, sx: 0.5, sy: 0.5, vx: 0, vy: 0, influence: 0 };
    const [colorR, colorG, colorB] = color;

    const setUniforms = () => {
      gl.useProgram(program);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uSpeed, speed);
      gl.uniform1f(uIntensity, intensity);
      gl.uniform1f(uGrainStrength, grainStrength);
      gl.uniform1f(uVignette, vignette);
      gl.uniform3f(uColor, colorR, colorG, colorB);
      gl.uniform1f(uMouseRadius, mouseRadius);
      gl.uniform1f(uMouseBrightness, mouseBrightness);
      gl.uniform1f(uMouseStir, mouseStirStrength);
      gl.uniform1f(uMouseSwirl, mouseSwirlStrength);
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * renderScale));
      canvas.height = Math.max(1, Math.round(rect.height * renderScale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      setUniforms();
    };

    const render = (time: number) => {
      if (!isVisible || !isTabActive) {
        animId = requestAnimationFrame(render);
        return;
      }

      const elapsed = (time - startTime) * 0.001;
      gl.useProgram(program);
      gl.uniform1f(uTime, elapsed);

      const px = mouse.sx;
      const py = mouse.sy;
      mouse.sx += (mouse.tx - mouse.sx) * mouseSmoothing;
      mouse.sy += (mouse.ty - mouse.sy) * mouseSmoothing;
      mouse.vx += (mouse.sx - px - mouse.vx) * 0.25;
      mouse.vy += (mouse.sy - py - mouse.vy) * 0.25;
      mouse.influence *= mouseDecay;

      gl.uniform2f(uMouse, mouse.sx, mouse.sy);
      gl.uniform2f(uMouseVel, mouse.vx, mouse.vy);
      gl.uniform1f(uMouseInfluence, mouse.influence);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!reducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      mouse.tx = (event.clientX - rect.left) / rect.width;
      mouse.ty = 1 - (event.clientY - rect.top) / rect.height;
      mouse.influence = Math.min(1, mouse.influence + 0.2);
    };

    if (mouseEnabled) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    resize();

    if (!reducedMotion) {
      animId = requestAnimationFrame(render);
    } else {
      render(startTime);
    }

    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibilityChange = () => {
      isTabActive = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    let resizeTimer: number | undefined;
    const ro = new ResizeObserver(() => {
      if (resizeTimer !== undefined) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 100);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      io.disconnect();
      ro.disconnect();
      if (resizeTimer !== undefined) window.clearTimeout(resizeTimer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (mouseEnabled) window.removeEventListener('pointermove', onPointerMove);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
      canvas.remove();
    };
  }, [speed, intensity, grainStrength, vignette, color, mouseRadius, mouseBrightness, mouseStirStrength, mouseSwirlStrength, mouseSmoothing, mouseDecay, renderScale]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      className={className}
      aria-hidden="true"
    />
  );
}

export function DarkParticleBackground({ className = DARK_PARTICLE_CANVAS_CLASS }: DarkParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }> = [];

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180,
    };

    const particleCount = Math.min(100, Math.floor((width * height) / 14000));
    for (let i = 0; i < particleCount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.4 + 0.2;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.45 + 0.2,
      });
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const scrollY = window.scrollY;
      const parallaxOffsetY = scrollY * 0.15;
      const rgb = '255, 255, 255';

      for (let i = 0; i < particles.length; i += 1) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) {
          p1.x = 0;
          p1.vx = Math.abs(p1.vx);
        } else if (p1.x > width) {
          p1.x = width;
          p1.vx = -Math.abs(p1.vx);
        }

        if (p1.y < 0) {
          p1.y = 0;
          p1.vy = Math.abs(p1.vy);
        } else if (p1.y > height) {
          p1.y = height;
          p1.vy = -Math.abs(p1.vy);
        }

        let renderY = (p1.y - parallaxOffsetY) % height;
        if (renderY < 0) renderY += height;

        ctx.beginPath();
        ctx.arc(p1.x, renderY, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${p1.alpha})`;
        ctx.fill();

        if (mouse.x > 0 && mouse.y > 0) {
          const dx = mouse.x - p1.x;
          const dy = mouse.y - renderY;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            ctx.beginPath();
            ctx.moveTo(p1.x, renderY);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(${rgb}, ${0.12 * force})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        for (let j = i + 1; j < particles.length; j += 1) {
          const p2 = particles[j];
          let p2RenderY = (p2.y - parallaxOffsetY) % height;
          if (p2RenderY < 0) p2RenderY += height;

          const dx = p1.x - p2.x;
          const dy = renderY - p2RenderY;
          const dist = Math.hypot(dx, dy);

          if (dist < 120) {
            const alpha = ((120 - dist) / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, renderY);
            ctx.lineTo(p2.x, p2RenderY);
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas id="particles-canvas-dark" ref={canvasRef} className={className} aria-hidden="true" />;
}

export function DarkAuroraField() {
  return <div className="smooth-dark-theme-background__aurora" aria-hidden="true" />;
}

export function DarkHeroReadabilityOverlay() {
  return <div className="smooth-dark-theme-background__hero-readability-overlay" aria-hidden="true" />;
}

export default function SmoothDarkThemeBackground({
  className = '',
  includeAurora = true,
  includeParticles = false,
  includeSmoke = true,
  includeRadialGlow = true,
}: SmoothDarkThemeBackgroundProps) {
  return (
    <div className={`smooth-dark-theme-background fixed inset-0 -z-20 pointer-events-none overflow-hidden ${className}`.trim()} aria-hidden="true">
      <SmoothDarkBackgroundStyles />
      <div className="smooth-dark-theme-background__base absolute inset-0" />
      {includeAurora && <DarkAuroraField />}
      {includeSmoke && <DarkSmokeBackground />}
      {includeParticles && <DarkParticleBackground className="smooth-dark-theme-background__particles" />}
      {includeRadialGlow && <div className="smooth-dark-theme-background__radial-soft-center" />}
    </div>
  );
}
