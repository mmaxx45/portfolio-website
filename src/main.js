import { 
  createIcons, 
  Terminal, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Flame, 
  Server, 
  FolderGit2, 
  HelpCircle, 
  RotateCcw, 
  Activity, 
  Radio, 
  Settings, 
  User, 
  Hammer, 
  GraduationCap, 
  Coffee, 
  Moon, 
  CreditCard, 
  Sparkles, 
  MessageSquareOff, 
  Dices, 
  Scale, 
  Layers, 
  Code, 
  Wrench, 
  ExternalLink, 
  ShieldCheck, 
  X, 
  Check,
  Cpu,
  Pickaxe,
  Box
} from 'lucide';
import confetti from 'canvas-confetti';

import { config } from './config.js';
import { fetchServerStats } from './services/serverService.js';
import { fetchNaasReason } from './services/naasService.js';
import { projects } from './data/projects.js';
import { techStack } from './data/techStack.js';
import { generateJavaClassName } from './data/excuses.js';

// Setup Lucide icons
function initIcons() {
  createIcons({
    icons: {
      Terminal, 
      RefreshCw, 
      Volume2, 
      VolumeX, 
      Flame, 
      Server, 
      FolderGit2, 
      HelpCircle, 
      RotateCcw, 
      Activity, 
      Radio, 
      Settings, 
      User, 
      Hammer, 
      GraduationCap, 
      Coffee, 
      Moon, 
      CreditCard, 
      Sparkles, 
      MessageSquareOff, 
      Dices, 
      Scale, 
      Layers, 
      Code, 
      Wrench, 
      ExternalLink, 
      ShieldCheck, 
      X, 
      Check,
      Cpu,
      Pickaxe,
      Box
    }
  });
}

// -------------------------------------------------------------
// Sound Synthesis (Web Audio API - no external sound files required)
// -------------------------------------------------------------
let soundEnabled = true;
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  return audioCtx;
}

function playBeep(freq = 440, type = 'sine', duration = 0.08, volume = 0.1) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function playMinecraftDing() {
  if (!soundEnabled) return;
  playBeep(987.77, 'sine', 0.1, 0.15); // B5 (XP sound chime)
  setTimeout(() => playBeep(1318.51, 'sine', 0.15, 0.15), 60); // E6
}

function playRebootSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {}
}

// -------------------------------------------------------------
// Typing Animation (README & Minecraft quotes)
// -------------------------------------------------------------
const typingLines = [
  "Schreibe Java, wenn mir nichts Besseres einfällt...",
  "Zocke in meiner Freizeit gerne Minecraft...",
  "Baue Dinge, die keiner braucht – aber mit Leidenschaft.",
  "Debugge um 02:00 Uhr nachts warum mein Code eigentlich läuft...",
  "Kaufe neue Hetzner-Server für Projekte, die nie fertig werden...",
  "Autor des deutschen No-as-a-Service Forks (/nein)...",
  "Reboot und alles wird gut."
];

let lineIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typingText');

function typeLoop() {
  if (!typingElement) return;

  const currentLine = typingLines[lineIndex];

  if (isDeleting) {
    typingElement.textContent = currentLine.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = currentLine.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 30 : 65;

  if (!isDeleting && charIndex === currentLine.length) {
    delay = 2200; // Pause at end of line
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    lineIndex = (lineIndex + 1) % typingLines.length;
    delay = 400;
  }

  setTimeout(typeLoop, delay);
}

// -------------------------------------------------------------
// Live Server Cost Ticker
// -------------------------------------------------------------
let startTime = Date.now();
const costTickerEl = document.getElementById('costTicker');

function updateCostTicker() {
  if (!costTickerEl) return;
  const elapsedSeconds = (Date.now() - startTime) / 1000;
  const costPerSecond = config.profile.serverCostPerHour / 3600;
  const totalCost = (elapsedSeconds * costPerSecond).toFixed(4);
  costTickerEl.textContent = `${totalCost} €`;
  requestAnimationFrame(updateCostTicker);
}

// -------------------------------------------------------------
// Server Fleet Dashboard
// -------------------------------------------------------------
let currentServers = [];

async function renderServers() {
  const container = document.getElementById('serversGrid');
  if (!container) return;

  currentServers = await fetchServerStats();

  // Dynamically update top stats cards if present
  const totalRamEl = document.getElementById('totalRamStat');
  const dockerStatEl = document.getElementById('dockerContainersStat');
  const avgUptimeEl = document.getElementById('avgUptimeStat');

  if (currentServers.length > 0) {
    const totalRamUsed = currentServers.reduce((sum, s) => sum + (s.ramUsedGB || 0), 0);
    const totalRamCap = currentServers.reduce((sum, s) => sum + (s.ramTotalGB || 0), 0);
    const totalContainers = currentServers.reduce((sum, s) => sum + (s.containersCount || 0), 0);
    const avgUptime = Math.round(currentServers.reduce((sum, s) => sum + (s.uptimeDays || 0), 0) / currentServers.length);

    if (totalRamEl) {
      totalRamEl.textContent = `~${totalRamUsed.toFixed(1)} GB / ${totalRamCap} GB`;
    }
    if (dockerStatEl) {
      dockerStatEl.textContent = `${totalContainers} Container (${totalContainers - 2} Idle / 2 Aktiv)`;
    }
    if (avgUptimeEl) {
      avgUptimeEl.textContent = `${avgUptime}+ Tage`;
    }
  }

  container.innerHTML = currentServers.map(server => {
    const isUp = server.status === 'up';
    const statusColor = isUp ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    const statusDot = isUp ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-amber-400 shadow-[0_0_8px_#f59e0b]';

    return `
      <div class="rounded-xl bg-[#0f1422] border border-slate-800 p-5 hover:border-slate-700 transition relative overflow-hidden group">
        
        <!-- Header -->
        <div class="flex items-start justify-between gap-2 mb-3">
          <div>
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full ${statusDot} shrink-0"></span>
              <h3 class="font-mono font-bold text-slate-100 text-sm sm:text-base">${server.role}</h3>
            </div>
            <div class="text-xs text-slate-400 font-mono mt-0.5">${server.name} • <span class="text-slate-500">${server.location}</span></div>
          </div>

          <div class="px-2.5 py-1 rounded-full text-xs font-mono border ${statusColor} shrink-0">
            ${server.uptimePercent}% Uptime
          </div>
        </div>

        <!-- Metric Bars -->
        <div class="space-y-3 py-3 border-y border-slate-800/80 my-3 text-xs font-mono">
          
          <!-- CPU -->
          <div>
            <div class="flex justify-between text-slate-400 mb-1">
              <span>CPU Auslastung</span>
              <span class="text-slate-200 font-bold">${server.cpuPercent}%</span>
            </div>
            <div class="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700" style="width: ${server.cpuPercent}%"></div>
            </div>
          </div>

          <!-- RAM -->
          <div>
            <div class="flex justify-between text-slate-400 mb-1">
              <span>RAM Verbrauch</span>
              <span class="text-amber-300 font-bold">${server.ramPercent}%</span>
            </div>
            <div class="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700" style="width: ${server.ramPercent}%"></div>
            </div>
            <div class="text-[10px] text-slate-500 mt-0.5 truncate">${server.ramDetail}</div>
          </div>

          <!-- Storage / Uptime -->
          <div class="flex justify-between pt-1 text-slate-400">
            <span class="flex items-center space-x-1">
              <i data-lucide="hard-drive" class="w-3 text-cyan-400"></i>
              <span>Disk: <strong class="text-cyan-300">${server.storageDetail || (server.storagePercent + '%')}</strong></span>
            </span>
            <span>Uptime: <strong class="text-slate-300">${server.uptimeDays}d</strong></span>
          </div>

        </div>

        <!-- Honest Note -->
        <div class="p-2.5 rounded bg-slate-950/70 border border-slate-800/60 text-xs font-mono text-slate-300 flex items-start space-x-2">
          <span class="text-amber-400">💡</span>
          <span class="italic text-[11px] leading-relaxed">${server.honestNote}</span>
        </div>

        <!-- Badges -->
        <div class="flex flex-wrap gap-1.5 mt-3">
          ${server.badges.map(b => `<span class="px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 text-[10px] font-mono border border-slate-700/50">${b}</span>`).join('')}
        </div>
      </div>
    `;
  }).join('');

  initIcons();
}

// Ping Fleet Button
const pingFleetBtn = document.getElementById('pingFleetBtn');
const pingBtnText = document.getElementById('pingBtnText');

if (pingFleetBtn) {
  pingFleetBtn.addEventListener('click', async () => {
    playBeep(600, 'triangle', 0.1);
    if (pingBtnText) pingBtnText.textContent = 'Pinge alle Nodes...';
    pingFleetBtn.classList.add('animate-pulse');

    setTimeout(async () => {
      await renderServers();
      if (pingBtnText) pingBtnText.textContent = 'Fleet aktualisiert! ⚡';
      pingFleetBtn.classList.remove('animate-pulse');
      playBeep(880, 'sine', 0.15);

      setTimeout(() => {
        if (pingBtnText) pingBtnText.textContent = 'Ping Fleet';
      }, 2000);
    }, 600);
  });
}

// -------------------------------------------------------------
// Docker Container Deployer Clicker
// -------------------------------------------------------------
let containersCount = 0;
let ramMB = 0;
const deployContainerBtn = document.getElementById('deployContainerBtn');
const containersDeployedEl = document.getElementById('containersDeployed');
const ramAllocatedEl = document.getElementById('ramAllocated');

if (deployContainerBtn) {
  deployContainerBtn.addEventListener('click', () => {
    containersCount++;
    ramMB += Math.floor(Math.random() * 256) + 128; // 128MB - 384MB
    playBeep(440 + (containersCount % 12) * 40, 'sine', 0.05, 0.08);

    if (containersCount % 10 === 0) {
      playBeep(880, 'triangle', 0.15, 0.2);
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 }
      });
    }

    if (containersDeployedEl) containersDeployedEl.textContent = `${containersCount}`;
    if (ramAllocatedEl) ramAllocatedEl.textContent = `${ramMB} MB 🚀`;
  });
}

// -------------------------------------------------------------
// No-as-a-Service (NaaS German Fork) Live API Client
// -------------------------------------------------------------
let currentNaasLang = 'de';
const excuseBox = document.getElementById('excuseBox');
const newExcuseBtn = document.getElementById('newExcuseBtn');
const naasSourceLabel = document.getElementById('naasSourceLabel');
const naasLangDe = document.getElementById('naasLangDe');
const naasLangEn = document.getElementById('naasLangEn');
const naasLiveBadge = document.getElementById('naasLiveBadge');

async function triggerFetchExcuse() {
  playBeep(520, 'sine', 0.08);
  if (excuseBox) excuseBox.style.opacity = '0.4';

  const result = await fetchNaasReason(null, currentNaasLang);

  if (excuseBox) {
    excuseBox.textContent = `"${result.reason}"`;
    excuseBox.style.opacity = '1';
  }

  if (naasSourceLabel) {
    if (result.source === 'live') {
      naasSourceLabel.textContent = `Quelle: NaaS Live API (/${currentNaasLang === 'de' ? 'nein' : 'no'})`;
      if (naasLiveBadge) {
        naasLiveBadge.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400';
        naasLiveBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span>NaaS Live API aktiv</span>';
      }
    } else {
      naasSourceLabel.textContent = 'Quelle: Offline Pool (Fallback)';
      if (naasLiveBadge) {
        naasLiveBadge.className = 'inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400';
        naasLiveBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400"></span><span>NaaS Offline Pool</span>';
      }
    }
  }
}

if (newExcuseBtn) {
  newExcuseBtn.addEventListener('click', triggerFetchExcuse);
}

if (naasLangDe) {
  naasLangDe.addEventListener('click', () => {
    currentNaasLang = 'de';
    naasLangDe.className = 'px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40';
    if (naasLangEn) naasLangEn.className = 'px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 hover:text-white';
    triggerFetchExcuse();
  });
}

if (naasLangEn) {
  naasLangEn.addEventListener('click', () => {
    currentNaasLang = 'en';
    naasLangEn.className = 'px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40';
    if (naasLangDe) naasLangDe.className = 'px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 hover:text-white';
    triggerFetchExcuse();
  });
}

// -------------------------------------------------------------
// Java Factory Generator & Freedom Converter
// -------------------------------------------------------------
const javaClassBox = document.getElementById('javaClassBox');
const newJavaClassBtn = document.getElementById('newJavaClassBtn');

if (newJavaClassBtn && javaClassBox) {
  newJavaClassBtn.addEventListener('click', () => {
    playBeep(700, 'triangle', 0.08);
    const newName = generateJavaClassName();
    javaClassBox.textContent = newName;
  });
}

const meterInput = document.getElementById('meterInput');
const freedomResult = document.getElementById('freedomResult');

function updateFreedomConverter() {
  if (!meterInput || !freedomResult) return;
  const meters = parseFloat(meterInput.value) || 0;
  
  const footballFields = (meters / 91.44).toFixed(2);
  const washingMachines = (meters / 0.6).toFixed(1);
  const bananas = (meters / 0.18).toFixed(1);

  freedomResult.innerHTML = `
    <div>🏈 <strong>${footballFields}</strong> Football-Feldern</div>
    <div>🧺 <strong>${washingMachines}</strong> Waschmaschinen</div>
    <div>🍌 <strong>${bananas}</strong> Bananen</div>
  `;
}

if (meterInput) {
  meterInput.addEventListener('input', updateFreedomConverter);
}

// -------------------------------------------------------------
// Render Languages & Tools
// -------------------------------------------------------------
function renderTechStack() {
  const langGrid = document.getElementById('languagesGrid');
  const toolsGrid = document.getElementById('toolsGrid');

  if (langGrid) {
    langGrid.innerHTML = techStack.languages.map(lang => `
      <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition group flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-slate-200 font-mono text-base group-hover:text-amber-300 transition-colors">${lang.name}</h4>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">${lang.level}</span>
          </div>
          <p class="text-xs text-slate-400 mt-1 leading-relaxed">"${lang.honestQuote}"</p>
        </div>
        <div class="text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-2.5 mt-3">
          ${lang.stats}
        </div>
      </div>
    `).join('');
  }

  if (toolsGrid) {
    toolsGrid.innerHTML = techStack.tools.map(tool => `
      <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition group flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-slate-200 font-mono text-sm group-hover:text-cyan-300 transition-colors">${tool.name}</h4>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">${tool.badge}</span>
          </div>
          <p class="text-xs text-slate-400 mt-1 leading-relaxed">${tool.honestNote}</p>
        </div>
        <div class="text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-2 mt-3">
          Kategorie: ${tool.category}
        </div>
      </div>
    `).join('');
  }
}

// -------------------------------------------------------------
// Render Projects
// -------------------------------------------------------------
function renderProjects() {
  const container = document.getElementById('projectsGrid');
  if (!container) return;

  container.innerHTML = projects.map(proj => `
    <div class="rounded-xl bg-[#0f1422] border border-slate-800 p-5 hover:border-slate-700 transition flex flex-col justify-between group">
      <div>
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="font-bold text-slate-100 text-lg group-hover:text-amber-400 transition-colors font-mono">
            ${proj.name}
          </h3>
          <a href="${proj.url}" target="_blank" rel="noopener noreferrer" class="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition" title="GitHub Repository">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
        </div>

        <p class="text-xs text-slate-300 mb-3 leading-relaxed">
          ${proj.description}
        </p>

        <div class="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs font-mono text-amber-300/90 italic mb-4">
          💬 "${proj.honestComment}"
        </div>

        <!-- Tech tags -->
        <div class="flex flex-wrap gap-1.5 mb-4">
          ${proj.tech.map(t => `<span class="px-2 py-0.5 rounded bg-slate-800/70 text-slate-300 text-[10px] font-mono border border-slate-700/50">${t}</span>`).join('')}
        </div>
      </div>

      <!-- Metrics Footer -->
      <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
        <div>Sinnhaftigkeit: <span class="text-amber-400 font-bold">${proj.metrics.sinn}</span></div>
        <div class="text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">${proj.status}</div>
      </div>
    </div>
  `).join('');
}

// -------------------------------------------------------------
// Interactive CLI Terminal
// -------------------------------------------------------------
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');
const clearTerminalBtn = document.getElementById('clearTerminalBtn');

const commandHistory = [];
let historyIndex = -1;

function appendTerminalLine(html) {
  if (!terminalOutput) return;
  const line = document.createElement('div');
  line.innerHTML = html;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

const commands = {
  help: () => `
    <div class="text-slate-300 space-y-1">
      <div>Verfügbare Befehle:</div>
      <div>  <span class="text-emerald-400 font-bold">lab</span>            - Zeigt mein Homelab & Self-Host Stack</div>
      <div>  <span class="text-emerald-400 font-bold">minecraft</span>       - Zeigt mein Minecraft Profile</div>
      <div>  <span class="text-amber-400 font-bold">naas</span>            - Holt eine Live-Ausrede vom No-as-a-Service Fork (/nein)</div>
      <div>  <span class="text-amber-400 font-bold">server / servers</span> - Zeigt den aktuellen Status aller Server-Nodes</div>
      <div>  <span class="text-amber-400 font-bold">projects</span>        - Listet alle Repositories auf</div>
      <div>  <span class="text-amber-400 font-bold">stack</span>           - Zeigt den Tech Stack</div>
      <div>  <span class="text-amber-400 font-bold">coffee</span>          - Kocht virtuellen Espresso für die JVM</div>
      <div>  <span class="text-amber-400 font-bold">reboot</span>          - Führt den Notfall-Reboot aus</div>
      <div>  <span class="text-amber-400 font-bold">whoami</span>          - Wer bin ich?</div>
      <div>  <span class="text-amber-400 font-bold">clear</span>           - Leert das Terminal</div>
      <div>  <span class="text-amber-400 font-bold">hire</span>            - Zeigt meine Kontaktdaten für den Personaler</div>
    </div>
  `,
  lab: () => `
    <div class="text-emerald-300 space-y-1">
      <div>🚀 <strong>Mein Homelab & Self-Host Stack:</strong></div>
      <div>  • Nodes: 9 aktive VPS & Bare-Metal Server</div>
      <div>  • Monitoring: Beszel Hub (monitor.spaghetti.wtf)</div>
      <div>  • Services: Zipline, Gitea, Mail, Caddy Edge, Garage S3</div>
    </div>
  `,
  minecraft: () => `
    <div class="text-emerald-300 space-y-1">
      <div>⛏️ <strong>Mein Minecraft Profile:</strong></div>
      <div>  • Modpack: All the Mods 10 Sky (NeoForge 1.21.1)</div>
      <div>  • Server: PaperMC Dedicated Game Node</div>
      <div>  • Status: Zocke ich in der Freizeit extrem gerne!</div>
      <div>  • Versuche: <span class="text-amber-400">/gamemode creative</span> oder <span class="text-amber-400">/give coffee 64</span></div>
    </div>
  `,
  '/gamemode creative': () => {
    playMinecraftDing();
    return `<div class="text-emerald-400 font-bold">🎮 [Server]: Spielmodus wurde auf KREATIV gesetzt. Unendlich viel Server-RAM und Hetzner-Budget verfügbar!</div>`;
  },
  '/give coffee 64': () => {
    playBeep(1000, 'triangle', 0.2);
    return `<div class="text-amber-400">☕ [Inventory]: 64x Starker Espresso hinzugefügt. JVM Garbage Collection pausiert bis morgen früh.</div>`;
  },
  naas: async () => {
    const res = await fetchNaasReason(null, 'de');
    return `<div class="text-amber-300">❌ <strong>No-as-a-Service German Fork (${res.source}):</strong> "${res.reason}"</div>`;
  },
  whoami: () => `
    <div class="text-slate-300">
      Ich bin Max (@mmaxx45) - Hobby Entwickler mit zu viel Zeit, aber zu wenig Ideen.<br/>
      Lieblingsbeschäftigung: Server mieten, Java-Boilerplate, Minecraft zocken & um 2 Uhr nachts debuggen.
    </div>
  `,
  motto: () => `
    <div class="text-amber-300 space-y-1">
      <div>> "It doesn't work. I don't know why."</div>
      <div>> "It works. I don't know why."</div>
      <div>> "Reboot und alles wird gut."</div>
    </div>
  `,
  server: async () => {
    const serverList = (currentServers && currentServers.length > 0)
      ? currentServers
      : await fetchServerStats();

    if (!serverList || serverList.length === 0) {
      return `<div class="text-red-400">Keine Serverdaten verfügbar.</div>`;
    }

    const lines = serverList.map(s => {
      const isUp = s.status === 'up';
      const isWarn = s.status === 'warning';
      const tag = isUp ? '[OK]' : (isWarn ? '[WARN]' : '[DOWN]');
      const colorClass = isUp ? 'text-emerald-400' : (isWarn ? 'text-amber-400' : 'text-red-400');
      const pingText = s.pingMs !== undefined ? ` | Ping ${s.pingMs}ms` : '';
      const uptimeText = s.uptimePercent !== undefined ? ` | Uptime ${s.uptimePercent}%` : (s.uptimeDays ? ` | Uptime ${s.uptimeDays}d` : '');
      const cpuText = s.cpuPercent !== undefined ? `CPU ${s.cpuPercent}%` : '';
      const ramText = s.ramPercent !== undefined ? `RAM ${s.ramPercent}%` : '';
      const diskText = s.storageDetail || (s.storagePercent !== undefined ? `Disk ${s.storagePercent}%` : '');
      const locationText = s.location && s.location !== 'Unknown' ? `<span class="text-cyan-400">[${s.location}]</span> ` : '';
      const metrics = [cpuText, ramText, diskText].filter(Boolean).join(' | ');

      return `<div><span class="${colorClass} font-bold">${tag}</span> ${locationText}<span class="text-slate-200">${s.name}</span> <span class="text-slate-400">- ${metrics}${pingText}${uptimeText}</span></div>`;
    });

    const isBeszel = config.provider === 'beszel' || config.useBeszel;
    const isKuma = config.provider === 'kuma' || config.useUptimeKuma;
    const header = isBeszel
      ? `<div class="text-xs text-emerald-400 mb-1">● Live-Status via Beszel Hub (monitor.spaghetti.wtf, ${serverList.length} Nodes):</div>`
      : (isKuma
        ? `<div class="text-xs text-emerald-400 mb-1">● Live-Status via Uptime Kuma API (${serverList.length} Nodes):</div>`
        : `<div class="text-xs text-cyan-300 mb-1">⚡ Server Fleet Status:</div>`);

    return `
      <div class="space-y-1 font-mono text-xs sm:text-sm">
        ${header}
        ${lines.join('')}
      </div>
    `;
  },
  servers: async () => commands.server(),
  status: async () => commands.server(),
  nodes: async () => commands.server(),
  fleet: async () => commands.server(),
  projects: () => `
    <div class="text-slate-300 space-y-1">
      ${projects.map(p => `<div>• <strong class="text-amber-400">${p.name}</strong> - ${p.description}</div>`).join('')}
    </div>
  `,
  stack: () => `
    <div class="text-slate-300">
      Sprachen: Java, Python, HTML5, CSS3<br/>
      Tools: Debian 12, Docker, Caddy, NeoForge, PaperMC, Gradle, PostgreSQL, Git
    </div>
  `,
  coffee: () => {
    playBeep(880, 'sine', 0.2);
    return `
      <div class="text-amber-400 font-mono">
        ☕ 1x frischer Espresso serviert! Java Virtual Machine Garbage Collector beruhigt sich.
      </div>
    `;
  },
  sudo: () => `
    <div class="text-red-400">
      [sudo] guest is not in the sudoers file. This incident will be reported to Debian.
    </div>
  `,
  reboot: () => {
    triggerRebootSequence();
    return `<div class="text-red-400 font-bold">Initiating Emergency Reboot Sequence...</div>`;
  },
  clear: () => {
    if (terminalOutput) terminalOutput.innerHTML = '';
    return '';
  },
  hire: () => `
    <div class="text-amber-400 font-mono">
      Meine Kontaktdaten:<br>
      <br>
      Name: Max Lehrke<br>
      E-Mail: <a href="mailto:portfolio@spaghetti.wtf">portfolio@spaghetti.wtf</a><br>
      E-Mails werden stündlich gecheckt.
    </div>
  `,
};

async function handleTerminalSubmit(cmdText) {
  const cleanCmd = cmdText.trim();
  const lower = cleanCmd.toLowerCase();
  if (!cleanCmd) return;

  commandHistory.push(cmdText);
  historyIndex = commandHistory.length;

  appendTerminalLine(`<div class="text-slate-400"><span class="text-emerald-400 font-bold">guest@max:~$</span> ${cmdText}</div>`);

  if (commands[lower] || commands[cleanCmd]) {
    const handler = commands[lower] || commands[cleanCmd];
    const result = typeof handler === 'function' ? await handler() : handler;
    if (result) appendTerminalLine(result);
  } else {
    appendTerminalLine(`<div class="text-red-400">Befehl nicht gefunden: '${cleanCmd}'. Tippe <span class="text-emerald-400">help</span> für Optionen.</div>`);
  }

  playBeep(400, 'square', 0.04, 0.05);
}

if (terminalInput) {
  terminalInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      await handleTerminalSubmit(val);
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });
}

if (clearTerminalBtn) {
  clearTerminalBtn.addEventListener('click', () => {
    if (terminalOutput) terminalOutput.innerHTML = '';
  });
}

// -------------------------------------------------------------
// Emergency Reboot CRT Glitch Sequence
// -------------------------------------------------------------
const rebootBtn = document.getElementById('rebootBtn');
const rebootOverlay = document.getElementById('rebootOverlay');
const rebootLogsEl = document.getElementById('rebootTerminalLogs');

const kernelBootLogs = [
  "[  0.000000] Linux version 6.6.0-debian-amd64 (max@debian) (gcc 12.2.0)",
  "[  0.084120] Command line: BOOT_IMAGE=/vmlinuz-6.6.0-debian root=UUID=7f8e9a2b quiet",
  "[  0.192340] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'",
  "[  0.310920] RAM Check: 16384 MB total, 14200 MB reserved for Java JVM & Minecraft",
  "[  0.520110] ACPI: Core revision 20230628",
  "[  0.740200] Initializing Docker Engine daemon...",
  "[  0.920150] Spawning 27 idle containers (and 2 actually useful ones)...",
  "[  1.104200] Initializing Caddy Edge Gateway Reverse Proxy (Auto TLS)...",
  "[  1.320100] Applying motto: 'Reboot und alles wird gut'...",
  "[  1.580210] Restoring memory state & flushing coffee reservoirs...",
  "[  1.890000] System state restored. Everything is fine now."
];

function triggerRebootSequence() {
  playRebootSound();

  if (!rebootOverlay || !rebootLogsEl) return;
  rebootLogsEl.innerHTML = '';
  rebootOverlay.classList.remove('hidden');
  rebootOverlay.classList.add('flex', 'animate-crt-on');

  let logIdx = 0;
  const logInterval = setInterval(() => {
    if (logIdx < kernelBootLogs.length) {
      const p = document.createElement('div');
      p.textContent = kernelBootLogs[logIdx];
      rebootLogsEl.appendChild(p);
      playBeep(300 + logIdx * 40, 'sine', 0.03, 0.05);
      logIdx++;
    } else {
      clearInterval(logInterval);
      setTimeout(() => {
        rebootOverlay.classList.remove('animate-crt-on');
        rebootOverlay.classList.add('animate-crt-off');
        
        setTimeout(() => {
          rebootOverlay.classList.add('hidden');
          rebootOverlay.classList.remove('flex', 'animate-crt-off');
          
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
          playBeep(1000, 'sine', 0.2);
        }, 500);
      }, 800);
    }
  }, 130);
}

if (rebootBtn) {
  rebootBtn.addEventListener('click', triggerRebootSequence);
}

// -------------------------------------------------------------
// Sound Toggle
// -------------------------------------------------------------
const soundToggleBtn = document.getElementById('soundToggleBtn');

if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      playBeep(600, 'sine', 0.1);
      soundToggleBtn.classList.remove('text-slate-600');
      soundToggleBtn.classList.add('text-slate-400');
    } else {
      soundToggleBtn.classList.add('text-slate-600');
      soundToggleBtn.classList.remove('text-slate-400');
    }
  });
}

// -------------------------------------------------------------
// Init on DOM ready
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  typeLoop();
  updateCostTicker();
  renderServers();
  renderTechStack();
  renderProjects();
  initIcons();

  // Initial NaaS fetch
  triggerFetchExcuse();

  // Live polling for server stats (every 15s to show live dynamic behavior)
  setInterval(() => {
    renderServers();
  }, 15000);
});
