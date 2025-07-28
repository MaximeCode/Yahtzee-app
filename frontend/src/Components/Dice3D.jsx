import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";

// Note: cannon-es sera chargé dynamiquement depuis CDN

const Dice3D = ({
  diceValues,
  onDiceRoll,
  shouldRoll,
  onRollComplete,
  keptDice = [false, false, false, false, false],
}) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const physicsWorldRef = useRef(null);
  const diceArrayRef = useRef([]);
  const diceMeshRef = useRef(null);
  const animationIdRef = useRef(null);

  const [isReady, setIsReady] = useState(false);

  const params = {
    numberOfDice: 5,
    segments: 30,
    edgeRadius: 0.07,
    notchRadius: 0.12,
    notchDepth: 0.25, // Augmenté de 0.20 à 0.25 pour des encoches plus profondes
  };

  // Fonction pour merger les géométries (remplace BufferGeometryUtils)
  const mergeBufferGeometries = (geometries, useGroups = false) => {
    let merged = new THREE.BufferGeometry();

    if (geometries.length === 0) return merged;

    // Créer des tableaux pour stocker les attributs
    let positions = [];
    let normals = [];
    let uvs = [];

    geometries.forEach((geometry) => {
      if (geometry.attributes.position) {
        const pos = geometry.attributes.position.array;
        positions.push(...pos);
      }
      if (geometry.attributes.normal) {
        const norm = geometry.attributes.normal.array;
        normals.push(...norm);
      }
      if (geometry.attributes.uv) {
        const uv = geometry.attributes.uv.array;
        uvs.push(...uv);
      }
    });

    // Ajouter les attributs au geometry merged
    if (positions.length > 0) {
      merged.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
    }
    if (normals.length > 0) {
      merged.setAttribute(
        "normal",
        new THREE.Float32BufferAttribute(normals, 3)
      );
    }
    if (uvs.length > 0) {
      merged.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    }

    return merged;
  };

  // Fonction pour merger les vertices (remplace mergeVertices)
  const mergeVertices = (geometry, tolerance = 1e-4) => {
    // Simplification : on retourne la géométrie telle quelle
    // Cette fonction est complexe à réimplémenter, mais optionnelle pour le fonctionnement de base
    return geometry;
  };

  // Initialisation de la physique
  const initPhysics = () => {
    physicsWorldRef.current = new CANNON.World({
      allowSleep: true,
      gravity: new CANNON.Vec3(0, -55, 0),
    });
    physicsWorldRef.current.defaultContactMaterial.restitution = 0.3;
    setIsReady(true);
  };

  // Initialisation de la scène
  const initScene = () => {
    if (!canvasRef.current) return;

    rendererRef.current = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: canvasRef.current,
    });
    rendererRef.current.shadowMap.enabled = true;
    rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap; // Ombres plus douces
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current.setClearColor(0x4d4735, 0.3); // Couleur de fond légèrement visible

    sceneRef.current = new THREE.Scene();

    // Caméra repositionnée pour une meilleure vue
    cameraRef.current = new THREE.PerspectiveCamera(
      75, // FOV légèrement réduit pour un effet plus naturel
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      300
    );

    // Position de la caméra : plus haute et légèrement en arrière
    cameraRef.current.position.set(0, 9, 6); // (gauche/droite, hauteur, profondeur)

    // Orienter la caméra pour regarder vers le bas sur la zone de jeu
    cameraRef.current.lookAt(0, -5, 0); // Regarde vers un point légèrement sous le niveau des dés

    updateSceneSize();

    // Éclairage amélioré
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Plus lumineux
    sceneRef.current.add(ambientLight);

    // Lumière principale
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    sceneRef.current.add(mainLight);

    // Lumière d'appoint
    const fillLight = new THREE.PointLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -5);
    sceneRef.current.add(fillLight);

    // Lumière de rim pour l'effet dramatique
    const rimLight = new THREE.PointLight(0x266041, 0.4);
    rimLight.position.set(0, 2, -8);
    sceneRef.current.add(rimLight);

    createFloor();
    diceMeshRef.current = createDiceMesh();

    for (let i = 0; i < params.numberOfDice; i++) {
      const dice = createDice();
      diceArrayRef.current.push(dice);
      addDiceEvents(dice, i);
    }

    render();
  };

  const createFloor = () => {
    // Sol plus visible avec texture
    const floorGeometry = new THREE.PlaneGeometry(90, 40);
    const floorMaterial = new THREE.MeshLambertMaterial({
      color: 0x2a4d3a,
      transparent: true,
      opacity: 0.8,
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    floor.position.y = -3; // Sol légèrement plus haut pour être visible dans l'angle
    floor.quaternion.setFromAxisAngle(
      new THREE.Vector3(-1, 0, 0),
      Math.PI * 0.5
    );
    sceneRef.current.add(floor);

    const floorBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });
    floorBody.position.copy(floor.position);
    floorBody.quaternion.copy(floor.quaternion);
    physicsWorldRef.current.addBody(floorBody);
  };

  const createDiceMesh = () => {
    // Matériaux améliorés avec des couleurs plus attrayantes
    const boxMaterialOuter = new THREE.MeshStandardMaterial({
      color: 0xffffff, // Blanc pur pour les faces extérieures
      roughness: 0.1,
      metalness: 0.05,
    });

    const boxMaterialInner = new THREE.MeshStandardMaterial({
      color: 0x000000, // Noir pour les points
      roughness: 0.0, // Moins de rugosité pour plus de contraste
      metalness: 0.0, // Pas de métallique pour les points
      side: THREE.DoubleSide,
      transparent: false,
    });

    const diceMesh = new THREE.Group();
    const innerMesh = new THREE.Mesh(createInnerGeometry(), boxMaterialInner);
    const outerMesh = new THREE.Mesh(createBoxGeometry(), boxMaterialOuter);
    outerMesh.castShadow = true;
    outerMesh.receiveShadow = true;

    // S'assurer que les points sont rendus par-dessus avec un décalage Z plus important
    innerMesh.renderOrder = 2;

    // Légèrement décaler les points vers l'extérieur pour éviter le z-fighting
    innerMesh.position.set(0, 0, 0.001);

    diceMesh.add(outerMesh, innerMesh);

    return diceMesh;
  };

  const createDice = () => {
    const mesh = diceMeshRef.current.clone();

    // Augmenter la taille des dés (échelle 1.5x)
    mesh.scale.set(1.5, 1.5, 1.5);

    // Position initiale plus dispersée et aléatoire
    mesh.position.set(
      (Math.random() - 0.5) * 8, // Ajusté pour la nouvelle taille
      8 + Math.random() * 4,
      (Math.random() - 0.5) * 8 // Ajusté pour la nouvelle taille
    );

    // Rotation initiale aléatoire dès la création
    mesh.rotation.set(
      Math.random() * 2 * Math.PI,
      Math.random() * 2 * Math.PI,
      Math.random() * 2 * Math.PI
    );

    sceneRef.current.add(mesh);

    const body = new CANNON.Body({
      mass: 1,
      // Augmenter aussi la taille du body physique pour correspondre
      shape: new CANNON.Box(new CANNON.Vec3(0.75, 0.75, 0.75)), // 0.5 * 1.5 = 0.75
      sleepTimeLimit: 0.1,
    });
    body.position.copy(mesh.position);
    body.quaternion.copy(mesh.quaternion);
    physicsWorldRef.current.addBody(body);

    return { mesh, body };
  };

  const createBoxGeometry = () => {
    let boxGeometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      params.segments,
      params.segments,
      params.segments
    );
    const positionAttr = boxGeometry.attributes.position;
    const subCubeHalfSize = 0.5 - params.edgeRadius;

    for (let i = 0; i < positionAttr.count; i++) {
      let position = new THREE.Vector3().fromBufferAttribute(positionAttr, i);
      const subCube = new THREE.Vector3(
        Math.sign(position.x),
        Math.sign(position.y),
        Math.sign(position.z)
      ).multiplyScalar(subCubeHalfSize);
      const addition = new THREE.Vector3().subVectors(position, subCube);

      if (
        Math.abs(position.x) > subCubeHalfSize &&
        Math.abs(position.y) > subCubeHalfSize &&
        Math.abs(position.z) > subCubeHalfSize
      ) {
        addition.normalize().multiplyScalar(params.edgeRadius);
        position = subCube.add(addition);
      } else if (
        Math.abs(position.x) > subCubeHalfSize &&
        Math.abs(position.y) > subCubeHalfSize
      ) {
        addition.z = 0;
        addition.normalize().multiplyScalar(params.edgeRadius);
        position.x = subCube.x + addition.x;
        position.y = subCube.y + addition.y;
      } else if (
        Math.abs(position.x) > subCubeHalfSize &&
        Math.abs(position.z) > subCubeHalfSize
      ) {
        addition.y = 0;
        addition.normalize().multiplyScalar(params.edgeRadius);
        position.x = subCube.x + addition.x;
        position.z = subCube.z + addition.z;
      } else if (
        Math.abs(position.y) > subCubeHalfSize &&
        Math.abs(position.z) > subCubeHalfSize
      ) {
        addition.x = 0;
        addition.normalize().multiplyScalar(params.edgeRadius);
        position.y = subCube.y + addition.y;
        position.z = subCube.z + addition.z;
      }

      const notchWave = (v) => {
        v = (1 / params.notchRadius) * v;
        v = Math.PI * Math.max(-1, Math.min(1, v));
        return params.notchDepth * (Math.cos(v) + 1);
      };
      const notch = (pos) => notchWave(pos[0]) * notchWave(pos[1]);
      const offset = 0.23;

      if (position.y === 0.5) {
        position.y -= notch([position.x, position.z]);
      } else if (position.x === 0.5) {
        position.x -= notch([position.y + offset, position.z + offset]);
        position.x -= notch([position.y - offset, position.z - offset]);
      } else if (position.z === 0.5) {
        position.z -= notch([position.x - offset, position.y + offset]);
        position.z -= notch([position.x, position.y]);
        position.z -= notch([position.x + offset, position.y - offset]);
      } else if (position.z === -0.5) {
        position.z += notch([position.x + offset, position.y + offset]);
        position.z += notch([position.x + offset, position.y - offset]);
        position.z += notch([position.x - offset, position.y + offset]);
        position.z += notch([position.x - offset, position.y - offset]);
      } else if (position.x === -0.5) {
        position.x += notch([position.y + offset, position.z + offset]);
        position.x += notch([position.y + offset, position.z - offset]);
        position.x += notch([position.y, position.z]);
        position.x += notch([position.y - offset, position.z + offset]);
        position.x += notch([position.y - offset, position.z - offset]);
      } else if (position.y === -0.5) {
        position.y += notch([position.x + offset, position.z + offset]);
        position.y += notch([position.x + offset, position.z]);
        position.y += notch([position.x + offset, position.z - offset]);
        position.y += notch([position.x - offset, position.z + offset]);
        position.y += notch([position.x - offset, position.z]);
        position.y += notch([position.x - offset, position.z - offset]);
      }

      positionAttr.setXYZ(i, position.x, position.y, position.z);
    }

    boxGeometry.deleteAttribute("normal");
    boxGeometry.deleteAttribute("uv");
    boxGeometry = mergeVertices(boxGeometry);
    boxGeometry.computeVertexNormals();

    return boxGeometry;
  };

  const createInnerGeometry = () => {
    const baseGeometry = new THREE.PlaneGeometry(
      1 - 2 * params.edgeRadius,
      1 - 2 * params.edgeRadius
    );

    // Utiliser un offset fixe plus proche de la surface des encoches
    const offset = 0.49; // Plus proche de la surface

    return mergeBufferGeometries(
      [
        baseGeometry.clone().translate(0, 0, offset), // Face avant Z+ (1 point)
        baseGeometry.clone().translate(0, 0, -offset), // Face arrière Z- (4 points)
        baseGeometry
          .clone()
          .rotateX(0.5 * Math.PI)
          .translate(0, -offset, 0), // Face bas Y- (6 points)
        baseGeometry
          .clone()
          .rotateX(0.5 * Math.PI)
          .translate(0, offset, 0), // Face haut Y+ (4 points)
        baseGeometry
          .clone()
          .rotateY(0.5 * Math.PI)
          .translate(-offset, 0, 0), // Face gauche X- (5 points)
        baseGeometry
          .clone()
          .rotateY(0.5 * Math.PI)
          .translate(offset, 0, 0), // Face droite X+ (2 points)
      ],
      false
    );
  };

  const addDiceEvents = (dice, diceIndex) => {
    dice.body.addEventListener("sleep", (e) => {
      dice.body.allowSleep = false;

      const euler = new CANNON.Vec3();
      e.target.quaternion.toEuler(euler);

      const eps = 0.1;
      let isZero = (angle) => Math.abs(angle) < eps;
      let isHalfPi = (angle) => Math.abs(angle - 0.5 * Math.PI) < eps;
      let isMinusHalfPi = (angle) => Math.abs(0.5 * Math.PI + angle) < eps;
      let isPiOrMinusPi = (angle) =>
        Math.abs(Math.PI - angle) < eps || Math.abs(Math.PI + angle) < eps;

      let result = 0;
      if (isZero(euler.z)) {
        if (isZero(euler.x)) {
          result = 1;
        } else if (isHalfPi(euler.x)) {
          result = 4;
        } else if (isMinusHalfPi(euler.x)) {
          result = 3;
        } else if (isPiOrMinusPi(euler.x)) {
          result = 6;
        } else {
          dice.body.allowSleep = true;
          return;
        }
      } else if (isHalfPi(euler.z)) {
        result = 2;
      } else if (isMinusHalfPi(euler.z)) {
        result = 5;
      } else {
        dice.body.allowSleep = true;
        return;
      }

      if (result > 0 && onDiceRoll) {
        onDiceRoll(diceIndex, result);
      }
    });
  };

  const throwDice = () => {
    diceArrayRef.current.forEach((d, dIdx) => {
      if (keptDice[dIdx]) return;

      d.body.velocity.setZero();
      d.body.angularVelocity.setZero();

      // Position de départ ajustée pour les dés plus grands
      d.body.position = new CANNON.Vec3(
        (Math.random() - 0.5) * 7, // Légèrement réduit pour éviter la dispersion excessive
        8 + Math.random() * 4,
        (Math.random() - 0.5) * 6
      );
      d.mesh.position.copy(d.body.position);

      // ...reste du code inchangé...
      d.mesh.rotation.set(
        Math.random() * 4 * Math.PI,
        Math.random() * 4 * Math.PI,
        Math.random() * 4 * Math.PI
      );
      d.body.quaternion.copy(d.mesh.quaternion);

      const force = 3 + Math.random() * 4;

      d.body.applyImpulse(
        new CANNON.Vec3(
          (Math.random() - 0.5) * force * 0.8,
          -force * 0.6,
          (Math.random() - 0.5) * force * 0.6
        ),
        new CANNON.Vec3(0, 0, 0)
      );

      d.body.angularVelocity.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      );

      d.body.allowSleep = true;
    });
  };

  const render = () => {
    if (
      !physicsWorldRef.current ||
      !rendererRef.current ||
      !sceneRef.current ||
      !cameraRef.current
    )
      return;

    physicsWorldRef.current.fixedStep();

    for (const dice of diceArrayRef.current) {
      dice.mesh.position.copy(dice.body.position);
      dice.mesh.quaternion.copy(dice.body.quaternion);
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationIdRef.current = requestAnimationFrame(render);
  };

  const updateSceneSize = () => {
    if (!cameraRef.current || !rendererRef.current || !canvasRef.current)
      return;

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  };

  // Effects
  useEffect(() => {
    initPhysics();

    return () => {
      // Cleanup
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
      diceArrayRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (isReady) {
      initScene();
    }
  }, [isReady]);

  useEffect(() => {
    if (shouldRoll && isReady) {
      throwDice();
      if (onRollComplete) {
        onRollComplete();
      }
    }
  }, [shouldRoll, isReady, keptDice]);

  useEffect(() => {
    const handleResize = () => updateSceneSize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isReady) {
    return (
      <div
        style={{
          width: "100%",
          height: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4d4735 0%, #2a4d3a 100%)",
          color: "wheat",
          flexDirection: "column",
          gap: "15px",
          borderRadius: "10px",
          border: "2px solid #266041",
        }}
      >
        <div className="dice-3d-loading">
          <div
            className="spinner"
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid rgba(255, 255, 255, 0.3)",
              borderTop: "4px solid #266041",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <div>Chargement des dés 3D...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "250px",
        position: "relative",
        borderRadius: "10px",
        overflow: "hidden",
        border: "2px solid #266041",
        background: "linear-gradient(135deg, #4d4735 0%, #2a4d3a 100%)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "5px 10px",
          borderRadius: "5px",
          fontSize: "12px",
          fontFamily: "Georgia, serif",
        }}
      >
        🎲 Dés 3D - Yahtzee
      </div>
    </div>
  );
};

export default Dice3D;
