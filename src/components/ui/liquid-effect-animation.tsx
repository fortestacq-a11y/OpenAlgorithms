"use client"
import { useEffect, useRef } from "react"
import * as THREE from "three"

export function LiquidEffectAnimation({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const uniformsRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_mouse: { value: new THREE.Vector2() },
      u_color1: { value: new THREE.Color(0.06, 0.06, 0.06) },
      u_color2: { value: new THREE.Color(0.15, 0.15, 0.15) },
      u_color3: { value: new THREE.Color(0.25, 0.25, 0.25) },
    }
    uniformsRef.current = uniforms

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform vec3 u_color1;
        uniform vec3 u_color2;
        uniform vec3 u_color3;
        varying vec2 vUv;

        // Simplex 2D noise
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v){
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                   -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          st.x *= u_resolution.x / u_resolution.y;

          float time = u_time * 0.05;
          
          // Multi-layered liquid distortion
          float n1 = snoise(st * 1.5 + time);
          float n2 = snoise(st * 3.0 - time * 0.5);
          float n3 = snoise(st * 6.0 + time * 0.2);
          
          float finalNoise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
          
          // Use uniform colors
          vec3 c1 = u_color1;
          vec3 c2 = u_color2;
          vec3 c3 = u_color3;
          
          float mixVal = smoothstep(-0.6, 0.6, finalNoise);
          vec3 color = mix(c1, c2, mixVal);
          color = mix(color, c3, smoothstep(0.2, 0.8, finalNoise));
          
          // Mouse interaction ripple
          vec2 mouse = u_mouse / u_resolution;
          mouse.x *= u_resolution.x / u_resolution.y;
          float dist = distance(st, mouse);
          float mouseGlow = exp(-dist * 3.0) * 0.15;
          
          color += vec3(mouseGlow);
          
          // Film grain
          float grain = fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453);
          color += grain * 0.02;

          gl_FragColor = vec4(color, 1.0);
        }
      `
    })

    const plane = new THREE.Mesh(geometry, material)
    scene.add(plane)

    let animationId: number
    const animate = (time: number) => {
      uniforms.u_time.value = time * 0.001
      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }
    animate(0)

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight)
    }

    const handleMouseMove = (e: MouseEvent) => {
      uniforms.u_mouse.value.set(e.clientX, window.innerHeight - e.clientY)
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId)
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  // Update colors when theme changes
  useEffect(() => {
    if (uniformsRef.current) {
      if (theme === "light") {
        // Light mode colors (White/Gray/Light Gray)
        uniformsRef.current.u_color1.value.set(0.98, 0.98, 0.98) // #fafafa
        uniformsRef.current.u_color2.value.set(0.90, 0.90, 0.90) // #e5e5e5
        uniformsRef.current.u_color3.value.set(0.85, 0.85, 0.85) // #d9d9d9
      } else {
        // Dark mode colors (Original)
        uniformsRef.current.u_color1.value.set(0.06, 0.06, 0.06) // #0f0f0f
        uniformsRef.current.u_color2.value.set(0.15, 0.15, 0.15) // #262626
        uniformsRef.current.u_color3.value.set(0.25, 0.25, 0.25) // #404040
      }
    }
  }, [theme])

  return <div ref={containerRef} className="fixed inset-0 -z-10" />
}

declare global {
  interface Window {
    __liquidApp?: any
  }
}