// ============================================================
// Race3D — Three.js 3D 렌더러 (Phaser 2D를 대체)
//
// 서버는 한 줄도 바뀌지 않았다. 서버가 계산해 보내는 (x, y, heading) 를
// 3D 좌표 (x, 0, y) 로 옮겨 그릴 뿐이다. 물리·네트워크는 그대로다.
//
// 좌표 변환: 2D 월드의 (x, y) → 3D 의 (x, 높이, y). Y축이 위.
//   heading(rad) 은 3D 에서 rotation.y = -heading (모델이 +X 를 향하게 만들었을 때)
//
// 조작이 쉬워지는 이유: 추격 카메라가 항상 진행 방향을 보므로 코너가 미리 보인다.
// 탑다운에서는 화면 밖에 있던 정보다.
// ============================================================

import * as THREE from "three";
import { net, InputState } from "./net";
import { KartBody, stepKart, KART } from "./physics";
import { buildTrack, project, pointAt, TrackData } from "./track";

const COLORS = [0x4da3ff, 0xff9f43, 0x37d67a, 0xc77dff];
const UP = new THREE.Vector3(0, 1, 0);

export class Race3D {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();

  private track: TrackData | null = null;
  private trackBuilt = false;

  private karts: Record<string, THREE.Group> = {};
  private ghost: Record<string, { x: number; y: number; heading: number }> = {};
  private pickups: Record<string, THREE.Mesh> = {};
  private hazards: Record<string, THREE.Mesh> = {};

  private local: KartBody = {
    x: 0, y: 0, heading: 0, speed: 0, steerActual: 0, driftCharge: 0, drifting: false,
  };
  private localReady = false;

  private ctrl: InputState = { throttle: 0, steer: 0, drift: false };
  private keys: Record<string, boolean> = {};

  private camPos = new THREE.Vector3();
  private camLook = new THREE.Vector3();
  private sparks: THREE.Mesh[] = [];
  private sparkIdx = 0;
  private running = false;

  constructor(private container: HTMLElement) {}

  start() {
    if (this.running) return;
    this.running = true;
    this.initThree();
    this.bindInput();
    net.on("fx", (d: any) => this.onFx(d));
    if (net.track) this.buildWorld();
    else net.on("track", () => this.buildWorld());
    this.renderer.setAnimationLoop(() => this.frame());
  }

  // ---------- 초기화 ----------

  private initThree() {
    const w = this.container.clientWidth || 1280;
    const h = this.container.clientHeight || 720;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0d1526);
    // 안개는 성능보다 "멀리 있는 것이 흐려진다"는 깊이감 때문에 넣는다
    this.scene.fog = new THREE.Fog(0x0d1526, 1800, 5200);

    this.camera = new THREE.PerspectiveCamera(62, w / h, 5, 9000);
    this.camera.position.set(0, 200, 0);

    this.scene.add(new THREE.HemisphereLight(0x9fc0ff, 0x22331f, 1.15));
    const sun = new THREE.DirectionalLight(0xffffff, 1.25);
    sun.position.set(1200, 2200, 800);
    this.scene.add(sun);

    // 잔디 바닥
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(24000, 24000),
      new THREE.MeshLambertMaterial({ color: 0x1d3a26 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    this.scene.add(ground);

    // 스파크 풀 (매번 생성/파괴하면 GC가 튄다)
    const sparkGeo = new THREE.SphereGeometry(7, 6, 5);
    for (let i = 0; i < 72; i++) {
      const m = new THREE.Mesh(
        sparkGeo,
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
      );
      m.visible = false;
      this.scene.add(m);
      this.sparks.push(m);
    }

    addEventListener("resize", () => this.resize());
  }

  private resize() {
    const w = this.container.clientWidth || 1280;
    const h = this.container.clientHeight || 720;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  private bindInput() {
    addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
      if (e.code === "Space") { e.preventDefault(); net.useItem(); }
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
    });
    addEventListener("keyup", (e) => { this.keys[e.code] = false; });
    addEventListener("blur", () => { this.keys = {}; });
  }

  // ---------- 월드 구성 ----------

  private buildWorld() {
    if (!net.track || this.trackBuilt) return;
    this.trackBuilt = true;
    this.track = buildTrack(net.track.points, net.track.width);

    const pts = this.track.points;
    const halfW = this.track.width / 2;

    this.scene.add(this.ribbon(pts, -halfW, halfW, 0, 0x2c3d5f));           // 노면
    this.scene.add(this.ribbon(pts, -halfW - 20, -halfW, 3, 0xd94f5c));     // 왼쪽 커브
    this.scene.add(this.ribbon(pts, halfW, halfW + 20, 3, 0xd94f5c));       // 오른쪽 커브
    this.scene.add(this.ribbon(pts, -6, 6, 1, 0x546d9e));                   // 중앙선

    this.buildWalls(pts, halfW);
    this.buildStartLine(pts, halfW);
    this.buildPosts(halfW);
  }

  /** 중심선을 따라 좌우 오프셋으로 리본 메시를 만든다. */
  private ribbon(pts: number[][], from: number, to: number, y: number, color: number) {
    const n = pts.length;
    const pos: number[] = [];
    const idx: number[] = [];

    for (let i = 0; i < n; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % n];
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      const nx = -Math.sin(ang), ny = Math.cos(ang);
      pos.push(a[0] + nx * from, y, a[1] + ny * from);
      pos.push(a[0] + nx * to, y, a[1] + ny * to);
    }
    for (let i = 0; i < n; i++) {
      const i0 = i * 2, i1 = i * 2 + 1;
      const j0 = ((i + 1) % n) * 2, j1 = ((i + 1) % n) * 2 + 1;
      idx.push(i0, i1, j1, i0, j1, j0);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color, side: THREE.DoubleSide }));
  }

  /** 좌우 벽. 이제 코스 밖으로 나갈 수 없고, 닿으면 긁으며 미끄러진다. */
  private buildWalls(pts: number[][], halfW: number) {
    const n = pts.length;
    for (const side of [-1, 1]) {
      const pos: number[] = [];
      const idx: number[] = [];
      for (let i = 0; i < n; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % n];
        const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
        const nx = -Math.sin(ang) * halfW * side;
        const ny = Math.cos(ang) * halfW * side;
        pos.push(a[0] + nx, 0, a[1] + ny);
        pos.push(a[0] + nx, 74, a[1] + ny);
      }
      for (let i = 0; i < n; i++) {
        const i0 = i * 2, i1 = i * 2 + 1;
        const j0 = ((i + 1) % n) * 2, j1 = ((i + 1) % n) * 2 + 1;
        idx.push(i0, i1, j1, i0, j1, j0);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      this.scene.add(new THREE.Mesh(geo, new THREE.MeshLambertMaterial({
        color: 0xe6ebf5, side: THREE.DoubleSide,
      })));
    }
  }

  private buildStartLine(pts: number[][], halfW: number) {
    const a = pts[0], b = pts[1];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const geo = new THREE.PlaneGeometry(halfW * 2, 60);
    const mat = new THREE.MeshLambertMaterial({ color: 0xf2f5ff });
    const m = new THREE.Mesh(geo, mat);
    m.rotation.x = -Math.PI / 2;
    m.rotation.z = -ang;
    m.position.set(a[0], 2, a[1]);
    this.scene.add(m);
  }

  /** 코스 옆 기둥. 3D에서 속도감은 대부분 "옆을 스쳐 지나가는 것"에서 나온다. */
  private buildPosts(halfW: number) {
    if (!this.track) return;
    const geo = new THREE.CylinderGeometry(9, 9, 90, 6);
    const mat = new THREE.MeshLambertMaterial({ color: 0xe8eefc });
    const step = 260;
    const count = Math.floor(this.track.total / step);
    const mesh = new THREE.InstancedMesh(geo, mat, count * 2);
    const dummy = new THREE.Object3D();
    let k = 0;
    for (let i = 0; i < count; i++) {
      const s = i * step;
      const p = pointAt(this.track, s);
      for (const side of [-1, 1]) {
        const off = (halfW + 55) * side;
        dummy.position.set(
          p.x - Math.sin(p.angle) * off, 45, p.y + Math.cos(p.angle) * off
        );
        dummy.updateMatrix();
        mesh.setMatrixAt(k++, dummy.matrix);
      }
    }
    mesh.count = k;
    this.scene.add(mesh);
  }

  // ---------- 오브젝트 ----------

  private makeKart(k: any, i: number): THREE.Group {
    const g = new THREE.Group();
    const color = COLORS[i % COLORS.length];

    // 모델은 +X 를 향하게 만든다 (heading 0 = +X 방향)
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(80, 26, 46),
      new THREE.MeshLambertMaterial({ color })
    );
    body.position.y = 22;
    g.add(body);

    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(38, 26, 36),
      new THREE.MeshLambertMaterial({ color: 0x101a2e })
    );
    cabin.position.set(-6, 45, 0);
    g.add(cabin);

    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(18, 30, 4),
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    nose.rotation.z = -Math.PI / 2;
    nose.position.set(50, 22, 0);
    g.add(nose);

    const wheelGeo = new THREE.CylinderGeometry(17, 17, 14, 10);
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x14171f });
    for (const [wx, wz] of [[28, 28], [28, -28], [-28, 28], [-28, -28]]) {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.rotation.x = Math.PI / 2;
      w.position.set(wx, 17, wz);
      g.add(w);
    }

    const shield = new THREE.Mesh(
      new THREE.SphereGeometry(62, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0x4da3ff, transparent: true, opacity: 0.2 })
    );
    shield.position.y = 30;
    shield.visible = false;
    g.add(shield);
    g.userData.shield = shield;

    const label = this.makeLabel(k.nickname + (k.isBot ? " [AI]" : ""));
    label.position.y = 120;
    g.add(label);
    g.userData.label = label;

    this.scene.add(g);
    return g;
  }

  private makeLabel(text: string): THREE.Sprite {
    const cv = document.createElement("canvas");
    cv.width = 512; cv.height = 128;
    const cx = cv.getContext("2d")!;
    cx.font = "bold 62px system-ui, sans-serif";
    cx.textAlign = "center";
    cx.textBaseline = "middle";
    cx.lineWidth = 10;
    cx.strokeStyle = "rgba(6,10,20,.95)";
    cx.strokeText(text, 256, 64);
    cx.fillStyle = "#eaf1ff";
    cx.fillText(text, 256, 64);

    const tex = new THREE.CanvasTexture(cv);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
    sp.scale.set(280, 70, 1);
    return sp;
  }

  private makePickup(p: any): THREE.Mesh {
    const isItem = p.kind === "item";
    const m = new THREE.Mesh(
      isItem ? new THREE.BoxGeometry(56, 56, 56) : new THREE.BoxGeometry(64, 64, 64),
      new THREE.MeshLambertMaterial({
        color: isItem ? 0x2f7fe0 : 0xb5701f,
        emissive: isItem ? 0x0d2a52 : 0x3a2408,
      })
    );
    m.position.set(p.x, 38, p.y);
    this.scene.add(m);
    return m;
  }

  private makeHazard(h: any): THREE.Mesh {
    const m = new THREE.Mesh(
      new THREE.CircleGeometry(46, 16),
      new THREE.MeshLambertMaterial({ color: 0x1a1410 })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(h.x, 4, h.y);
    this.scene.add(m);
    return m;
  }

  // ---------- 루프 ----------

  private frame() {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const state = net.state;
    if (!state || !this.track) { this.renderer.render(this.scene, this.camera); return; }

    const racing = state.phase === "racing";
    if (racing) this.readInput();

    const me = net.me();
    if (me) {
      if (!this.localReady) { this.syncLocal(me); this.localReady = true; }
      if (racing && !me.finished) {
        const pr = project(this.track, this.local.x, this.local.y);
        const guide = pointAt(this.track, pr.s); // 서버와 동일해야 예측이 어긋나지 않는다
        stepKart(this.local, this.ctrl, dt, {
          offTrack: pr.offTrack,
          speedMul: me.speedMul,
          stunned: me.stunMs > 0,
          trackAngle: guide.angle,
        });
      }
      const gap = Math.hypot(me.x - this.local.x, me.y - this.local.y);
      if (gap > 240) this.syncLocal(me);
      else {
        this.local.x += (me.x - this.local.x) * 0.10;
        this.local.y += (me.y - this.local.y) * 0.10;
        this.local.heading += angleDiff(me.heading, this.local.heading) * 0.10;
      }
    }

    this.syncKarts(state, dt);
    this.syncProps(state, dt);
    this.updateCamera(me, dt);
    this.fadeSparks(dt);

    this.renderer.render(this.scene, this.camera);
  }

  private readInput() {
    const k = this.keys;
    this.ctrl.throttle = k["ArrowUp"] ? 1 : k["ArrowDown"] ? -1 : 0;
    this.ctrl.steer = k["ArrowLeft"] ? -1 : k["ArrowRight"] ? 1 : 0;
    this.ctrl.drift = !!(k["ShiftLeft"] || k["ShiftRight"]);
    net.sendInput(this.ctrl);
  }

  private syncLocal(me: any) {
    this.local.x = me.x; this.local.y = me.y;
    this.local.heading = me.heading; this.local.speed = me.speed;
    this.local.steerActual = me.steer ?? 0;
    this.local.driftCharge = 0; this.local.drifting = false;
  }

  private syncKarts(state: any, dt: number) {
    const list: any[] = [...state.karts.values()];
    list.forEach((k, i) => {
      let g = this.karts[k.sessionId];
      if (!g) g = this.karts[k.sessionId] = this.makeKart(k, i);

      let x: number, y: number, h: number;
      if (k.sessionId === net.selfId) {
        x = this.local.x; y = this.local.y; h = this.local.heading;
      } else {
        const gh = this.ghost[k.sessionId] ??= { x: k.x, y: k.y, heading: k.heading };
        if (Math.hypot(k.x - gh.x, k.y - gh.y) > 240) { gh.x = k.x; gh.y = k.y; gh.heading = k.heading; }
        gh.x += (k.x - gh.x) * 0.25;
        gh.y += (k.y - gh.y) * 0.25;
        gh.heading += angleDiff(k.heading, gh.heading) * 0.25;
        x = gh.x; y = gh.y; h = gh.heading;
      }

      g.position.set(x, 0, y);
      g.rotation.y = -h;

      // 드리프트 중에는 차체를 바깥으로 기울인다 — 미끄러지는 게 보여야 한다
      const lean = k.drifting ? -Math.sign(k.steer || 0) * 0.22 : 0;
      g.rotation.z += (lean - g.rotation.z) * Math.min(1, dt * 8);

      (g.userData.shield as THREE.Mesh).visible = k.shieldMs > 0;
      g.visible = !(k.respawnMs > 0 && Math.floor(k.respawnMs / 110) % 2 === 0);

      if (k.drifting) {
        const info = KART.driftTiers[k.driftTier - 1];
        this.emitSpark(x, y, h, info ? info.color : 0x9fb4d8);
      } else if (k.boostMs > 0) {
        const info = KART.driftTiers[k.boostTier - 1];
        this.emitSpark(x, y, h, info ? info.color : 0xffd166);
      }
    });
  }

  private syncProps(state: any, dt: number) {
    for (const p of state.pickups as any[]) {
      let m = this.pickups[p.id];
      if (!m) m = this.pickups[p.id] = this.makePickup(p);
      m.visible = p.active;
      m.rotation.y += dt * (p.kind === "item" ? 1.8 : 0.7);
      m.position.y = 38 + Math.sin(performance.now() / 400 + p.x) * 8;
    }

    const live = new Set<string>();
    for (const h of state.hazards as any[]) {
      live.add(h.id);
      if (!this.hazards[h.id]) this.hazards[h.id] = this.makeHazard(h);
    }
    for (const id of Object.keys(this.hazards)) {
      if (!live.has(id)) { this.scene.remove(this.hazards[id]); delete this.hazards[id]; }
    }
  }

  /** 추격 카메라. 코너가 미리 보이는 것이 3D의 핵심 이점이다. */
  private updateCamera(me: any, dt: number) {
    if (!me) return;
    const h = this.local.heading;
    const sp = Math.abs(this.local.speed);
    const t = Math.min(sp / KART.maxSpeed, 1.4);

    // 빠를수록 멀리·낮게 → 속도감
    const dist = 230 + t * 90;
    const height = 130 + t * 18;

    const behindX = this.local.x - Math.cos(h) * dist;
    const behindZ = this.local.y - Math.sin(h) * dist;

    const target = new THREE.Vector3(behindX, height, behindZ);
    this.camPos.lerp(target, Math.min(1, dt * 6.5));

    // 시선은 카트보다 조금 앞을 본다
    const lookX = this.local.x + Math.cos(h) * 220;
    const lookZ = this.local.y + Math.sin(h) * 220;
    this.camLook.lerp(new THREE.Vector3(lookX, 40, lookZ), Math.min(1, dt * 9));

    this.camera.position.copy(this.camPos);
    this.camera.up.copy(UP);
    this.camera.lookAt(this.camLook);

    // 부스트 중 시야각을 살짝 넓혀 속도감을 준다
    const targetFov = 62 + (me.boostMs > 0 ? 9 : 0) + t * 4;
    this.camera.fov += (targetFov - this.camera.fov) * Math.min(1, dt * 5);
    this.camera.updateProjectionMatrix();
  }

  // ---------- 연출 ----------

  private emitSpark(x: number, y: number, heading: number, color: number) {
    const m = this.sparks[this.sparkIdx = (this.sparkIdx + 1) % this.sparks.length];
    m.position.set(
      x - Math.cos(heading) * 44 + (Math.random() - 0.5) * 26,
      10 + Math.random() * 14,
      y - Math.sin(heading) * 44 + (Math.random() - 0.5) * 26
    );
    (m.material as THREE.MeshBasicMaterial).color.setHex(color);
    (m.material as THREE.MeshBasicMaterial).opacity = 0.95;
    m.scale.setScalar(1);
    m.visible = true;
  }

  private fadeSparks(dt: number) {
    for (const m of this.sparks) {
      if (!m.visible) continue;
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity -= dt * 3.2;
      m.scale.multiplyScalar(1 - dt * 1.6);
      if (mat.opacity <= 0) m.visible = false;
    }
  }

  private onFx(d: any) {
    const g = this.karts[d.id];
    if (!g) return;
    const isMe = d.id === net.selfId;

    if (d.type === "bomb" || d.type === "spin") {
      for (let i = 0; i < 14; i++) this.emitSpark(g.position.x, g.position.z, Math.random() * 6.3, 0x4da3ff);
    } else if (d.type === "drift_boost" || d.type === "boost") {
      const info = KART.driftTiers[(d.tier ?? 1) - 1];
      for (let i = 0; i < 10; i++) {
        this.emitSpark(g.position.x, g.position.z, this.local.heading, info ? info.color : 0xffd166);
      }
    } else if (d.type === "respawn" && isMe) {
      this.localReady = false;
    } else if (d.type === "wall" && isMe) {
      for (let i = 0; i < 3; i++) this.emitSpark(d.x, d.y, this.local.heading, 0xffd9a0);
    }
  }
}

function angleDiff(target: number, current: number) {
  let d = target - current;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}
