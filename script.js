const canvas = document.getElementById("packetCanvas");

if (canvas) {
  const ctx = canvas.getContext("2d");
  const nodes = Array.from({ length: 34 }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0007,
    vy: (Math.random() - 0.5) * 0.0007
  }));

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width * window.devicePixelRatio));
    canvas.height = Math.max(1, Math.floor(rect.height * window.devicePixelRatio));
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function draw() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);

    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0.04 || node.x > 0.96) node.vx *= -1;
      if (node.y < 0.06 || node.y > 0.94) node.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = (a.x - b.x) * width;
        const dy = (a.y - b.y) * height;
        const distance = Math.hypot(dx, dy);
        if (distance < 170) {
          const alpha = (1 - distance / 170) * 0.32;
          ctx.strokeStyle = `rgba(74, 163, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x * width, a.y * height);
          ctx.lineTo(b.x * width, b.y * height);
          ctx.stroke();
        }
      }
    }

    nodes.forEach((node, index) => {
      const pulse = 1 + Math.sin(Date.now() / 700 + index) * 0.3;
      ctx.fillStyle = index % 4 === 0 ? "#3ff0ad" : "rgba(210, 236, 237, 0.72)";
      ctx.beginPath();
      ctx.arc(node.x * width, node.y * height, 2.4 * pulse, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}

const terminalFeed = document.getElementById("terminalFeed");
const terminalLines = [
  "$ tracepulse analyze tracepulse_master.log --cascade-aware",
  "[parse] 22 events accepted, 0 unparsed",
  "[timeline] UE 001: attach complete at 10:00:00.220",
  "[signal] repeated PRACH attempts detected",
  "[root-cause] RACH Failure: max preamble transmissions reached",
  "[ripple] recovery controller reject is downstream",
  "[ripple] service attach failure is downstream",
  "[action] inspect signal path, timing budget, configuration, and device state"
];

if (terminalFeed) {
  let index = 0;
  function writeLine() {
    terminalFeed.textContent = terminalLines.slice(0, index + 1).join("\n");
    index = (index + 1) % terminalLines.length;
    if (index === 0) {
      setTimeout(() => {
        terminalFeed.textContent = "";
        writeLine();
      }, 1300);
      return;
    }
    setTimeout(writeLine, 780);
  }
  writeLine();
}

document.querySelectorAll(".pillar-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    document.querySelectorAll(".pillar-card").forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
  });
});

const runDemo = document.getElementById("runDemo");
const analysisState = document.getElementById("analysisState");
const logFile = document.getElementById("logFile");

function markAnalyzed(label) {
  if (!analysisState) return;
  analysisState.textContent = label || "Analyzed";
  document.getElementById("parsedEvents").textContent = "22";
  document.getElementById("unparsedLines").textContent = "0";
  document.getElementById("failureEvents").textContent = "3";
}

if (runDemo) {
  runDemo.disabled = true;
}

if (logFile) {
  logFile.addEventListener("change", (event) => {
    const [file] = event.target.files;
    markAnalyzed(file ? file.name : "Analyzed");
  });
}

const contactAction = document.getElementById("contactAction");

if (contactAction) {
  const local = contactAction.dataset.local;
  const domain = contactAction.dataset.domain;
  const destination = `${local}@${domain}`;
  contactAction.href = `mailto:${destination}?subject=Apex%20Ultra%20Labs%20Inquiry`;
  contactAction.setAttribute("aria-label", "Email Apex Ultra Labs");
}
