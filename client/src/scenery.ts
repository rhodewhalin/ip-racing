// ============================================================
// 절차적 텍스처 & 배경 오브젝트
//
// 사운드와 같은 방침이다 — **이미지 파일을 쓰지 않고 캔버스로 그려낸다.**
//  · 다운로드할 에셋이 없다 (번들 증가 거의 0)
//  · 저작권 문제가 없다
//  · 색·패턴을 코드로 조절할 수 있다
// ============================================================

import * as THREE from "three";

function canvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return [c, c.getContext("2d")!];
}

function toTexture(c: HTMLCanvasElement, repeatX = 1, repeatY = 1) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeatX, repeatY);
  t.anisotropy = 8;
  return t;
}

/** 아스팔트: 어두운 바탕 + 자잘한 노이즈 + 미세한 얼룩 */
export function asphaltTexture(): THREE.Texture {
  const [c, g] = canvas(512, 512);
  g.fillStyle = "#2b3040";
  g.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 26000; i++) {
    const v = 28 + Math.random() * 40;
    g.fillStyle = `rgba(${v + 12},${v + 16},${v + 26},${0.25 + Math.random() * 0.4})`;
    g.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }
  // 넓은 얼룩으로 단조로움을 깬다
  for (let i = 0; i < 40; i++) {
    const r = 30 + Math.random() * 90;
    const gr = g.createRadialGradient(Math.random() * 512, Math.random() * 512, 0, 256, 256, r);
    gr.addColorStop(0, "rgba(255,255,255,0.03)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 512, 512);
  }
  return toTexture(c, 3, 40);
}

/** 잔디: 초록 바탕 + 결 */
export function grassTexture(): THREE.Texture {
  const [c, g] = canvas(256, 256);
  g.fillStyle = "#20402a";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 9000; i++) {
    const v = Math.random();
    g.strokeStyle = `rgba(${40 + v * 50},${90 + v * 70},${50 + v * 40},0.5)`;
    g.lineWidth = 1;
    const x = Math.random() * 256, y = Math.random() * 256;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.random() * 3 - 1.5, y - 3 - Math.random() * 4); g.stroke();
  }
  return toTexture(c, 60, 60);
}

/** 커브(연석): 빨강·흰색 교대 */
export function curbTexture(): THREE.Texture {
  const [c, g] = canvas(64, 64);
  g.fillStyle = "#f2f4f8"; g.fillRect(0, 0, 64, 64);
  g.fillStyle = "#d63a48"; g.fillRect(0, 0, 64, 32);
  return toTexture(c, 1, 260);
}

/** 방호벽: 흰 바탕에 파란 띠 + IP 문구 */
export function barrierTexture(): THREE.Texture {
  const [c, g] = canvas(512, 128);
  g.fillStyle = "#eef2fa"; g.fillRect(0, 0, 512, 128);
  g.fillStyle = "#1f6fd0"; g.fillRect(0, 84, 512, 44);
  g.fillStyle = "#0f1a2e";
  g.font = "bold 46px system-ui, sans-serif";
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText("IP RACING", 256, 44);
  return toTexture(c, 26, 1);
}

/** 출발선 체크무늬 */
export function checkerTexture(): THREE.Texture {
  const [c, g] = canvas(128, 128);
  const n = 8, s = 128 / n;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    g.fillStyle = (x + y) % 2 ? "#12161f" : "#f5f8ff";
    g.fillRect(x * s, y * s, s, s);
  }
  return toTexture(c, 6, 1);
}

/** 하늘: 위는 짙은 남색, 아래는 옅은 하늘색 (반구 안쪽에 입힌다) */
export function skyDome(): THREE.Mesh {
  const [c, g] = canvas(16, 256);
  const gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0.0, "#0a1430");
  gr.addColorStop(0.45, "#20406e");
  gr.addColorStop(0.78, "#4a7fae");
  gr.addColorStop(1.0, "#9fc4d8");
  g.fillStyle = gr; g.fillRect(0, 0, 16, 256);

  const tex = new THREE.CanvasTexture(c);
  const geo = new THREE.SphereGeometry(7000, 24, 16);
  const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, fog: false, depthWrite: false });
  const m = new THREE.Mesh(geo, mat);
  m.renderOrder = -1;
  return m;
}

/** 먼 산 실루엣. 깊이감의 대부분이 여기서 나온다. */
export function mountains(): THREE.Group {
  const g = new THREE.Group();
  const layers = [
    { r: 5600, h: 900, color: 0x1a2b45, seg: 26 },
    { r: 4700, h: 620, color: 0x223757, seg: 22 },
  ];
  for (const L of layers) {
    const pos: number[] = [];
    for (let i = 0; i < L.seg; i++) {
      const a0 = (i / L.seg) * Math.PI * 2;
      const a1 = ((i + 1) / L.seg) * Math.PI * 2;
      const am = (a0 + a1) / 2;
      const peak = L.h * (0.45 + Math.random() * 0.9);
      const p = (a: number, y: number) => pos.push(Math.cos(a) * L.r, y, Math.sin(a) * L.r);
      p(a0, 0); p(a1, 0); pos.push(Math.cos(am) * L.r, peak, Math.sin(am) * L.r);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.computeVertexNormals();
    g.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: L.color, side: THREE.DoubleSide, fog: false,
    })));
  }
  return g;
}

/** 나무 한 그루 (원뿔 + 기둥) */
export function tree(): THREE.Group {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(9, 12, 70, 6),
    new THREE.MeshLambertMaterial({ color: 0x4a3521 })
  );
  trunk.position.y = 35;
  g.add(trunk);
  const shades = [0x2f6b3a, 0x275b32, 0x377a44];
  for (let i = 0; i < 3; i++) {
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(58 - i * 13, 78, 7),
      new THREE.MeshLambertMaterial({ color: shades[i % 3] })
    );
    cone.position.y = 92 + i * 44;
    g.add(cone);
  }
  return g;
}

/** 관중석 (계단식 박스 + 관중 점들) */
export function grandstand(): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(520, 40, 70),
      new THREE.MeshLambertMaterial({ color: i % 2 ? 0x44506d : 0x39445e })
    );
    step.position.set(0, 20 + i * 38, -i * 66);
    g.add(step);

    // 관중: 작은 색 점을 인스턴싱으로. 멀리서 보면 사람처럼 보인다.
    const geo = new THREE.BoxGeometry(14, 26, 12);
    const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, vertexColors: false });
    const n = 22;
    const inst = new THREE.InstancedMesh(geo, mat, n);
    const dummy = new THREE.Object3D();
    const palette = [0xff6b6b, 0x4da3ff, 0xffd166, 0x37d67a, 0xc77dff, 0xf5f7fb];
    for (let k = 0; k < n; k++) {
      dummy.position.set(-240 + k * 22 + Math.random() * 8, 53 + i * 38, -i * 66 + 10);
      dummy.updateMatrix();
      inst.setMatrixAt(k, dummy.matrix);
      inst.setColorAt(k, new THREE.Color(palette[Math.floor(Math.random() * palette.length)]));
    }
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    g.add(inst);
  }
  return g;
}
