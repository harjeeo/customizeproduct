import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { buildMugTexture } from "./buildMugTexture";

function buildMugGroup() {
  const group = new THREE.Group();

  const radiusTop = 1.05;
  const radiusBottom = 1;
  const height = 2.3;
  const radialSegments = 96;

  const bodyGeo = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    radialSegments,
    1,
    true
  );
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.35,
    metalness: 0.03,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMaterial);
  group.add(body);

  // separate plain-white material for the base/rim/handle so the print
  // texture (only ever assigned to the body) doesn't stretch onto them
  const ceramicMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.35,
    metalness: 0.03,
  });

  // inner wall (visible through the rim opening)
  const innerGeo = new THREE.CylinderGeometry(
    radiusTop - 0.06,
    radiusBottom - 0.06,
    height - 0.05,
    radialSegments,
    1,
    true
  );
  const innerMaterial = new THREE.MeshStandardMaterial({
    color: 0xf3f3f3,
    roughness: 0.5,
    side: THREE.BackSide,
  });
  const inner = new THREE.Mesh(innerGeo, innerMaterial);
  inner.position.y = 0.02;
  group.add(inner);

  // base disc
  const baseGeo = new THREE.CircleGeometry(radiusBottom, radialSegments);
  const base = new THREE.Mesh(baseGeo, ceramicMaterial);
  base.rotation.x = Math.PI / 2;
  base.position.y = -height / 2;
  group.add(base);

  // rim ring for a bit of edge thickness
  const rimGeo = new THREE.TorusGeometry(radiusTop - 0.03, 0.03, 12, radialSegments);
  const rim = new THREE.Mesh(rimGeo, ceramicMaterial);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = height / 2;
  group.add(rim);

  return { group, body, height, radiusTop, radiusBottom };
}

function buildHandle(radius, height, angle) {
  const handleGroup = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.03 });

  const curve = new THREE.EllipseCurve(0, 0, 0.55, 0.75, -1.15, 1.15, false, 0);
  const points = curve.getPoints(40).map((p) => new THREE.Vector3(p.x, p.y, 0));
  const path = new THREE.CatmullRomCurve3(points);
  const tubeGeo = new THREE.TubeGeometry(path, 40, 0.11, 12, false);
  const handle = new THREE.Mesh(tubeGeo, material);

  handle.rotation.z = Math.PI;
  handle.position.set(radius * Math.cos(angle), 0, radius * Math.sin(angle));
  handle.rotation.y = -angle + Math.PI / 2;

  handleGroup.add(handle);
  return handleGroup;
}

export default function PreviewView3D({ activeSide, canvasApi, activeSideId }) {
  const [open, setOpen] = useState(false);
  const mountRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    if (!open || !mountRef.current) return undefined;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(3, 4, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.6);
    fill.position.set(-4, 1, -2);
    scene.add(fill);
    const top = new THREE.DirectionalLight(0xffffff, 0.4);
    top.position.set(0, 6, 0);
    scene.add(top);

    const { group, height: mugHeight, radiusTop } = buildMugGroup();
    scene.add(group);

    const threeD = activeSide.threeD;
    const gapCenterAngle = 0; // handle sits at texture wrap seam (u = 0 / 1)
    const handle = buildHandle(radiusTop, mugHeight, gapCenterAngle);
    group.add(handle);

    // CylinderGeometry's u=0 seam faces the camera by default (+Z), but our
    // texture centers the print at u=0.5 (theta=π) with the handle gap at
    // u=0 — rotate by π so the print faces the camera and the handle sits
    // at the back, plus a bit extra for a pleasant three-quarter view.
    let rotationY = Math.PI + 0.4;
    let dragging = false;
    let lastX = 0;
    let autoRotate = true;

    const applyRotation = () => {
      group.rotation.y = rotationY;
    };
    applyRotation();

    const onPointerDown = (e) => {
      dragging = true;
      autoRotate = false;
      lastX = e.clientX;
      mount.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      rotationY += dx * 0.01;
      applyRotation();
    };
    const onPointerUp = (e) => {
      dragging = false;
      if (mount.hasPointerCapture?.(e.pointerId)) {
        mount.releasePointerCapture(e.pointerId);
      }
    };

    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointermove", onPointerMove);
    mount.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("pointerleave", onPointerUp);

    let raf;
    const tick = () => {
      if (autoRotate && !dragging) {
        rotationY += 0.004;
        applyRotation();
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    stateRef.current = { scene, renderer, group };

    // load + apply texture asynchronously
    const layers = canvasApi?.getLayersForSide(activeSideId) ?? [];
    buildMugTexture({ layers, threeD }).then((canvasEl) => {
      const texture = new THREE.CanvasTexture(canvasEl);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.needsUpdate = true;
      group.children[0].material.map = texture;
      group.children[0].material.needsUpdate = true;
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerup", onPointerUp);
      mount.removeEventListener("pointerleave", onPointerUp);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (obj.material.map) obj.material.map.dispose();
          obj.material.dispose();
        }
      });
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [open, activeSide, canvasApi, activeSideId]);

  if (!activeSide.threeD) return null;

  return (
    <div className="pointer-events-auto absolute bottom-6 left-6 w-[280px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-neutral-800"
      >
        3D Preview
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={16}
          className={open ? "rotate-180 transition-transform" : "transition-transform"}
        />
      </button>
      {open && (
        <div
          ref={mountRef}
          className="h-[260px] w-full cursor-grab touch-none border-t border-neutral-100 active:cursor-grabbing"
        />
      )}
    </div>
  );
}
