import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const RADIUS = 7;
const SEGMENTS = 400;
const RADIAL = 24;
const STARS_FAR = 4000;
const STARS_GALAXY = 8000;
const DUST_MOTES = 600;
const GALAXY_RADIUS = 250;
const GALAXY_ARMS = 4;
const GALAXY_SPIN = 1.5;
const RING_COUNT = 40;
const SPEED_MIN = 0.00008;
const SPEED_MAX = 0.00038;
const ACCEL = 0.000002;
const LOOKAHEAD = 0.008;

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

export class WormholeEngine {
    constructor(container) {
        this.container = container;
        this.ready = false;
        this.active = false;
        this.t = 0;
        this.speed = SPEED_MIN;
        this.mx = 0;
        this.my = 0;
        this.raf = null;
        this.onFrame = null;
    }

    init() {
        if (this.ready) return;

        const w = window.innerWidth;
        const h = window.innerHeight;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.0008);

        this.cam = new THREE.PerspectiveCamera(78, w / h, 0.1, 1200);

        this.gl = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.gl.setSize(w, h);
        this.gl.setPixelRatio(Math.min(devicePixelRatio, 2));
        this.gl.toneMapping = THREE.ACESFilmicToneMapping;
        this.gl.toneMappingExposure = 1.1;
        this.gl.domElement.style.cssText =
            'position:absolute;inset:0;width:100%!important;height:100%!important';
        this.container.appendChild(this.gl.domElement);

        this.curve = buildCurve();
        this.buildTunnel();
        this.buildParticles();
        this.buildRings();

        this.composer = new EffectComposer(this.gl);
        this.composer.addPass(new RenderPass(this.scene, this.cam));
        this.bloom = new UnrealBloomPass(
            new THREE.Vector2(w, h), 1.2, 0.4, 0.15
        );
        this.composer.addPass(this.bloom);

        this._resize = () => this.resize();
        window.addEventListener('resize', this._resize);

        this.ready = true;
    }

    buildTunnel() {
        this.tunnelMats = [];

        const outerMat = new THREE.MeshBasicMaterial({
            color: 0x00ff9d, wireframe: true,
            transparent: true, opacity: 0.35, side: THREE.DoubleSide
        });
        const outerGeo = new THREE.TubeGeometry(this.curve, SEGMENTS, RADIUS, RADIAL, true);
        this.scene.add(new THREE.Mesh(outerGeo, outerMat));
        this.tunnelMats.push({ mat: outerMat, baseOpacity: 0.35 });

        const midMat = new THREE.MeshBasicMaterial({
            color: 0x00ff9d, transparent: true, opacity: 0.1, side: THREE.BackSide
        });
        const midGeo = new THREE.TubeGeometry(this.curve, SEGMENTS, RADIUS * 0.92, RADIAL, true);
        this.scene.add(new THREE.Mesh(midGeo, midMat));
        this.tunnelMats.push({ mat: midMat, baseOpacity: 0.1 });

        const innerMat = new THREE.MeshBasicMaterial({
            color: 0x00e5ff, transparent: true, opacity: 0.06, side: THREE.BackSide
        });
        const innerGeo = new THREE.TubeGeometry(this.curve, SEGMENTS, RADIUS * 0.84, RADIAL, true);
        this.scene.add(new THREE.Mesh(innerGeo, innerMat));
        this.tunnelMats.push({ mat: innerMat, baseOpacity: 0.06 });
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
        return new THREE.CanvasTexture(c);
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
        const geo = new THREE.TorusGeometry(RADIUS * 1.08, 0.05, 8, 64);

        for (let i = 0; i < RING_COUNT; i++) {
            const t = i / RING_COUNT;
            const pt = this.curve.getPoint(t);
            const tang = this.curve.getTangent(t);

            const mat = new THREE.MeshBasicMaterial({
                color: 0x00ff9d, transparent: true,
                opacity: 0.08, blending: THREE.AdditiveBlending,
            });

            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.copy(pt);
            mesh.lookAt(pt.clone().add(tang));
            mesh.userData = { t, mat };
            this.scene.add(mesh);
            this.rings.push(mesh);
        }
    }

    resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.cam.aspect = w / h;
        this.cam.updateProjectionMatrix();
        this.gl.setSize(w, h);
        this.composer.setSize(w, h);
    }

    activate() {
        if (!this.ready) this.init();
        this.active = true;
        this.frame = 0;
        const skipFrames = 120;
        this.speed = SPEED_MIN + ACCEL * skipFrames;
        this.t = 0;
        for (let i = 0; i < skipFrames; i++) {
            this.t += SPEED_MIN + ACCEL * i;
        }
        this.t = this.t % 1;
        for (const t of this.tunnelMats) t.mat.opacity = t.baseOpacity;
        this.gl.domElement.style.opacity = '1';
        if (this.raf) cancelAnimationFrame(this.raf);
        this.tick();
    }

    deactivate() {
        this.active = false;
        if (this.raf) {
            cancelAnimationFrame(this.raf);
            this.raf = null;
        }
    }

    tick() {
        if (!this.active) return;

        this.frame++;
        this.speed = Math.min(SPEED_MAX, this.speed + ACCEL);
        this.t = (this.t + this.speed) % 1;

        const fadeStart = 600;
        const fadeDur = 180;
        const tunnelFade = this.frame < fadeStart ? 1
            : this.frame > fadeStart + fadeDur ? 0
            : 1 - (this.frame - fadeStart) / fadeDur;
        for (const t of this.tunnelMats) t.mat.opacity = t.baseOpacity * tunnelFade;

        const pos = this.curve.getPoint(this.t);
        const look = this.curve.getPoint((this.t + LOOKAHEAD) % 1);
        this.cam.position.copy(pos);

        const tang = this.curve.getTangent(this.t);
        const up = new THREE.Vector3(0, 1, 0);
        if (Math.abs(tang.dot(up)) > 0.99) up.set(1, 0, 0);
        const right = new THREE.Vector3().crossVectors(tang, up).normalize();
        const realUp = new THREE.Vector3().crossVectors(right, tang).normalize();
        look.addScaledVector(right, this.mx * 1.2);
        look.addScaledVector(realUp, this.my * 1.2);
        this.cam.lookAt(look);

        let maxRingGlow = 0;
        if (tunnelFade <= 0) {
            for (let i = 0; i < this.rings.length; i++) this.rings[i].visible = false;
        } else {
            for (let i = 0; i < this.rings.length; i++) {
                const ring = this.rings[i];
                const d = Math.abs(ring.userData.t - this.t);
                const wd = Math.min(d, 1 - d);
                const prox = Math.max(0, 1 - wd * 18);
                const g = prox * prox;
                if (g > maxRingGlow) maxRingGlow = g;
                ring.visible = g > 0.001;
                ring.userData.mat.opacity = g * 0.75 * tunnelFade;
                ring.scale.setScalar(1 + g * 0.12);
                ring.userData.mat.color.setRGB(g, 1.0, 0.62 + g * 0.38);
            }
        }

        const norm = (this.speed - SPEED_MIN) / (SPEED_MAX - SPEED_MIN);
        this.bloom.strength = 1.0 + norm * 1.6;

        const galaxyReveal = (1 - tunnelFade) * (1 - maxRingGlow);
        this.galaxy.material.opacity = galaxyReveal * 0.85;
        this.farStars.material.opacity = tunnelFade < 1 ? 0.1 + galaxyReveal * 0.8 : 0.1;
        this.dust.material.opacity = galaxyReveal * 0.2;

        this.galaxy.rotation.y += 0.00012;
        this.dust.rotation.y -= 0.00008;

        this.composer.render();
        if (this.onFrame) this.onFrame(norm);
        this.raf = requestAnimationFrame(() => this.tick());
    }

    setMouse(x, y) { this.mx = x; this.my = y; }

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
