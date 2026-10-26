/**
 * SDM Rajaji Portfolio - 3D Interactive Futuristic Orb & Network Canvas
 * Renders a rotating 3D particle sphere, cybernetic orbital rings, and glowing connection lines.
 */

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, centerX, centerY;
  let animationFrameId;

  // Configuration
  const SPHERE_RADIUS = 135;
  const NUM_POINTS = 160;
  const ROTATION_SPEED_X = 0.003;
  const ROTATION_SPEED_Y = 0.005;

  let points = [];
  let angleX = 0;
  let angleY = 0;
  let targetAngleX = 0;
  let targetAngleY = 0;

  // Orbital Rings
  const rings = [
    { radiusX: 175, radiusY: 55, tilt: 25, speed: 0.008, angle: 0, color: 'rgba(0, 229, 212, 0.45)' },
    { radiusX: 200, radiusY: 70, tilt: -35, speed: -0.006, angle: Math.PI / 3, color: 'rgba(59, 130, 246, 0.4)' },
    { radiusX: 220, radiusY: 40, tilt: 65, speed: 0.005, angle: Math.PI, color: 'rgba(139, 92, 246, 0.35)' }
  ];

  // Mouse interaction
  let mouse = { x: 0, y: 0, isHovering: false };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    centerX = width / 2;
    centerY = height / 2;
  }

  // Initialize spherical fibonacci distribution of points
  function initPoints() {
    points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < NUM_POINTS; i++) {
      const y = 1 - (i / (NUM_POINTS - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({
        origX: x * SPHERE_RADIUS,
        origY: y * SPHERE_RADIUS,
        origZ: z * SPHERE_RADIUS,
        x: 0,
        y: 0,
        z: 0,
        size: Math.random() * 2 + 1.2
      });
    }
  }

  // Rotate point in 3D
  function rotatePoint(pt, ax, ay) {
    // Rotate around Y
    let cosY = Math.cos(ay);
    let sinY = Math.sin(ay);
    let x1 = pt.origX * cosY - pt.origZ * sinY;
    let z1 = pt.origZ * cosY + pt.origX * sinY;

    // Rotate around X
    let cosX = Math.cos(ax);
    let sinX = Math.sin(ax);
    let y2 = pt.origY * cosX - z1 * sinX;
    let z2 = z1 * cosX + pt.origY * sinX;

    pt.x = x1;
    pt.y = y2;
    pt.z = z2;
  }

  // Main render loop
  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Smooth mouse response (damping)
    angleX += (targetAngleX - angleX) * 0.05 + ROTATION_SPEED_X;
    angleY += (targetAngleY - angleY) * 0.05 + ROTATION_SPEED_Y;

    // Draw central ambient glow
    const coreGlow = ctx.createRadialGradient(
      centerX, centerY, 10,
      centerX, centerY, SPHERE_RADIUS * 1.4
    );
    coreGlow.addColorStop(0, 'rgba(0, 229, 212, 0.22)');
    coreGlow.addColorStop(0.5, 'rgba(59, 130, 246, 0.12)');
    coreGlow.addColorStop(1, 'rgba(8, 11, 18, 0)');

    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, SPHERE_RADIUS * 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Rotate and project points
    points.forEach(pt => rotatePoint(pt, angleX, angleY));

    // Sort by Z for proper depth shading
    points.sort((a, b) => a.z - b.z);

    // Draw connection filaments between close points
    ctx.lineWidth = 0.75;
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      // Only connect to nearby points
      for (let j = i + 1; j < points.length; j++) {
        const p2 = points[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dz = p1.z - p2.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < 2100) {
          const alpha = (1 - distSq / 2100) * 0.35 * ((p1.z + SPHERE_RADIUS) / (SPHERE_RADIUS * 2));
          if (alpha > 0.02) {
            ctx.strokeStyle = `rgba(0, 229, 212, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(centerX + p1.x, centerY + p1.y);
            ctx.lineTo(centerX + p2.x, centerY + p2.y);
            ctx.stroke();
          }
        }
      }
    }

    // Draw nodes
    points.forEach(pt => {
      const depthAlpha = (pt.z + SPHERE_RADIUS) / (SPHERE_RADIUS * 2); // 0 (back) to 1 (front)
      const alpha = Math.max(0.15, Math.min(1, depthAlpha * 0.9 + 0.1));
      const scale = (pt.z + SPHERE_RADIUS * 2) / (SPHERE_RADIUS * 2);
      const radius = pt.size * Math.max(0.6, scale);

      ctx.fillStyle = pt.z > 0 ? `rgba(0, 229, 212, ${alpha})` : `rgba(59, 130, 246, ${alpha * 0.7})`;
      ctx.beginPath();
      ctx.arc(centerX + pt.x, centerY + pt.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Front nodes get a small highlight glow
      if (pt.z > SPHERE_RADIUS * 0.5) {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(centerX + pt.x, centerY + pt.y, radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw orbital rings
    rings.forEach(ring => {
      ring.angle += ring.speed;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((ring.tilt * Math.PI) / 180);

      // Ring ellipse path
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.ellipse(0, 0, ring.radiusX, ring.radiusY, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Orbiting satellite node on the ring
      const satX = Math.cos(ring.angle) * ring.radiusX;
      const satY = Math.sin(ring.angle) * ring.radiusY;

      // Glow behind satellite
      ctx.fillStyle = 'rgba(0, 229, 212, 0.4)';
      ctx.beginPath();
      ctx.arc(satX, satY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Satellite core
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(satX, satY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    animationFrameId = requestAnimationFrame(draw);
  }

  // Mouse interactivity
  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      targetAngleY = normX * 1.5;
      targetAngleX = -normY * 1.5;
    } else {
      targetAngleX = 0;
      targetAngleY = 0;
    }
  });

  // Handle Resize
  window.addEventListener('resize', () => {
    resize();
    initPoints();
  });

  // Init
  resize();
  initPoints();
  draw();
})();
