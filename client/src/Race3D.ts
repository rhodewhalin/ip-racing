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
import { KartBody, stepKart, applyWall, resolveBump, KART } from "./physics";
import { buildTrack, project, pointAt, TrackData } from "./track";
import { audio } from "./audio";
import {
  asphaltTexture, grassTexture, curbTexture, barrierTexture, checkerTexture,
  skyDome, mountains, grandstand,
} from "./scenery";

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
  private wallSfx = 0;
  private frameErrors = 0;
  private lastError = "";
  private lastServerAt = 0;
  private stallMs = 0;
  private lastLocal = { x: 0, y: 0 };
  private recoveries = 0;
  private bumpedAt = 0;
  private sky!: THREE.Mesh;
  private mounts!: THREE.Group;

  constructor(private container: HTMLElement) {}

  start() {
    if (this.running) return;
    this.running = true;
    this.initThree();
    this.bindInput();
    net.on("fx", (d: any) => this.onFx(d));
    net.on("track", () => this.buildWorld());
    // 재경기: 로컬 예측·보간 상태를 새 출발선 기준으로 리셋한다
    net.on("rematch", () => {
      // 재경기: 카트 오브젝트를 전부 정리한다. 남겨두면 잔상이 된다.
      for (const id of Object.keys(this.karts)) this.disposeKart(id);
      this.ghost = {};
      this.localReady = false;
      this.stallMs = 0;
    });
    // 이미 받았으면 즉시, 아니면 받을 때까지 재요청
    net.ensureTrack(() => this.buildWorld());
    // 렌더 루프에서 예외가 한 번 터지면 이후 화면이 통째로 멈춘 것처럼 보인다.
    // 감싸두면 한 프레임만 건너뛰고 계속 돈다. 콘솔에 원인이 남는다.
    // 갱신에서 예외가 나도 **렌더는 반드시 실행한다.**
    // 이전 버전은 예외가 나면 render() 까지 건너뛰어 화면이 그대로 멈췄다.
    this.renderer.setAnimationLoop(() => {
      try { this.frame(); }
      catch (e: any) {
        this.frameErrors++;
        this.lastError = String(e?.message ?? e);
        if (this.frameErrors <= 5) console.error("[Race3D] frame error", e);
      }
      try { this.renderer.render(this.scene, this.camera); } catch {}
    });
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
    // 안개 색을 지평선 하늘색과 맞춰야 멀리가 자연스럽게 녹아든다
    this.scene.fog = new THREE.Fog(0x486f96, 2600, 6400);

    this.camera = new THREE.PerspectiveCamera(62, w / h, 5, 12000);
    this.camera.position.set(0, 200, 0);

    // 하늘과 산은 카메라를 따라다닌다 = 항상 지평선에 머문다.
    // 고정해 두면 트랙과 겹쳐서 코스 위에 삼각형이 나타난다.
    this.sky = skyDome();
    this.mounts = mountains();
    this.scene.add(this.sky);
    this.scene.add(this.mounts);

    this.scene.add(new THREE.HemisphereLight(0xbcd8ff, 0x2e4a2a, 1.0));
    const sun = new THREE.DirectionalLight(0xfff2d8, 1.5);
    sun.position.set(1600, 2600, 1000);
    this.scene.add(sun);
    const rim = new THREE.DirectionalLight(0x88aaff, 0.45);
    rim.position.set(-1400, 900, -1200);
    this.scene.add(rim);

    // 잔디 바닥 (절차적 텍스처)
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(26000, 26000),
      new THREE.MeshLambertMaterial({ map: grassTexture() })
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

    this.scene.add(this.ribbon(pts, -halfW, halfW, 0, 0xffffff, asphaltTexture()));   // 노면
    this.scene.add(this.ribbon(pts, -halfW - 26, -halfW, 3, 0xffffff, curbTexture())); // 왼쪽 커브
    this.scene.add(this.ribbon(pts, halfW, halfW + 26, 3, 0xffffff, curbTexture()));   // 오른쪽 커브
    this.scene.add(this.ribbon(pts, -halfW + 8, -halfW + 16, 1, 0xe9eefb));            // 좌측 흰선
    this.scene.add(this.ribbon(pts, halfW - 16, halfW - 8, 1, 0xe9eefb));              // 우측 흰선

    this.buildWalls(pts, halfW);
    this.buildStartLine(pts, halfW);
    this.buildScenery(halfW);
  }

  /** 중심선을 따라 좌우 오프셋으로 리본 메시를 만든다. */
  private ribbon(pts: number[][], from: number, to: number, y: number, color: number, map?: THREE.Texture) {
    const n = pts.length;
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];

    for (let i = 0; i < n; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % n];
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      const nx = -Math.sin(ang), ny = Math.cos(ang);
      pos.push(a[0] + nx * from, y, a[1] + ny * from);
      pos.push(a[0] + nx * to, y, a[1] + ny * to);
      const v = i / n;
      uv.push(0, v, 1, v);
    }
    for (let i = 0; i < n; i++) {
      const i0 = i * 2, i1 = i * 2 + 1;
      const j0 = ((i + 1) % n) * 2, j1 = ((i + 1) % n) * 2 + 1;
      idx.push(i0, i1, j1, i0, j1, j0);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color, map, side: THREE.DoubleSide }));
  }

  /** 좌우 벽. 이제 코스 밖으로 나갈 수 없고, 닿으면 긁으며 미끄러진다. */
  private buildWalls(pts: number[][], halfW: number) {
    const n = pts.length;
    for (const side of [-1, 1]) {
      const pos: number[] = [];
      const uvs: number[] = [];
      const idx: number[] = [];
      for (let i = 0; i < n; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % n];
        const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
        const nx = -Math.sin(ang) * halfW * side;
        const ny = Math.cos(ang) * halfW * side;
        pos.push(a[0] + nx, 0, a[1] + ny);
        pos.push(a[0] + nx, 96, a[1] + ny);
        // v: 아래 정점 = 0, 위 정점 = 1.
        // (반대로 넣으면 글자가 위아래로 뒤집힌다 — 실제로 그랬다)
        // u: 좌우 벽은 안쪽에서 볼 때 서로 반대 면을 보므로 한쪽만 뒤집어야
        //    글자가 거울상으로 보이지 않는다.
        const u = side > 0 ? 1 - i / n : i / n;  // 좌우 벽이 서로 반대 면을 향하므로 한쪽만 뒤집는다
        uvs.push(u, 0, u, 1);
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
      geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
      this.scene.add(new THREE.Mesh(geo, new THREE.MeshLambertMaterial({
        map: barrierTexture(), side: THREE.DoubleSide,
      })));
    }
  }

  private buildStartLine(pts: number[][], halfW: number) {
    const a = pts[0], b = pts[1];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const geo = new THREE.PlaneGeometry(halfW * 2, 90);
    const mat = new THREE.MeshLambertMaterial({ map: checkerTexture() });
    const m = new THREE.Mesh(geo, mat);
    m.rotation.x = -Math.PI / 2;
    m.rotation.z = -ang;
    m.position.set(a[0], 2, a[1]);
    this.scene.add(m);
  }

  /**
   * 코스 주변 배경.
   *
   * ⚠️ 후보 지점을 법선 방향으로 밀어내는 것만으로는 부족하다.
   *    코너에서 코스가 되돌아오면 그 자리가 **다른 구간의 노면 위**가 된다.
   *    그래서 후보마다 전체 중심선까지의 거리를 다시 재고(project),
   *    이미 놓인 오브젝트와의 간격도 검사한다.
   */
  private buildScenery(halfW: number) {
    if (!this.track) return;
    const placed: { x: number; y: number; r: number }[] = [];

    const fits = (x: number, y: number, radius: number, clearFromTrack: number) => {
      // ① 코스(어느 구간이든)에서 충분히 떨어져 있는가
      if (Math.abs(project(this.track!, x, y).lateral) < halfW + clearFromTrack) return false;
      // ② 이미 놓인 오브젝트와 겹치지 않는가
      for (const p of placed) {
        if (Math.hypot(p.x - x, p.y - y) < p.r + radius) return false;
      }
      return true;
    };

    // 관중석 먼저 (자리를 많이 차지하므로 우선권)
    for (const frac of [0.02, 0.36, 0.72]) {
      const p = pointAt(this.track, this.track.total * frac);
      for (const side of [1, -1]) {
        const off = (halfW + 230) * side;
        const x = p.x - Math.sin(p.angle) * off;
        const y = p.y + Math.cos(p.angle) * off;
        if (!fits(x, y, 300, 150)) continue;
        const gs = grandstand();
        gs.position.set(x, 0, y);
        gs.rotation.y = -p.angle + (side > 0 ? Math.PI / 2 : -Math.PI / 2);
        this.scene.add(gs);
        placed.push({ x, y, r: 300 });
        break; // 한 지점에 하나만
      }
    }

    // 나무 — InstancedMesh 로 묶는다.
    // 개별 Group 으로 두면 나무 하나당 드로우콜 4개가 들어가 프레임이 떨어진다.
    // ("버벅거린다" 피드백) 기둥/잎 3단을 각각 하나의 인스턴스 메시로 처리한다.
    const spots: { x: number; y: number; sc: number; rot: number }[] = [];
    for (let s = 0; s < this.track.total; s += 300) {
      for (const side of [-1, 1]) {
        if (Math.random() > 0.55) continue;
        const p = pointAt(this.track, s + Math.random() * 140);
        const off = (halfW + 190 + Math.random() * 560) * side;
        const x = p.x - Math.sin(p.angle) * off;
        const y = p.y + Math.cos(p.angle) * off;
        if (!fits(x, y, 90, 110)) continue;
        const sc = 0.75 + Math.random() * 0.8;
        spots.push({ x, y, sc, rot: Math.random() * 6.28 });
        placed.push({ x, y, r: 90 * sc });
      }
    }

    if (spots.length) {
      const parts: [THREE.BufferGeometry, THREE.Material, number][] = [
        [new THREE.CylinderGeometry(9, 12, 70, 6), new THREE.MeshLambertMaterial({ color: 0x4a3521 }), 35],
        [new THREE.ConeGeometry(58, 78, 7), new THREE.MeshLambertMaterial({ color: 0x2f6b3a }), 92],
        [new THREE.ConeGeometry(45, 78, 7), new THREE.MeshLambertMaterial({ color: 0x275b32 }), 136],
        [new THREE.ConeGeometry(32, 78, 7), new THREE.MeshLambertMaterial({ color: 0x377a44 }), 180],
      ];
      const dummy = new THREE.Object3D();
      for (const [geo, mat, yy] of parts) {
        const inst = new THREE.InstancedMesh(geo, mat, spots.length);
        spots.forEach((sp, i) => {
          dummy.position.set(sp.x, yy * sp.sc, sp.y);
          dummy.scale.setScalar(sp.sc);
          dummy.rotation.set(0, sp.rot, 0);
          dummy.updateMatrix();
          inst.setMatrixAt(i, dummy.matrix);
        });
        this.scene.add(inst);
      }
    }

    this.buildPosts(halfW);
  }

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
        const px = p.x - Math.sin(p.angle) * off;
        const py = p.y + Math.cos(p.angle) * off;
        // 다른 구간의 노면 위에 서지 않도록 확인
        if (Math.abs(project(this.track, px, py).lateral) < halfW + 20) continue;
        dummy.position.set(px, 45, py);
        dummy.updateMatrix();
        mesh.setMatrixAt(k++, dummy.matrix);
      }
    }
    mesh.count = k;
    this.scene.add(mesh);
  }

  // ---------- 오브젝트 ----------

  /** 카트 오브젝트를 씬에서 제거하고 GPU 자원도 반납한다 */
  private disposeKart(id: string) {
    const g = this.karts[id];
    if (!g) return;
    g.traverse((o: any) => {
      if (o.geometry) o.geometry.dispose?.();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) { m.map?.dispose?.(); m.dispose?.(); }
      }
    });
    this.scene.remove(g);
    delete this.karts[id];
    delete this.ghost[id];
  }

  private makeKart(k: any, i: number): THREE.Group {
    const g = new THREE.Group();
    const color = COLORS[i % COLORS.length];
    const paint = new THREE.MeshStandardMaterial({ color, metalness: 0.35, roughness: 0.42 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x161b28, metalness: 0.2, roughness: 0.7 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xc9d4e6, metalness: 0.85, roughness: 0.25 });

    // 섀시: 뒤로 갈수록 넓어지게 두 덩이로 쌓아 실루엣을 만든다
    const rear = new THREE.Mesh(new THREE.BoxGeometry(46, 24, 54), paint);
    rear.position.set(-14, 24, 0); g.add(rear);
    const front = new THREE.Mesh(new THREE.BoxGeometry(46, 18, 38), paint);
    front.position.set(26, 21, 0); g.add(front);

    // 사이드 포드
    for (const z of [-30, 30]) {
      const pod = new THREE.Mesh(new THREE.BoxGeometry(52, 16, 12), paint);
      pod.position.set(0, 20, z); g.add(pod);
    }

    // 프런트 윙 + 노즈콘
    const nose = new THREE.Mesh(new THREE.ConeGeometry(13, 34, 4), paint);
    nose.rotation.z = -Math.PI / 2; nose.position.set(52, 20, 0); g.add(nose);
    const fwing = new THREE.Mesh(new THREE.BoxGeometry(12, 5, 72), chrome);
    fwing.position.set(56, 12, 0); g.add(fwing);

    // 리어 윙 (지지대 2개 + 날개)
    for (const z of [-14, 14]) {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(5, 26, 4), dark);
      strut.position.set(-38, 40, z); g.add(strut);
    }
    const rwing = new THREE.Mesh(new THREE.BoxGeometry(16, 5, 62), chrome);
    rwing.position.set(-38, 55, 0); g.add(rwing);

    // 드라이버: 시트 + 몸통 + 헬멧
    const seat = new THREE.Mesh(new THREE.BoxGeometry(26, 16, 30), dark);
    seat.position.set(0, 36, 0); g.add(seat);
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(13, 14, 12), paint);
    helmet.position.set(2, 50, 0); g.add(helmet);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(6, 7, 20), new THREE.MeshStandardMaterial({
      color: 0x0d1220, metalness: 0.9, roughness: 0.1,
    }));
    visor.position.set(12, 51, 0); g.add(visor);

    // 바퀴: 타이어 + 휠(림). 앞바퀴는 조향에 따라 돌아간다.
    const tyre = new THREE.CylinderGeometry(19, 19, 15, 14);
    const rim = new THREE.CylinderGeometry(9, 9, 16, 10);
    const tyreMat = new THREE.MeshStandardMaterial({ color: 0x101319, roughness: 0.9 });
    const wheels: THREE.Group[] = [];
    for (const [wx, wz, isFront] of [[30, 34, 1], [30, -34, 1], [-28, 36, 0], [-28, -36, 0]] as [number, number, number][]) {
      const w = new THREE.Group();
      const t = new THREE.Mesh(tyre, tyreMat); t.rotation.x = Math.PI / 2; w.add(t);
      const r = new THREE.Mesh(rim, chrome); r.rotation.x = Math.PI / 2; w.add(r);
      w.position.set(wx, 19, wz);
      g.add(w);
      if (isFront) wheels.push(w);
    }
    g.userData.frontWheels = wheels;

    // 접지 그림자 (실제 그림자 대신 — 비용이 거의 없다)
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(58, 20),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.32, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 1.5;
    g.add(shadow);

    const shield = new THREE.Mesh(
      new THREE.SphereGeometry(66, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0x4da3ff, transparent: true, opacity: 0.2 })
    );
    shield.position.y = 32;
    shield.visible = false;
    g.add(shield);
    g.userData.shield = shield;

    const label = this.makeLabel(k.nickname + (k.isBot ? " [AI]" : ""), color);
    label.position.y = 112;
    // 내 카트 이름표는 숨긴다 — 누군지 알고 있고, 시야만 가린다
    label.visible = k.sessionId !== net.selfId;
    g.add(label);
    g.userData.label = label;

    this.scene.add(g);
    return g;
  }

  private makeLabel(text: string, color = 0xffffff): THREE.Sprite {
    const cv = document.createElement("canvas");
    cv.width = 512; cv.height = 128;
    const cx = cv.getContext("2d")!;
    cx.font = "bold 54px system-ui, sans-serif";
    cx.textAlign = "center";
    cx.textBaseline = "middle";
    cx.lineWidth = 12;
    cx.strokeStyle = "rgba(6,10,20,.95)";
    cx.strokeText(text, 256, 64);
    cx.fillStyle = "#" + color.toString(16).padStart(6, "0");
    cx.fillText(text, 256, 64);

    const tex = new THREE.CanvasTexture(cv);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
    // 이전 280×70은 너무 커서 내 카트를 가렸다
    sp.scale.set(150, 38, 1);
    return sp;
  }

  private makePickup(p: any): THREE.Mesh {
    const isItem = p.kind === "item";
    const m = new THREE.Mesh(
      isItem ? new THREE.OctahedronGeometry(40) : new THREE.BoxGeometry(62, 62, 62),
      new THREE.MeshStandardMaterial({
        color: isItem ? 0x2f9fe0 : 0xd08a2a,
        emissive: isItem ? 0x11527f : 0x5a3a08,
        emissiveIntensity: 0.9,
        metalness: 0.4, roughness: 0.3,
        transparent: true, opacity: 0.92,
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
    if (!state || !this.track) return;

    if (net.lastStateAt) this.lastServerAt = net.lastStateAt;
    const racing = state.phase === "racing";
    if (racing) this.readInput();

    const me = net.me();
    if (me) {
      if (!this.localReady) { this.syncLocal(me); this.localReady = true; }
      if (racing && !me.finished) {
        const pr = project(this.track, this.local.x, this.local.y);
        const guide = pointAt(this.track, pr.s); // 서버와 동일해야 예측이 어긋나지 않는다
        stepKart(this.local, this.ctrl, dt, {
          offTrack: false,
          speedMul: me.speedMul,
          stunned: me.stunMs > 0,
          trackAngle: guide.angle,
        });
        // 서버와 같은 벽 처리. 이게 빠지면 예측이 벽을 뚫고 나가서
        // 서버 보정과 매 프레임 충돌하고, 화면상 카트가 제자리에서 떨린다.
        applyWall(this.track, this.local, this.ctrl);

        // 다른 카트와의 충돌도 예측에 포함해야 "부딪힌다"는 감각이 생긴다.
        // 상대는 서버 값이 진실이므로 나만 밀려난다 (share = 1).
        // 충돌 → 벽 → 충돌 두 번 반복 (서버와 동일). 한 번만 하면 겹침이 남는다.
        for (let pass = 0; pass < 2; pass++) {
          for (const o of state.karts.values() as Iterable<any>) {
            if (o.sessionId === net.selfId || o.finished) continue;
            const g = this.ghost[o.sessionId];
            const ox = g ? g.x : o.x, oy = g ? g.y : o.y;
            if (resolveBump(this.local, ox, oy, 1)) this.bumpedAt = performance.now();
          }
          applyWall(this.track, this.local, this.ctrl);
        }
      }
      const gap = Math.hypot(me.x - this.local.x, me.y - this.local.y);
      if (gap > 240) this.syncLocal(me);
      else {
        this.local.x += (me.x - this.local.x) * 0.10;
        this.local.y += (me.y - this.local.y) * 0.10;
        this.local.heading += angleDiff(me.heading, this.local.heading) * 0.10;
      }
    }

    this.updateAudio(state, me);
    this.syncKarts(state, dt);
    this.syncProps(state, dt);
    this.updateCamera(me, dt);
    this.fadeSparks(dt);
    this.collectDiagnostics(state, me, dt);
  }

  /** NaN 방어 + 멈춤 감지. 원인 파악용 진단 정보를 화면에 띄운다. */
  private collectDiagnostics(state: any, me: any, dt: number) {
    // 좌표가 NaN 이 되면 카트도 카메라도 그려지지 않아 화면이 통째로 멈춘 것처럼 보인다.
    if (!Number.isFinite(this.local.x) || !Number.isFinite(this.local.y) ||
        !Number.isFinite(this.local.heading) || !Number.isFinite(this.local.speed)) {
      this.lastError = "local NaN → 서버 좌표로 복구";
      if (me) this.syncLocal(me);
      else { this.local.x = 0; this.local.y = 0; this.local.heading = 0; this.local.speed = 0; }
    }

    const moved = Math.hypot(this.local.x - this.lastLocal.x, this.local.y - this.lastLocal.y);
    this.lastLocal = { x: this.local.x, y: this.local.y };
    const pressing = this.ctrl.throttle !== 0 || this.ctrl.steer !== 0;
    if (state.phase === "racing" && pressing && moved < 0.6 && me && me.stunMs <= 0) {
      this.stallMs += dt * 1000;
    } else {
      this.stallMs = 0;
    }

    // 워치독: 화면이 멈췄는데 서버는 움직이고 있으면 예측을 강제로 되맞춘다.
    // 원인이 무엇이든 2초 안에 스스로 복구된다.
    if (this.stallMs > 2000 && me && Math.abs(me.speed) > 60) {
      this.syncLocal(me);
      this.stallMs = 0;
      this.recoveries++;
      this.lastError = `예측 멈춤 감지 → 강제 동기화 (${this.recoveries}회)`;
    }

    (window as any).__ipr = {
      phase: state.phase,
      speed: Math.round(this.local.speed),
      serverSpeed: me ? Math.round(me.speed) : null,
      gap: me ? Math.round(Math.hypot(me.x - this.local.x, me.y - this.local.y)) : null,
      stunMs: me?.stunMs ?? null,
      respawnMs: me?.respawnMs ?? null,
      quizActive: me?.quizActive ?? null,
      keys: { ...this.ctrl },
      stallMs: Math.round(this.stallMs),
      frameErrors: this.frameErrors,
      recoveries: this.recoveries,
      lastError: this.lastError,
      serverAgeMs: Math.round(performance.now() - this.lastServerAt),
    };
  }

  /** 엔진음·스키드음은 지속음이라 매 프레임 갱신한다. */
  private updateAudio(state: any, me: any) {
    if (!me) return;
    audio.updateEngine(this.local.speed, KART.maxSpeed, {
      racing: state.phase === "racing" && !me.finished,
      boost: me.boostMs > 0,
      drifting: me.drifting,
    });
    audio.setSkid(!!me.drifting, 1 + (me.driftTier || 0) * 0.25);
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

    // ⚠️ 상태에서 사라진 카트의 3D 오브젝트를 반드시 지운다.
    //    재경기 때 봇은 삭제 후 새 ID로 다시 생성되는데, 이걸 안 지우면
    //    이전 판의 카트가 출발선에 그대로 서 있어 "잔상"으로 보인다.
    //    (가만히 서 있으니 "플레이를 안 하는 것처럼" 보이기도 한다)
    const live = new Set(list.map((k) => k.sessionId));
    for (const id of Object.keys(this.karts)) {
      if (live.has(id)) continue;
      this.disposeKart(id);
    }
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

      // 앞바퀴가 조향에 따라 돌아간다. 작은 디테일인데 "차 같다"는 인상에 크게 기여한다.
      const fw = g.userData.frontWheels as THREE.Group[] | undefined;
      if (fw) for (const w of fw) w.rotation.y = -(k.steer ?? 0) * 0.5;

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
      if (!live.has(id)) {
        const m = this.hazards[id];
        m.geometry.dispose(); (m.material as THREE.Material).dispose();
        this.scene.remove(m); delete this.hazards[id];
      }
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

    // 배경을 카메라 위치로 이동 (스카이박스 방식)
    if (this.sky) this.sky.position.copy(this.camera.position);
    if (this.mounts) this.mounts.position.set(this.camera.position.x, 0, this.camera.position.z);

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
      if (isMe) audio.hit();
    } else if (d.type === "drift_boost" || d.type === "boost") {
      const info = KART.driftTiers[(d.tier ?? 1) - 1];
      for (let i = 0; i < 10; i++) {
        this.emitSpark(g.position.x, g.position.z, this.local.heading, info ? info.color : 0xffd166);
      }
      if (isMe) audio.boost(d.tier ?? 1);
    } else if (d.type === "respawn" && isMe) {
      this.localReady = false;
      audio.respawn();
    } else if (d.type === "wall" && isMe) {
      for (let i = 0; i < 3; i++) this.emitSpark(d.x, d.y, this.local.heading, 0xffd9a0);
      this.wallSfx = (this.wallSfx ?? 0) + 1;
      if (this.wallSfx % 5 === 0) audio.wall(); // 매 틱 울리면 시끄럽다
    } else if (d.type === "pickup" && isMe) {
      audio.pickup();
    } else if (d.type === "lap" && isMe) {
      audio.lap();
    } else if (d.type === "shield" && isMe) {
      audio.shield();
    } else if (d.type === "finish" && isMe) {
      audio.finish();
    } else if (d.type === "bump") {
      if (isMe || d.other === net.selfId) {
        for (let i = 0; i < 5; i++) this.emitSpark(d.x, d.y, Math.random() * 6.3, 0xffd9a0);
        audio.wall();
      }
    } else if (d.type === "recover" && isMe) {
      // 스핀에서 빠져나오는 순간. 예측 좌표를 서버와 다시 맞춘다.
      this.localReady = false;
      audio.shield();
    }
  }
}

function angleDiff(target: number, current: number) {
  let d = target - current;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}
