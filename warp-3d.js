import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

/* Tuned for smooth 60fps: lower mesh cost, delta-time motion, lerped camera */
const RADIUS = 7;
const SEGMENTS = 160;
const RADIAL = 16;
const STARS_FAR = 2200;
const STARS_GALAXY = 4200;
const DUST_MOTES = 300;
const GALAXY_RADIUS = 250;
const GALAXY_ARMS = 4;
const GALAXY_SPIN = 1.5;
const RING_COUNT = 28;

/* Speeds in curve-units per SECOND (not per frame) — fast, immediate warp */
const SPEED_MIN = 0.050;
const SPEED_MAX = 0.170;
const ACCEL = 0.095;       // near-instant spool toward SPEED_MAX (1/s)
const LOOKAHEAD = 6;
const CAM_SMOOTH = 20;     // tight follow = sleek, fast read
const MOUSE_SMOOTH = 11;
const MAX_DT = 1 / 30;     // clamp spiral after tab-switch

function buildCurve() {
    const pts = [];
    for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        pts.push(new THREE.Vector3(
            Math.cos(a) * 50 + Math.sin(a * 2) * 12,
            Math.sin(a * 2) * 18 + Math.cos(a * 3) * 5,
            Math.sin(a) * 50 + Math.cos(a * 2) * 12
        ));
    }
    return new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5);
}

function damp(current, target, lambda, dt) {
    return THREE.MathUtils.damp(current, target, lambda, dt);
}

export class WormholeEngine {
    constructor(container) {
        this.container = container;
        this.ready = false;
        this.active = false;
        this.t = 0;
        this.speed = SPEED_MIN;
        this.mx = 0;
        this.my = 0;
        this.smx = 0;
        this.smy = 0;
        this.raf = null;
        this.onFrame = null;
        this.lastTs = 0;
        this.elapsed = 0;

        /* Hot-path reusable vectors (no per-frame alloc) */
        this._pos = new THREE.Vector3();
        this._tang = new THREE.Vector3();
        this._up = new THREE.Vector3(0, 1, 0);
        this._right = new THREE.Vector3();
        this._realUp = new THREE.Vector3();
        this._look = new THREE.Vector3();
        this._camPos = new THREE.Vector3();
        this._camLook = new THREE.Vector3();
        this._camReady = false;
    }

    init() {
        if (this.ready) return;

        const w = window.innerWidth;
        const h = window.innerHeight;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x020a08);
        this.scene.fog = new THREE.FogExp2(0x020a08, 0.012);

        this.cam = new THREE.PerspectiveCamera(78, w / h, 0.1, 1200);

        this.gl = new THREE.WebGLRenderer({
            antialias: false, /* AA + bloom is expensive; bloom softens edges */
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
        });
        this.gl.setSize(w, h, false);
        this.gl.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
        this.gl.toneMapping = THREE.ACESFilmicToneMapping;
        this.gl.toneMappingExposure = 1.05;
        this.gl.domElement.style.cssText =
            'position:absolute;inset:0;width:100%!important;height:100%!important';
        this.container.appendChild(this.gl.domElement);

        this.curve = buildCurve();
        this.buildTunnel();
        this.buildParticles();
        this.buildRings();

        this.composer = new EffectComposer(this.gl);
        this.composer.addPass(new RenderPass(this.scene, this.cam));
        /* Slightly softer bloom; half-res via smaller vector is handled by setSize */
        this.bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.55, 0.45, 0.55);
        this.composer.addPass(this.bloom);
        this.composer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));

        this._resize = () => this.resize();
        window.addEventListener('resize', this._resize, { passive: true });

        this.ready = true;
    }

    buildTunnel() {
        this.tunnelMats = [];

        const fillMat = new THREE.MeshBasicMaterial({
            color: 0x041510, side: THREE.BackSide,
            transparent: true, opacity: 0.4,
        });
        const fillGeo = new THREE.TubeGeometry(this.curve, SEGMENTS, RADIUS * 1.02, RADIAL, true);
        this.scene.add(new THREE.Mesh(fillGeo, fillMat));
        this.tunnelMats.push({ mat: fillMat, baseOpacity: 0.4 });

        const wireMat = new THREE.LineBasicMaterial({
            color: 0x2EF2A0,
            transparent: true, opacity: 0.6,
        });
        const wireGeo = new THREE.TubeGeometry(this.curve, SEGMENTS, RADIUS, RADIAL, true);
        const wireframeGeo = new THREE.WireframeGeometry(wireGeo);
        wireGeo.dispose();
        this.scene.add(new THREE.LineSegments(wireframeGeo, wireMat));
        this.tunnelMats.push({ mat: wireMat, baseOpacity: 0.6 });
    }

    gaussRand() {
        return Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(Math.PI * 2 * Math.random());
    }

    buildStarTexture() {
        const c = document.createElement('canvas');
        c.width = c.height = 32;
        const ctx = c.getContext('2d');
        const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.4, 'rgba(255,255,255,0.4)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 32, 32);
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
    }

    buildParticles() {
        const tex = this.buildStarTexture();
        this.buildDistantStars(tex);
        this.buildGalaxy(tex);
        this.buildDustMotes(tex);
    }

    buildDistantStars(tex) {
        const pos = new Float32Array(STARS_FAR * 3);
        const col = new Float32Array(STARS_FAR * 3);

        for (let i = 0; i < STARS_FAR; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 300 + Math.random() * 200;
            pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);

            const t = Math.random();
            col[i * 3]     = 0.7 + t * 0.3;
            col[i * 3 + 1] = 0.75 + t * 0.25;
            col[i * 3 + 2] = 1.0;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

        this.farStars = new THREE.Points(geo, new THREE.PointsMaterial({
            size: 0.6, map: tex, vertexColors: true, transparent: true,
            opacity: 0.9, blending: THREE.AdditiveBlending,
            depthWrite: false, sizeAttenuation: true,
        }));
        this.scene.add(this.farStars);
    }

    buildGalaxy(tex) {
        const pos = new Float32Array(STARS_GALAXY * 3);
        const col = new Float32Array(STARS_GALAXY * 3);
        const coreColor = new THREE.Color(0xffe8a0);
        const armColor = new THREE.Color(0x88bbff);
        const mintColor = new THREE.Color(0x00ff9d);
        const mixed = new THREE.Color();
        const bulgeCount = Math.floor(STARS_GALAXY * 0.12);

        for (let i = 0; i < STARS_GALAXY; i++) {
            let x, y, z;

            if (i < bulgeCount) {
                const rb = Math.pow(Math.random(), 2.0) * GALAXY_RADIUS * 0.1;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                x = rb * Math.sin(phi) * Math.cos(theta);
                y = rb * Math.sin(phi) * Math.sin(theta);
                z = rb * Math.cos(phi);
                mixed.copy(coreColor).lerp(new THREE.Color(0xffffff), 0.4);
            } else {
                const arm = Math.floor(Math.random() * GALAXY_ARMS);
                const r = 15 + Math.random() * (GALAXY_RADIUS - 15);
                const armAngle = (arm / GALAXY_ARMS) * Math.PI * 2;
                const spinAngle = r * GALAXY_SPIN / GALAXY_RADIUS;
                const spread = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.4 * r;
                const angSpread = this.gaussRand() * 0.12;
                const theta = armAngle + spinAngle + angSpread;
                x = Math.cos(theta) * (r + spread);
                z = Math.sin(theta) * (r + spread);
                y = this.gaussRand() * (3 + r * 0.015);

                const t = r / GALAXY_RADIUS;
                mixed.copy(coreColor).lerp(armColor, t * 0.7);
                if (Math.random() < 0.15) mixed.lerp(mintColor, 0.5);
            }

            pos[i * 3]     = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
            col[i * 3]     = mixed.r;
            col[i * 3 + 1] = mixed.g;
            col[i * 3 + 2] = mixed.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

        this.galaxy = new THREE.Points(geo, new THREE.PointsMaterial({
            size: 0.25, map: tex, vertexColors: true, transparent: true,
            opacity: 0.85, blending: THREE.AdditiveBlending,
            depthWrite: false, sizeAttenuation: true,
        }));
        this.galaxy.rotation.x = Math.PI * 0.18;
        this.scene.add(this.galaxy);
    }

    buildDustMotes(tex) {
        const pos = new Float32Array(DUST_MOTES * 3);
        const col = new Float32Array(DUST_MOTES * 3);

        for (let i = 0; i < DUST_MOTES; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = 12 + Math.random() * 50;
            pos[i * 3]     = Math.cos(angle) * r + (Math.random() - 0.5) * 40;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 40;

            const roll = Math.random();
            col[i * 3]     = roll < 0.5 ? 0.4 : 0.1;
            col[i * 3 + 1] = roll < 0.5 ? 0.8 : 0.5;
            col[i * 3 + 2] = roll < 0.5 ? 1.0 : 0.9;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

        this.dust = new THREE.Points(geo, new THREE.PointsMaterial({
            size: 1.2, map: tex, vertexColors: true, transparent: true,
            opacity: 0.15, blending: THREE.AdditiveBlending,
            depthWrite: false, sizeAttenuation: true,
        }));
        this.scene.add(this.dust);
    }

    buildRings() {
        this.rings = [];
        const geo = new THREE.TorusGeometry(RADIUS * 1.08, 0.14, 6, 48);
        const lookTmp = new THREE.Vector3();

        for (let i = 0; i < RING_COUNT; i++) {
            const t = i / RING_COUNT;
            const pt = this.curve.getPoint(t);
            const tang = this.curve.getTangent(t);

            const mat = new THREE.MeshBasicMaterial({
                color: 0x00ff9d, transparent: true,
                opacity: 0.5, blending: THREE.AdditiveBlending,
            });

            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.copy(pt);
            mesh.lookAt(lookTmp.copy(pt).add(tang));
            mesh.userData = { t, mat, glow: 0 };
            this.scene.add(mesh);
            this.rings.push(mesh);
        }
    }

    resize() {
        if (!this.ready) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.cam.aspect = w / h;
        this.cam.updateProjectionMatrix();
        const pr = Math.min(devicePixelRatio || 1, 1.5);
        this.gl.setPixelRatio(pr);
        this.gl.setSize(w, h, false);
        this.composer.setPixelRatio(pr);
        this.composer.setSize(w, h);
    }

    activate() {
        if (!this.ready) this.init();
        this.active = true;
        this.elapsed = 0;
        this.lastTs = 0;
        this._camReady = false;

        /* Seed already moving fast so the first frame reads as speed */
        this.speed = SPEED_MIN * 1.6;
        this.t = 0.02;
        for (const t of this.tunnelMats) t.mat.opacity = t.baseOpacity;
        this.gl.domElement.style.opacity = '1';

        if (this.raf) cancelAnimationFrame(this.raf);
        this.raf = requestAnimationFrame((ts) => this.tick(ts));
    }

    deactivate() {
        this.active = false;
        if (this.raf) {
            cancelAnimationFrame(this.raf);
            this.raf = null;
        }
        this.lastTs = 0;
    }

    tick(ts) {
        if (!this.active) return;

        if (!this.lastTs) this.lastTs = ts;
        let dt = (ts - this.lastTs) / 1000;
        this.lastTs = ts;
        if (dt > MAX_DT) dt = MAX_DT;
        if (dt < 0) dt = 0;
        this.elapsed += dt;

        /* Exponential accel toward max (frame-rate independent) */
        this.speed += (SPEED_MAX - this.speed) * (1 - Math.exp(-ACCEL * 4.5 * dt));
        this.t = (this.t + this.speed * dt) % 1;

        /* Smooth mouse parallax */
        this.smx = damp(this.smx, this.mx, MOUSE_SMOOTH, dt);
        this.smy = damp(this.smy, this.my, MOUSE_SMOOTH, dt);

        /* Punch into the starfield almost immediately */
        const fadeStart = 2.4;
        const fadeDur = 1.4;
        let tunnelFade = 1;
        if (this.elapsed > fadeStart + fadeDur) tunnelFade = 0;
        else if (this.elapsed > fadeStart) {
            const u = (this.elapsed - fadeStart) / fadeDur;
            /* smoothstep */
            tunnelFade = 1 - (u * u * (3 - 2 * u));
        }
        for (let i = 0; i < this.tunnelMats.length; i++) {
            const t = this.tunnelMats[i];
            t.mat.opacity = t.baseOpacity * tunnelFade;
        }

        /* Target camera from curve */
        this.curve.getPoint(this.t, this._pos);
        this.curve.getTangent(this.t, this._tang);

        this._up.set(0, 1, 0);
        if (Math.abs(this._tang.dot(this._up)) > 0.99) this._up.set(1, 0, 0);
        this._right.crossVectors(this._tang, this._up).normalize();
        this._realUp.crossVectors(this._right, this._tang).normalize();

        this._look.copy(this._pos).addScaledVector(this._tang, LOOKAHEAD);
        this._look.addScaledVector(this._right, this.smx * 0.22);
        this._look.addScaledVector(this._realUp, this.smy * 0.22);

        if (!this._camReady) {
            this._camPos.copy(this._pos);
            this._camLook.copy(this._look);
            this._camReady = true;
        } else {
            /* Exponential lerp: frame-rate independent follow */
            const a = 1 - Math.exp(-CAM_SMOOTH * dt);
            this._camPos.lerp(this._pos, a);
            this._camLook.lerp(this._look, a);
        }

        this.cam.position.copy(this._camPos);
        this.cam.up.copy(this._realUp);
        this.cam.lookAt(this._camLook);

        /* Rings - smooth glow with damping */
        let maxRingGlow = 0;
        if (tunnelFade <= 0.001) {
            for (let i = 0; i < this.rings.length; i++) {
                this.rings[i].visible = false;
                this.rings[i].userData.glow = 0;
            }
        } else {
            for (let i = 0; i < this.rings.length; i++) {
                const ring = this.rings[i];
                let d = Math.abs(ring.userData.t - this.t);
                if (d > 0.5) d = 1 - d;
                const prox = Math.max(0, 1 - d * 18);
                const targetG = prox * prox;
                ring.userData.glow = damp(ring.userData.glow, targetG, 18, dt);
                const g = ring.userData.glow;
                if (g > maxRingGlow) maxRingGlow = g;
                ring.visible = g > 0.004;
                if (ring.visible) {
                    ring.userData.mat.opacity = g * 0.75 * tunnelFade;
                    const s = 1 + g * 0.12;
                    ring.scale.set(s, s, s);
                    ring.userData.mat.color.setRGB(g, 1.0, 0.62 + g * 0.38);
                }
            }
        }

        const norm = (this.speed - SPEED_MIN) / (SPEED_MAX - SPEED_MIN);
        /* Bloom follows speed smoothly */
        const bloomTarget = 0.85 + norm * 1.35;
        this.bloom.strength += (bloomTarget - this.bloom.strength) * (1 - Math.exp(-8 * dt));

        const galaxyReveal = (1 - tunnelFade) * (1 - maxRingGlow);
        this.galaxy.material.opacity = 0.45 + galaxyReveal * 0.4;
        this.farStars.material.opacity = 0.55 + galaxyReveal * 0.35;
        this.dust.material.opacity = 0.12 + galaxyReveal * 0.18;

        this.galaxy.rotation.y += 0.007 * dt;
        this.dust.rotation.y -= 0.005 * dt;

        this.composer.render();
        if (this.onFrame) this.onFrame(norm);
        this.raf = requestAnimationFrame((t) => this.tick(t));
    }

    setMouse(x, y) {
        this.mx = x;
        this.my = y;
    }

    dispose() {
        this.active = false;
        if (this.raf) cancelAnimationFrame(this.raf);
        if (this._resize) window.removeEventListener('resize', this._resize);
        if (this.gl) {
            this.gl.dispose();
            this.gl.domElement.remove();
        }
        this.ready = false;
    }
}
