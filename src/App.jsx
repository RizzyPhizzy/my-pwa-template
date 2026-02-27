import { useState, useEffect, useRef, useCallback } from "react";

// ─── Word Dictionary ───
const WORDS = new Set([
  "a","i","am","an","as","at","be","by","do","go","he","hi","if","in","is","it","me","my","no","of","oh","ok","on","or","so","to","up","us","we",
  "ace","act","add","age","ago","aid","aim","air","all","and","ant","any","ape","arc","are","ark","arm","art","ask","ate","awe","axe",
  "bad","bag","ban","bar","bat","bay","bed","bee","bet","big","bin","bit","bog","bow","box","boy","bud","bug","bun","bus","but","buy",
  "cab","can","cap","car","cat","cob","cod","cog","cop","cow","cry","cub","cup","cur","cut",
  "dad","dam","day","den","dew","did","dig","dim","dip","doe","dog","dot","dry","dub","dud","due","dug","duo","dye",
  "ear","eat","eel","egg","ego","elm","emu","end","era","eve","ewe","eye",
  "fan","far","fat","fax","fed","fee","few","fig","fin","fir","fit","fix","fly","foe","fog","for","fox","fry","fun","fur",
  "gag","gal","gap","gas","gel","gem","get","gig","gin","god","got","gum","gun","gut","guy","gym",
  "had","ham","has","hat","hay","hen","her","hid","him","hip","his","hit","hob","hog","hop","hot","how","hub","hue","hug","hum","hut",
  "ice","icy","ill","imp","ink","inn","ion","ire","irk","ivy",
  "jab","jam","jar","jaw","jay","jet","jig","job","jog","jot","joy","jug","jut",
  "keg","key","kid","kin","kit",
  "lab","lad","lag","lap","law","lay","led","leg","let","lid","lie","lip","lit","log","lot","low","lug",
  "mad","man","map","mar","mat","max","may","men","met","mid","mix","mob","mod","mop","mow","mud","mug","mum",
  "nab","nag","nap","net","new","nil","nip","nit","nod","nor","not","now","nub","nun","nut",
  "oak","oar","oat","odd","ode","off","oft","oil","old","one","opt","orb","ore","our","out","owe","owl","own",
  "pad","pal","pan","par","pat","paw","pay","pea","peg","pen","pep","per","pet","pew","pie","pig","pin","pit","ply","pod","pop","pot","pro","pry","pub","pug","pun","pup","put",
  "rag","ram","ran","rap","rat","raw","ray","red","ref","rib","rid","rig","rim","rip","rob","rod","rot","row","rub","rug","rum","run","rut","rye",
  "sad","sag","sap","sat","saw","say","sea","set","sew","she","shy","sin","sip","sir","sit","six","ski","sky","sly","sob","sod","son","sow","soy","spa","spy","sty","sub","sue","sum","sun","sup",
  "tab","tad","tag","tan","tap","tar","tax","tea","ten","the","thy","tie","tin","tip","toe","ton","too","top","tot","tow","toy","try","tub","tug","two",
  "urn","use","van","vat","vet","via","vie","vow",
  "wad","wag","war","was","wax","way","web","wed","wet","who","why","wig","win","wit","woe","wok","won","woo","wow",
  "yak","yam","yap","yea","yes","yet","yew","you","zap","zen","zig","zip","zoo",
  "ball","bear","bird","blue","boat","book","cake","call","came","card","care","cast","cave","cold","come","cook","cool",
  "dark","dear","deep","deer","dish","done","door","down","draw","drop","drum","duck","dust",
  "each","earn","ease","east","easy","edge","else","even","ever","evil","exit","face","fact","fair","fake","fall","fame","farm","fast","fate","fear","feed","feel","fell","file","fill","film","find","fine","fire","firm","fish","five","flag","flat","flew","flip","flow","foam","fold","folk","food","fool","foot","form","fort","four","free","frog","from","fuel","full","fund",
  "game","gang","gate","gave","gear","gift","girl","give","glad","glow","glue","goal","goat","goes","gold","golf","gone","good","grab","gray","grew","grin","grip","grow",
  "hack","half","hall","hand","hang","hard","harm","hate","have","head","heal","hear","heat","held","help","here","hero","hide","high","hike","hill","hint","hold","hole","home","hood","hook","hope","horn","host","hour","huge","hung","hunt","hurt",
  "idea","iron","item","jack","jail","jazz","joke","jump","jury","just","keen","keep","kick","kill","kind","king","kiss","kite","knee","knew","knot","know",
  "lack","lake","lamb","lamp","land","lane","last","late","lawn","lazy","lead","leaf","lean","leap","left","lend","less","life","lift","like","lime","line","link","lion","list","live","load","loan","lock","long","look","loop","lord","lose","loss","lost","loud","love","luck","lump","lung",
  "made","mail","main","make","male","mall","many","mark","mask","mate","maze","meal","mean","meat","meet","melt","menu","mess","mild","milk","mill","mind","mine","miss","mode","mood","moon","more","most","move","much","must",
  "nail","name","navy","near","neat","neck","need","nest","news","next","nice","nine","node","none","noon","nose","note",
  "once","only","onto","open","over","pace","pack","page","paid","pain","pair","palm","park","part","pass","past","path","peak","pick","pile","pine","pink","pipe","plan","play","plot","plug","plus","poem","pole","pond","pool","poor","port","pose","post","pour","pull","pump","pure","push",
  "race","rack","rage","raid","rail","rain","rank","rare","rate","read","real","rent","rest","rich","ride","ring","rise","risk","road","roam","rock","rode","role","roll","roof","room","root","rope","rose","rude","ruin","rule","rush",
  "safe","said","sail","sake","sale","salt","same","sand","sang","save","seal","seat","seed","seek","seem","seen","self","sell","send","sent","ship","shop","shot","show","shut","sick","side","sign","silk","sing","sink","site","size","skin","skip","slam","slap","slip","slow","snap","snow","soap","sock","sofa","soft","soil","sold","sole","some","song","soon","sort","soul","soup","spin","spot","star","stay","stem","step","stir","stop","suit","sure","swim",
  "tail","take","tale","talk","tall","tank","tape","task","team","tear","tell","tend","tent","term","test","text","than","that","them","then","they","thin","this","tick","tide","till","time","tiny","tire","toad","told","tone","took","tool","tops","torn","tour","town","trap","tree","trim","trip","true","tube","tune","turn","twin","type",
  "unit","upon","urge","used","user","vary","vast","verb","very","view","vine","void","vote",
  "wade","wage","wait","wake","walk","wall","want","warm","warn","wash","wave","weak","wear","weed","week","well","went","were","west","what","when","wide","wife","wild","will","wind","wine","wing","wire","wise","wish","with","woke","wolf","wood","wool","word","wore","work","worm","worn","wrap",
  "yard","yarn","year","yell","your","zero","zone","zoom"
]);

// ─── Constants ───
const COLORS = [
  "#FF4444","#FF8C00","#FFD700","#32CD32","#1E90FF","#8A2BE2","#FF69B4","#FF1493","#40E0D0","#8B4513","#222222","#FFFFFF",
  "#FFB6C1","#E6E6FA","#87CEEB","#98FB98","#FFDAB9","#FFFACD","#DAA520","#C0C0C0","#FF7F50","#000080","#228B22","#808080",
];

const BRUSHES = [
  { id: "crayon", icon: "🖍️", label: "Crayon" },
  { id: "marker", icon: "🖊️", label: "Marker" },
  { id: "sparkle", icon: "✨", label: "Sparkle" },
  { id: "rainbow", icon: "🌈", label: "Rainbow" },
  { id: "glow", icon: "💡", label: "Glow" },
  { id: "spray", icon: "🎨", label: "Spray" },
];

const SHAPES = [
  { id: "circle", s: "●" },{ id: "square", s: "■" },{ id: "triangle", s: "▲" },
  { id: "star", s: "★" },{ id: "heart", s: "♥" },{ id: "diamond", s: "◆" },
  { id: "moon", s: "☽" },{ id: "cloud", s: "☁" },{ id: "bolt", s: "⚡" },
  { id: "flower", s: "✿" },{ id: "burst", s: "💥" },{ id: "bubble", s: "💬" },
];

const STICKER_TABS = [
  { id: "creatures", label: "Creatures", icon: "🤪", items: ["😈","👾","👹","👻","🤖","💀","🎃","👽"] },
  { id: "animals", label: "Animals", icon: "🐾", items: ["🐱","🐶","🐰","🦕","🐉","🦄","🦋","🐙","🐧","🦊"] },
  { id: "faces", label: "Faces", icon: "😊", items: ["😊","😜","😍","😮","😴","🤔","🥳","😎"] },
  { id: "effects", label: "Effects", icon: "⭐", items: ["⭐","✨","💖","🎊","⚡","🔥","❄️","🫧","🎵","👑"] },
  { id: "food", label: "Food", icon: "🍕", items: ["🍕","🍦","🍪","🍩","🧁","🍎","🍌","🍔","🍭","🍉"] },
];

const NUMBERS = "0123456789".split("");
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const BACKGROUNDS = [
  { id: "paper", label: "📝", bg: "#FFF8F0", dk: false },
  { id: "chalk", label: "🖤", bg: "#2D4A3E", dk: true },
  { id: "space", label: "🌌", bg: "#0B0E2D", dk: true },
  { id: "sunset", label: "🌅", bg: "linear-gradient(180deg,#FF9A56,#FF6B9D 50%,#A855F7)", dk: false },
  { id: "ocean", label: "🌊", bg: "linear-gradient(180deg,#1A6B8A,#0E4D5E)", dk: true },
  { id: "candy", label: "🍬", bg: "linear-gradient(135deg,#FDE7F3,#FBCFE8 50%,#F9A8D4)", dk: false },
  { id: "grass", label: "🌿", bg: "linear-gradient(180deg,#87CEEB 0%,#87CEEB 55%,#4ADE80 55%)", dk: false },
  { id: "white", label: "⬜", bg: "#FFFFFF", dk: false },
];

const MOVEMENTS = [
  { id: "bounce", icon: "🏀", label: "Bounce" },
  { id: "wander", icon: "🚶", label: "Wander" },
  { id: "zoom", icon: "🚀", label: "Zoom" },
  { id: "shake", icon: "📳", label: "Shake" },
  { id: "float", icon: "🎈", label: "Float" },
  { id: "spin", icon: "🌪️", label: "Spin" },
  { id: "zigzag", icon: "⚡", label: "Zigzag" },
  { id: "orbit", icon: "🪐", label: "Orbit" },
];

const INTERACTIONS = [
  { id: "chomp", icon: "😋", label: "Chomp" },
  { id: "explode", icon: "💥", label: "Explode" },
  { id: "bonk", icon: "💫", label: "Bonk" },
  { id: "eat", icon: "👄", label: "Eat" },
  { id: "fling", icon: "🤾", label: "Fling" },
  { id: "grow", icon: "🫧", label: "Grow" },
  { id: "shrink", icon: "🫠", label: "Shrink" },
  { id: "trail", icon: "🎨", label: "Trail" },
  { id: "freeze", icon: "🥶", label: "Freeze" },
  { id: "clone", icon: "🪞", label: "Clone" },
];

// Chaos presets — curated combos optimised for funny outcomes
const CHAOS_PRESETS = [
  { name: "🍕 Food Fight!", desc: "Food everywhere, flinging and bonking",
    stickers: ["🍕","🍦","🍩","🍔","🧁","🍪","🍭","🍌","🍎","🍉","🍕","🍦"],
    moves: ["bounce","zoom","bounce","zigzag","bounce","wander","zoom","bounce","zigzag","bounce","zoom","wander"],
    inters: ["fling","bonk","fling","bonk","explode","bonk","fling","eat","bonk","fling","bonk","explode"] },
  { name: "👻 Monster Mash!", desc: "Creatures chasing, eating, exploding",
    stickers: ["😈","👾","👹","👻","🤖","💀","👽","🎃","😈","👾","👹","👻","🤖","💀"],
    moves: ["zoom","bounce","wander","zigzag","zoom","bounce","wander","bounce","zoom","zigzag","bounce","wander","zoom","bounce"],
    inters: ["eat","bonk","fling","explode","eat","freeze","bonk","fling","eat","explode","bonk","fling","eat","bonk"] },
  { name: "🌟 Sparkle Storm!", desc: "Stars, hearts and sparkles everywhere",
    stickers: ["⭐","✨","💖","🌟","💫","❤️‍🔥","🎊","👑","⭐","✨","💖","🌟"],
    moves: ["float","orbit","bounce","float","wander","spin","float","orbit","bounce","float","wander","spin"],
    inters: ["trail","clone","bonk","trail","grow","bonk","trail","clone","bonk","trail","grow","explode"] },
  { name: "🐾 Animal Stampede!", desc: "Animals zooming and bonking around",
    stickers: ["🐱","🐶","🐰","🦕","🐉","🦄","🦋","🐙","🐧","🦊","🐱","🐶","🦕","🐉"],
    moves: ["zoom","bounce","zigzag","wander","zoom","bounce","zigzag","wander","zoom","bounce","zigzag","wander","zoom","bounce"],
    inters: ["bonk","fling","bonk","eat","fling","bonk","bonk","fling","bonk","eat","fling","bonk","bonk","fling"] },
  { name: "🔢 Math Mayhem!", desc: "Numbers adding up everywhere",
    stickers: ["1","2","3","4","5","6","7","8","9","1","2","3","4","5"],
    moves: ["bounce","zoom","bounce","zigzag","bounce","wander","zoom","bounce","zigzag","bounce","zoom","wander","bounce","zoom"],
    inters: [null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    type: "number" },
  { name: "🔤 Word Tornado!", desc: "Letters smashing into words",
    stickers: ["C","A","T","D","O","G","B","U","S","H","E","N","P","I"],
    moves: ["bounce","zoom","bounce","zigzag","bounce","wander","zoom","bounce","zigzag","bounce","zoom","wander","bounce","zoom"],
    inters: [null,null,null,null,null,null,null,null,null,null,null,null,null,null],
    type: "letter" },
];

let _uid = 0;
const uid = () => `o${++_uid}`;
const pick = (arr) => arr[Math.random() * arr.length | 0];
const checkWord = (s) => s.length >= 2 && WORDS.has(s.toLowerCase());
const speak = (t) => { if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(t); u.rate = 0.85; u.pitch = 1.3; speechSynthesis.speak(u); }};

// ─── Main ───
export default function CreatureCanvas() {
  const [mode, setMode] = useState("draw");
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const [brushType, setBrushType] = useState("crayon");
  const [color, setColor] = useState("#222222");
  const [brushSize, setBrushSize] = useState(6);
  const [drawTool, setDrawTool] = useState("brush");
  const [moreColors, setMoreColors] = useState(false);

  const [objects, setObjects] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [shapeColor, setShapeColor] = useState("#FF4444");
  const [stickerTab, setStickerTab] = useState(0);
  const [letterSub, setLetterSub] = useState("letters");
  const [bgIdx, setBgIdx] = useState(0);
  const [showBg, setShowBg] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [showChaos, setShowChaos] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [gallery, setGallery] = useState([]);

  const [particles, setParticles] = useState([]);
  const [popups, setPopups] = useState([]);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const drawing = useRef(false);
  const lastPt = useRef(null);
  const hueR = useRef(0);
  const undos = useRef([]);
  const redos = useRef([]);
  const animRef = useRef(null);
  const bounds = useRef({ w: 800, h: 600 });
  const playRef = useRef(false);
  const speedRef = useRef(1);
  const dragId = useRef(null);
  const dragOff = useRef({ x: 0, y: 0 });
  const cloneT = useRef({});

  useEffect(() => { playRef.current = playing; }, [playing]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const bg = BACKGROUNDS[bgIdx];
  const dk = bg.dk;

  // Load gallery from storage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cc_gallery") || "[]");
      setGallery(saved);
    } catch(e) {}
  }, []);

  const saveGallery = (g) => {
    setGallery(g);
    try { localStorage.setItem("cc_gallery", JSON.stringify(g)); } catch(e) {}
  };

  // Canvas setup
  useEffect(() => {
    const resize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      bounds.current = { w: r.width, h: r.height };
      const c = canvasRef.current;
      // Preserve existing drawing
      const temp = document.createElement("canvas");
      temp.width = c.width; temp.height = c.height;
      temp.getContext("2d").drawImage(c, 0, 0);
      c.width = r.width * 2; c.height = r.height * 2;
      const ctx = c.getContext("2d");
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      ctx.drawImage(temp, 0, 0, temp.width / 2, temp.height / 2);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ─── Drawing ───
  const saveState = () => {
    const c = canvasRef.current; if (!c) return;
    undos.current.push(c.toDataURL());
    if (undos.current.length > 50) undos.current.shift();
    redos.current = [];
  };

  const restore = (url) => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    const img = new Image();
    img.onload = () => { ctx.clearRect(0, 0, c.width, c.height); ctx.save(); ctx.setTransform(2, 0, 0, 2, 0, 0); ctx.drawImage(img, 0, 0, c.width / 2, c.height / 2); ctx.restore(); };
    img.src = url;
  };

  const undo = () => { if (!undos.current.length) return; const c = canvasRef.current; redos.current.push(c.toDataURL()); restore(undos.current.pop()); };
  const redo = () => { if (!redos.current.length) return; const c = canvasRef.current; undos.current.push(c.toDataURL()); restore(redos.current.pop()); };

  const getP = (e) => {
    const c = canvasRef.current; const r = c.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (cx - r.left) * (c.width / r.width / 2), y: (cy - r.top) * (c.height / r.height / 2) };
  };

  const onDown = useCallback((e) => {
    if (mode !== "draw" || playing) return;
    saveState(); drawing.current = true; lastPt.current = getP(e);
  }, [mode, playing]);

  const onMove = useCallback((e) => {
    if (!drawing.current || mode !== "draw") return;
    const c = canvasRef.current; const ctx = c.getContext("2d");
    const p = getP(e); const lp = lastPt.current;
    ctx.lineCap = "round"; ctx.lineJoin = "round";

    if (drawTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out"; ctx.lineWidth = brushSize * 2.5;
      ctx.beginPath(); ctx.moveTo(lp.x, lp.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    } else if (brushType === "rainbow") {
      hueR.current = (hueR.current + 3) % 360;
      ctx.strokeStyle = `hsl(${hueR.current},85%,55%)`; ctx.lineWidth = brushSize;
      ctx.beginPath(); ctx.moveTo(lp.x, lp.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    } else if (brushType === "glow") {
      ctx.shadowColor = color; ctx.shadowBlur = brushSize * 2;
      ctx.strokeStyle = color; ctx.lineWidth = brushSize * 0.6;
      ctx.beginPath(); ctx.moveTo(lp.x, lp.y); ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.shadowBlur = 0;
    } else if (brushType === "spray") {
      for (let i = 0; i < brushSize * 3; i++) {
        const a = Math.random() * Math.PI * 2; const r = Math.random() * brushSize * 1.5;
        ctx.fillStyle = color; ctx.globalAlpha = 0.3 + Math.random() * 0.5;
        ctx.fillRect(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r, 1.5, 1.5);
      } ctx.globalAlpha = 1;
    } else if (brushType === "sparkle") {
      ctx.strokeStyle = color; ctx.lineWidth = brushSize * 0.7;
      ctx.beginPath(); ctx.moveTo(lp.x, lp.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = ["#FFD700","#FF69B4","#87CEEB","#FFF"][Math.random() * 4 | 0];
        ctx.globalAlpha = 0.6 + Math.random() * 0.4;
        ctx.beginPath(); ctx.arc(p.x + (Math.random() - .5) * brushSize * 3, p.y + (Math.random() - .5) * brushSize * 3, 1 + Math.random() * 3, 0, Math.PI * 2); ctx.fill();
      } ctx.globalAlpha = 1;
    } else if (brushType === "marker") {
      ctx.globalAlpha = 0.7; ctx.strokeStyle = color; ctx.lineWidth = brushSize;
      ctx.beginPath(); ctx.moveTo(lp.x, lp.y); ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.globalAlpha = 1;
    } else {
      ctx.globalAlpha = 0.85; ctx.strokeStyle = color; ctx.lineWidth = brushSize;
      ctx.beginPath(); ctx.moveTo(lp.x, lp.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      for (let i = 0; i < 2; i++) { ctx.fillStyle = color; ctx.globalAlpha = 0.15; ctx.fillRect(p.x + (Math.random() - .5) * brushSize, p.y + (Math.random() - .5) * brushSize, 1, 1); }
      ctx.globalAlpha = 1;
    }
    lastPt.current = p;
  }, [mode, drawTool, color, brushSize, brushType]);

  const onUp = useCallback(() => { drawing.current = false; }, []);

  const clearAll = () => {
    saveState();
    const c = canvasRef.current; if (c) c.getContext("2d").clearRect(0, 0, c.width, c.height);
    setObjects([]); setSelectedIds(new Set()); setParticles([]); setPopups([]);
  };

  // ─── Add object ───
  const addObj = (type, data) => {
    const b = bounds.current;
    const o = { id: uid(), type, ...data, x: 50 + Math.random() * (b.w - 100), y: 50 + Math.random() * (b.h - 100),
      sz: 48, rot: 0, movement: null, interaction: null, vx: 0, vy: 0, ox: 0, oy: 0, ang: 0, frozen: false, ft: 0, dead: false, gs: 1, chain: null };
    o.ox = o.x; o.oy = o.y;
    setObjects(p => [...p, o]);
    return o;
  };

  // ─── Animate all randomly ───
  const animateAllRandom = () => {
    setObjects(prev => prev.map(o => ({
      ...o,
      movement: pick(MOVEMENTS).id,
      interaction: pick(INTERACTIONS).id,
    })));
  };

  // ─── Chaos preset ───
  const launchChaos = (preset) => {
    if (playing) togglePlay();
    clearAll();
    const b = bounds.current;
    const newObjs = preset.stickers.map((s, i) => ({
      id: uid(),
      type: preset.type === "number" ? "number" : preset.type === "letter" ? "letter" : "sticker",
      emoji: preset.type ? undefined : s,
      value: preset.type ? s : undefined,
      display: preset.type ? s : undefined,
      x: 40 + Math.random() * (b.w - 80),
      y: 40 + Math.random() * (b.h - 80),
      sz: 48, rot: 0,
      movement: preset.moves[i],
      interaction: preset.inters[i],
      vx: 0, vy: 0, ox: 0, oy: 0, ang: 0, frozen: false, ft: 0, dead: false, gs: 1, chain: null,
    }));
    newObjs.forEach(o => { o.ox = o.x; o.oy = o.y; });
    setObjects(newObjs);
    setShowChaos(false);
    // Auto-play after a beat
    setTimeout(() => {
      playRef.current = true;
      setPlaying(true);
      startAnimation(newObjs);
    }, 300);
  };

  // ─── Selection ───
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const applyToSelected = (field, value) => {
    setObjects(prev => prev.map(o =>
      selectedIds.has(o.id) ? { ...o, [field]: o[field] === value ? null : value } : o
    ));
  };

  // ─── Object dragging ───
  const onObjDown = (e, obj) => {
    if (playing) return;
    e.stopPropagation(); e.preventDefault();
    if (mode === "animate") {
      toggleSelect(obj.id);
      return;
    }
    setSelectedIds(new Set([obj.id]));
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    const cr = containerRef.current.getBoundingClientRect();
    dragOff.current = { x: cx - cr.left - obj.x, y: cy - cr.top - obj.y };
    dragId.current = obj.id;
  };

  useEffect(() => {
    const mv = (e) => {
      if (!dragId.current || playing) return;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      const cr = containerRef.current.getBoundingClientRect();
      setObjects(p => p.map(o => o.id === dragId.current ? { ...o, x: cx - cr.left - dragOff.current.x, y: cy - cr.top - dragOff.current.y, ox: cx - cr.left - dragOff.current.x, oy: cy - cr.top - dragOff.current.y } : o));
    };
    const up = () => { dragId.current = null; };
    window.addEventListener("mousemove", mv); window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", mv, { passive: false }); window.addEventListener("touchend", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); window.removeEventListener("touchmove", mv); window.removeEventListener("touchend", up); };
  }, [playing]);

  // ─── Play / Animation ───
  const startAnimation = (initialObjs) => {
    const objs = initialObjs || objects;
    setObjects(objs.map(o => {
      let vx = 0, vy = 0;
      const s = o.movement === "zoom" ? 5 : 2.5;
      if (["bounce","zoom","zigzag"].includes(o.movement)) { const a = Math.random() * Math.PI * 2; vx = Math.cos(a) * s; vy = Math.sin(a) * s; }
      else if (o.movement === "wander") { vx = (Math.random() - .5) * 1.5; vy = (Math.random() - .5) * 1.5; }
      else if (o.movement === "float") { vy = -1.5; vx = (Math.random() - .5) * .5; }
      return { ...o, vx, vy, ox: o.x, oy: o.y, ang: 0, dead: false, frozen: false, gs: 1, chain: null, display: o.type === "letter" ? o.value : o.type === "number" ? o.value : undefined };
    }));

    const tick = () => {
      if (!playRef.current) return;
      setObjects(prev => {
        const B = bounds.current; const sp = speedRef.current;
        let objs = prev.map(o => {
          if (o.dead) return o;
          if (o.frozen) { const ft = o.ft - 16; return ft <= 0 ? { ...o, frozen: false, ft: 0 } : { ...o, ft }; }
          let { x, y, vx, vy, ang, gs } = o;
          if (["bounce","zoom","wander"].includes(o.movement)) {
            x += vx * sp; y += vy * sp;
            if (x < 5 || x > B.w - 55) { vx = -vx; x = Math.max(5, Math.min(B.w - 55, x)); }
            if (y < 5 || y > B.h - 55) { vy = -vy; y = Math.max(5, Math.min(B.h - 55, y)); }
            if (o.movement === "wander" && Math.random() < .02) { vx += (Math.random() - .5) * .6; vy += (Math.random() - .5) * .6; vx = Math.max(-2, Math.min(2, vx)); vy = Math.max(-2, Math.min(2, vy)); }
          } else if (o.movement === "shake") { x = o.ox + (Math.random() - .5) * 10 * sp; y = o.oy + (Math.random() - .5) * 10 * sp; }
          else if (o.movement === "float") { x += vx * sp; y += vy * sp; if (y < -50) y = B.h + 10; if (x < 5 || x > B.w - 55) vx = -vx; }
          else if (o.movement === "spin") { ang = (ang + 6 * sp) % 360; }
          else if (o.movement === "orbit") { ang = (ang + 2.5 * sp) % 360; const r = ang * Math.PI / 180; x = o.ox + Math.cos(r) * 70; y = o.oy + Math.sin(r) * 70; }
          else if (o.movement === "zigzag") { x += vx * sp; y += vy * sp; if (x < 5 || x > B.w - 55) { vx = -vx; vy = (Math.random() - .5) * 4; } if (y < 5 || y > B.h - 55) vy = -vy; }
          if (o.interaction === "grow") { gs = Math.min(gs + .006 * sp, 3); if (gs >= 3) gs = 1; }
          else if (o.interaction === "shrink") { gs = Math.max(gs - .006 * sp, .2); if (gs <= .2) gs = 1; }
          return { ...o, x, y, vx, vy, ang, gs };
        });

        // Trails
        const c = canvasRef.current;
        if (c) {
          const ctx = c.getContext("2d");
          objs.forEach(o => {
            if (o.interaction === "trail" && o.movement && !o.dead && !o.frozen) {
              ctx.fillStyle = o.color || "#FF69B4"; ctx.globalAlpha = 0.6;
              ctx.beginPath(); ctx.arc(o.x * 2 + o.sz, o.y * 2 + o.sz, 4, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
            }
          });
        }

        // Collisions
        for (let i = 0; i < objs.length; i++) {
          for (let j = i + 1; j < objs.length; j++) {
            const a = objs[i], b = objs[j];
            if (a.dead || b.dead || a.frozen || b.frozen || (!a.movement && !b.movement)) continue;
            const dx = (a.x + a.sz / 2) - (b.x + b.sz / 2), dy = (a.y + a.sz / 2) - (b.y + b.sz / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist >= (a.sz * (a.gs || 1) + b.sz * (b.gs || 1)) / 2) continue;

            if (a.type === "number" && b.type === "number") {
              const sum = parseInt(a.value) + parseInt(b.value);
              setPopups(p => [...p, { id: uid(), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, text: `${a.value} + ${b.value} = ${sum}`, color: "#F97316", t: 2500 }]);
              if (soundOn) speak(`${a.value} plus ${b.value} equals ${sum}`);
              objs[i] = { ...a, value: String(sum), display: String(sum) }; objs[j] = { ...b, dead: true }; continue;
            }
            if (a.type === "letter" && b.type === "letter") {
              const c1 = (a.chain || a.value) + (b.chain || b.value);
              const c2 = (b.chain || b.value) + (a.chain || a.value);
              const word = checkWord(c1) ? c1 : checkWord(c2) ? c2 : null;
              if (word) {
                const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
                setPopups(p => [...p, { id: uid(), x: cx, y: cy, text: word.toUpperCase() + "!", color: "#059669", t: 3000 }]);
                if (soundOn) speak(word);
                objs[i] = { ...a, dead: true }; objs[j] = { ...b, dead: true };
                setParticles(p => [...p, ...Array.from({ length: 14 }, () => ({ id: uid(), x: cx + 24, y: cy + 24, vx: (Math.random() - .5) * 7, vy: (Math.random() - .5) * 7 - 2, c: COLORS[Math.random() * 12 | 0], life: 55 }))]);
              } else { objs[i] = { ...a, chain: c1, display: c1 }; objs[j] = { ...b, dead: true }; }
              continue;
            }
            const nx = dist > 0 ? dx / dist : 1, ny = dist > 0 ? dy / dist : 0;
            if (a.interaction === "bonk" || b.interaction === "bonk") {
              objs[i] = { ...a, vx: a.vx + nx * 3.5, vy: a.vy + ny * 3.5 }; objs[j] = { ...b, vx: b.vx - nx * 3.5, vy: b.vy - ny * 3.5 };
              setParticles(p => [...p, { id: uid(), x: (a.x + b.x) / 2 + 24, y: (a.y + b.y) / 2 + 24, vx: 0, vy: -1, emoji: "💫", life: 25 }]);
            }
            if (a.interaction === "eat" && b.sz * (b.gs || 1) < a.sz * (a.gs || 1)) { objs[j] = { ...b, dead: true }; objs[i] = { ...a, gs: (a.gs || 1) + .15 }; }
            else if (b.interaction === "eat" && a.sz * (a.gs || 1) < b.sz * (b.gs || 1)) { objs[i] = { ...a, dead: true }; objs[j] = { ...b, gs: (b.gs || 1) + .15 }; }
            if (a.interaction === "fling") objs[j] = { ...b, vx: -nx * 9, vy: -ny * 9 };
            else if (b.interaction === "fling") objs[i] = { ...a, vx: nx * 9, vy: ny * 9 };
            if (a.interaction === "freeze" && !b.frozen) objs[j] = { ...b, frozen: true, ft: 3000 };
            else if (b.interaction === "freeze" && !a.frozen) objs[i] = { ...a, frozen: true, ft: 3000 };
            if (a.interaction === "explode") { objs[i] = { ...a, dead: true }; setParticles(p => [...p, ...Array.from({ length: 16 }, () => ({ id: uid(), x: a.x + 24, y: a.y + 24, vx: (Math.random() - .5) * 9, vy: (Math.random() - .5) * 9, c: COLORS[Math.random() * 12 | 0], life: 40 }))]); }
            if (b.interaction === "explode") { objs[j] = { ...b, dead: true }; setParticles(p => [...p, ...Array.from({ length: 16 }, () => ({ id: uid(), x: b.x + 24, y: b.y + 24, vx: (Math.random() - .5) * 9, vy: (Math.random() - .5) * 9, c: COLORS[Math.random() * 12 | 0], life: 40 }))]); }
          }
        }

        // Clone
        const clones = [];
        objs.forEach(o => {
          if (o.interaction === "clone" && !o.dead && !o.frozen && o.movement) {
            if (!cloneT.current[o.id]) cloneT.current[o.id] = 0;
            cloneT.current[o.id] += 16;
            if (cloneT.current[o.id] > 2000 && objs.filter(x => !x.dead).length < 40) {
              cloneT.current[o.id] = 0;
              clones.push({ ...o, id: uid(), x: o.x + (Math.random() - .5) * 60, y: o.y + (Math.random() - .5) * 60, vx: (Math.random() - .5) * 3, vy: (Math.random() - .5) * 3, interaction: null, ox: o.x, oy: o.y });
            }
          }
        });
        return [...objs.filter(o => !o.dead), ...clones];
      });
      setParticles(p => p.map(x => ({ ...x, x: x.x + (x.vx || 0), y: x.y + (x.vy || 0), vy: (x.vy || 0) + .15, life: x.life - 1 })).filter(x => x.life > 0));
      setPopups(p => p.map(x => ({ ...x, t: x.t - 16 })).filter(x => x.t > 0));
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  };

  const togglePlay = () => {
    if (playing) {
      setPlaying(false); playRef.current = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      setParticles([]); cloneT.current = {};
      setObjects(p => p.map(o => ({ ...o, x: o.ox, y: o.oy, ang: 0, frozen: false, gs: 1, chain: null,
        display: o.type === "letter" ? o.value : o.type === "number" ? o.value : undefined })));
    } else {
      setPlaying(true); playRef.current = true;
      setSelectedIds(new Set());
      startAnimation();
    }
  };

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current); }, []);

  // ─── Save / Gallery ───
  const saveCanvas = () => {
    const c = canvasRef.current; if (!c) return;
    const thumb = document.createElement("canvas");
    thumb.width = 160; thumb.height = 120;
    thumb.getContext("2d").drawImage(c, 0, 0, 160, 120);
    const entry = {
      id: Date.now(),
      thumb: thumb.toDataURL("image/jpeg", 0.6),
      drawing: c.toDataURL("image/png"),
      objects: objects.map(o => ({ ...o, vx: 0, vy: 0 })),
      bg: bgIdx,
      date: new Date().toLocaleDateString(),
    };
    const next = [entry, ...gallery].slice(0, 20);
    saveGallery(next);
    setPopups(p => [...p, { id: uid(), x: bounds.current.w / 2 - 40, y: bounds.current.h / 2 - 30, text: "Saved! 📸", color: "#22C55E", t: 1500 }]);
  };

  const loadSave = (entry) => {
    setBgIdx(entry.bg);
    setObjects(entry.objects);
    const img = new Image();
    img.onload = () => {
      const c = canvasRef.current; if (!c) return;
      const ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.save(); ctx.setTransform(2, 0, 0, 2, 0, 0);
      ctx.drawImage(img, 0, 0, c.width / 2, c.height / 2);
      ctx.restore();
    };
    img.src = entry.drawing;
    setShowGallery(false);
  };

  const deleteSave = (id) => {
    saveGallery(gallery.filter(g => g.id !== id));
  };

  // ─── Styles ───
  const chip = (on) => ({
    background: on ? "linear-gradient(135deg,#FF6B9D,#A855F7)" : dk ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.05)",
    border: "none", borderRadius: 12, padding: "7px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer",
    fontFamily: "'Nunito',sans-serif", color: on ? "#fff" : dk ? "#ccc" : "#555", whiteSpace: "nowrap",
    boxShadow: on ? "0 3px 10px rgba(168,85,247,.3)" : "none", transition: "all .15s",
  });

  const panelS = {
    padding: "10px 14px 8px", background: dk ? "rgba(0,0,0,.45)" : "rgba(255,255,255,.88)",
    backdropFilter: "blur(12px)", borderTop: dk ? "1px solid rgba(255,255,255,.06)" : "1px solid rgba(0,0,0,.05)",
    maxHeight: 220, overflowY: "auto", flexShrink: 0,
  };

  const topBtn = {
    background: dk ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.05)", border: "none", borderRadius: 12,
    width: 34, height: 34, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  };

  const modeBtn = (on) => ({
    flex: 1, background: on ? "linear-gradient(135deg,#FF6B9D,#A855F7)" : dk ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.04)",
    border: "none", borderRadius: 16, padding: "7px 2px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0,
    cursor: "pointer", color: on ? "#fff" : dk ? "#aaa" : "#666", fontFamily: "'Nunito',sans-serif",
    boxShadow: on ? "0 4px 12px rgba(168,85,247,.3)" : "none", transition: "all .15s",
  });

  // Selected object for animate panel
  const selCount = selectedIds.size;
  const firstSel = selCount > 0 ? objects.find(o => selectedIds.has(o.id)) : null;

  // ─── Tool Panels ───
  const Panel = () => {
    if (playing) return null;
    if (mode === "draw") return (
      <div style={panelS}>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
          {BRUSHES.map(b => <button key={b.id} onClick={() => { setBrushType(b.id); setDrawTool("brush"); }} style={chip(brushType === b.id && drawTool === "brush")}>{b.icon} {b.label}</button>)}
          <button onClick={() => setDrawTool("eraser")} style={chip(drawTool === "eraser")}>🧹 Eraser</button>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
          {COLORS.slice(0, moreColors ? 24 : 12).map((c, i) => (
            <button key={i} onClick={() => { setColor(c); setDrawTool("brush"); }} style={{
              width: 28, height: 28, borderRadius: 9, border: color === c && drawTool === "brush" ? "3px solid #333" : `2px solid ${c === "#FFFFFF" ? "#ccc" : "transparent"}`,
              background: c, cursor: "pointer", transform: color === c ? "scale(1.15)" : "scale(1)", transition: "transform .15s",
            }} />
          ))}
          <button onClick={() => setMoreColors(!moreColors)} style={{ width: 28, height: 28, borderRadius: 9, border: "2px dashed #ccc", background: dk ? "#333" : "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#888" }}>{moreColors ? "−" : "+"}</button>
        </div>
        {/* SIZE SLIDER BAR */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: dk ? "#999" : "#888", flexShrink: 0 }}>Size</span>
          <div style={{ flex: 1, position: "relative", height: 32, display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", left: 0, right: 0, height: 8, borderRadius: 4, background: dk ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.08)" }} />
            <div style={{ position: "absolute", left: 0, width: `${((brushSize - 1) / 39) * 100}%`, height: 8, borderRadius: 4, background: "linear-gradient(90deg,#FF6B9D,#A855F7)" }} />
            <input type="range" min="1" max="40" value={brushSize} onChange={e => setBrushSize(Number(e.target.value))}
              style={{ position: "absolute", left: 0, right: 0, width: "100%", height: 32, opacity: 0, cursor: "pointer", zIndex: 2 }} />
            <div style={{
              position: "absolute", left: `calc(${((brushSize - 1) / 39) * 100}% - 14px)`, width: 28, height: 28, borderRadius: 14,
              background: "linear-gradient(135deg,#FF6B9D,#A855F7)", border: "3px solid white",
              boxShadow: "0 2px 8px rgba(168,85,247,.35)", pointerEvents: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ width: Math.max(4, brushSize * 0.5), height: Math.max(4, brushSize * 0.5), borderRadius: "50%", background: "white" }} />
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: dk ? "#aaa" : "#666", width: 24, textAlign: "right", flexShrink: 0 }}>{brushSize}</span>
        </div>
      </div>
    );

    if (mode === "shapes") return (
      <div style={panelS}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
          {COLORS.slice(0, 12).map((c, i) => <button key={i} onClick={() => setShapeColor(c)} style={{ width: 24, height: 24, borderRadius: 7, border: shapeColor === c ? "3px solid #333" : "2px solid transparent", background: c, cursor: "pointer" }} />)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 5 }}>
          {SHAPES.map(s => <button key={s.id} onClick={() => addObj("shape", { shapeType: s.id, symbol: s.s, color: shapeColor })} style={{ background: dk ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.03)", border: "none", borderRadius: 13, padding: "10px 0", cursor: "pointer", fontSize: 24 }}><span style={{ color: shapeColor }}>{s.s}</span></button>)}
        </div>
      </div>
    );

    if (mode === "stickers") return (
      <div style={panelS}>
        <div style={{ display: "flex", gap: 4, marginBottom: 8, overflowX: "auto" }}>
          {STICKER_TABS.map((t, i) => <button key={t.id} onClick={() => setStickerTab(i)} style={chip(stickerTab === i)}>{t.icon} {t.label}</button>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 5 }}>
          {STICKER_TABS[stickerTab].items.map((s, i) => <button key={i} onClick={() => addObj("sticker", { emoji: s })} style={{ background: dk ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.02)", border: "none", borderRadius: 13, padding: 7, fontSize: 30, cursor: "pointer" }}>{s}</button>)}
        </div>
      </div>
    );

    if (mode === "letters") return (
      <div style={panelS}>
        <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
          <button onClick={() => setLetterSub("letters")} style={chip(letterSub === "letters")}>🔤 Letters</button>
          <button onClick={() => setLetterSub("numbers")} style={chip(letterSub === "numbers")}>🔢 Numbers</button>
        </div>
        <p style={{ fontSize: 11, color: dk ? "#9CA3AF" : "#888", marginBottom: 6, fontWeight: 600 }}>
          {letterSub === "numbers" ? "Numbers ADD UP when they collide! 🧮" : "Letters make WORDS when they collide! 📖"}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${letterSub === "numbers" ? 5 : 7},1fr)`, gap: 4 }}>
          {(letterSub === "numbers" ? NUMBERS : LETTERS).map(ch => (
            <button key={ch} onClick={() => addObj(letterSub === "numbers" ? "number" : "letter", { value: ch, display: ch })}
              style={{ background: letterSub === "numbers" ? "linear-gradient(135deg,#FBBF24,#F97316)" : "linear-gradient(135deg,#34D399,#059669)", border: "none", borderRadius: 11, padding: "7px 0", fontSize: 18, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "'Nunito',sans-serif", boxShadow: "0 3px 8px rgba(0,0,0,.15)" }}>{ch}</button>
          ))}
        </div>
      </div>
    );

    if (mode === "animate") return (
      <div style={panelS}>
        {/* Select all / animate all row */}
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <button onClick={() => setSelectedIds(new Set(objects.map(o => o.id)))} style={{ ...chip(false), flex: 1, textAlign: "center" }}>👆 Select All</button>
          <button onClick={() => setSelectedIds(new Set())} style={{ ...chip(false), flex: 1, textAlign: "center" }}>✖ Clear</button>
          <button onClick={animateAllRandom}
            style={{
              flex: 1.4, background: "linear-gradient(135deg,#FF4444,#FF8C00,#FFD700,#32CD32,#1E90FF,#8A2BE2)",
              backgroundSize: "300% 300%", animation: "rainbowShift 2s ease infinite",
              border: "none", borderRadius: 12, padding: "7px 10px", fontSize: 13, fontWeight: 900,
              color: "#fff", cursor: "pointer", fontFamily: "'Nunito',sans-serif",
              boxShadow: "0 4px 16px rgba(255,68,68,.3)", textAlign: "center",
              textShadow: "0 1px 3px rgba(0,0,0,.3)",
            }}>🎲 Randomise!</button>
        </div>

        {selCount === 0 ? (
          <p style={{ fontSize: 13, fontWeight: 700, color: dk ? "#DDD6FE" : "#6D5BA3", textAlign: "center", padding: 6 }}>
            ⚡ Tap objects to select them, then pick superpowers!
          </p>
        ) : (
          <>
            <div style={{ fontSize: 12, fontWeight: 800, color: dk ? "#DDD6FE" : "#6D5BA3", marginBottom: 5 }}>
              {selCount} selected {selCount === 1 && firstSel ? `(${firstSel.emoji || firstSel.symbol || firstSel.display || "?"})` : ""}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: dk ? "#9CA3AF" : "#999", marginBottom: 3 }}>Movement:</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
              {MOVEMENTS.map(b => {
                const allHave = [...selectedIds].every(id => objects.find(o => o.id === id)?.movement === b.id);
                return <button key={b.id} onClick={() => applyToSelected("movement", b.id)} style={{ ...chip(allHave), fontSize: 12, padding: "5px 9px" }}>{b.icon} {b.label}</button>;
              })}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: dk ? "#9CA3AF" : "#999", marginBottom: 3 }}>Interaction:</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {INTERACTIONS.map(b => {
                const allHave = [...selectedIds].every(id => objects.find(o => o.id === id)?.interaction === b.id);
                return <button key={b.id} onClick={() => applyToSelected("interaction", b.id)} style={{ ...chip(allHave), fontSize: 12, padding: "5px 9px" }}>{b.icon} {b.label}</button>;
              })}
            </div>
          </>
        )}
      </div>
    );
    return null;
  };

  // ─── Gallery Modal ───
  const GalleryModal = () => !showGallery ? null : (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,.7)", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: dk ? "#1a1a2e" : "#fff", borderRadius: 24, padding: 20, maxWidth: 500, width: "100%", maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: dk ? "#DDD6FE" : "#4A3D6B", fontFamily: "'Nunito',sans-serif" }}>🖼️ My Creations</h2>
          <button onClick={() => setShowGallery(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: dk ? "#aaa" : "#888" }}>✕</button>
        </div>
        {gallery.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888", padding: 30, fontSize: 14, fontWeight: 600 }}>No saved creations yet! Tap 💾 to save one.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
            {gallery.map(g => (
              <div key={g.id} style={{ background: dk ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.03)", borderRadius: 16, overflow: "hidden", cursor: "pointer", position: "relative" }}>
                <img src={g.thumb} onClick={() => loadSave(g)} style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }} />
                <div style={{ padding: "8px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: dk ? "#aaa" : "#888", fontWeight: 600 }}>{g.date}</span>
                  <button onClick={(e) => { e.stopPropagation(); deleteSave(g.id); }} style={{ background: "none", border: "none", fontSize: 14, cursor: "pointer", color: "#F44" }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ─── Chaos Picker Modal ───
  const ChaosModal = () => !showChaos ? null : (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,.7)", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: dk ? "#1a1a2e" : "#fff", borderRadius: 24, padding: 20, maxWidth: 400, width: "100%", maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: dk ? "#DDD6FE" : "#4A3D6B", fontFamily: "'Nunito',sans-serif" }}>🌋 Pick Your Chaos!</h2>
          <button onClick={() => setShowChaos(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: dk ? "#aaa" : "#888" }}>✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CHAOS_PRESETS.map((p, i) => (
            <button key={i} onClick={() => launchChaos(p)}
              style={{
                background: dk ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.03)",
                border: "2px solid transparent", borderRadius: 18, padding: "14px 16px",
                cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: 4,
                transition: "all .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#A855F7"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
            >
              <span style={{ fontSize: 18, fontWeight: 900, fontFamily: "'Nunito',sans-serif", color: dk ? "#fff" : "#333" }}>{p.name}</span>
              <span style={{ fontSize: 12, color: dk ? "#9CA3AF" : "#888", fontWeight: 600 }}>{p.desc}</span>
              <div style={{ display: "flex", gap: 2, fontSize: 18, marginTop: 2 }}>
                {p.stickers.slice(0, 8).map((s, j) => <span key={j}>{s}</span>)}
                {p.stickers.length > 8 && <span style={{ color: "#888" }}>...</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Nunito','Quicksand',sans-serif", background: "#111", overflow: "hidden", userSelect: "none", WebkitUserSelect: "none" }}>
      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", padding: "5px 8px", gap: 4, background: dk ? "rgba(0,0,0,.5)" : "rgba(255,255,255,.92)", backdropFilter: "blur(12px)", borderBottom: dk ? "1px solid rgba(255,255,255,.06)" : "1px solid rgba(0,0,0,.05)", zIndex: 20, flexShrink: 0 }}>
        <button onClick={undo} style={topBtn}>↩️</button>
        <button onClick={redo} style={topBtn}>↪️</button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 14, fontWeight: 900, background: "linear-gradient(135deg,#FF6B9D,#FBBF24,#34D399,#818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Creature Canvas</span>
        <div style={{ flex: 1 }} />
        <button onClick={() => setSoundOn(!soundOn)} style={topBtn}>{soundOn ? "🔊" : "🔇"}</button>
        {/* BG picker inline */}
        <div style={{ display: "flex", gap: 2 }}>
          {BACKGROUNDS.map((b, i) => (
            <button key={b.id} onClick={() => setBgIdx(i)} style={{
              width: 24, height: 24, borderRadius: 7, border: bgIdx === i ? "2px solid #A855F7" : "1.5px solid rgba(128,128,128,.2)",
              background: b.bg, cursor: "pointer", fontSize: 10, lineHeight: 1,
            }}>{bgIdx === i ? "✓" : ""}</button>
          ))}
        </div>
        <button onClick={saveCanvas} style={topBtn} title="Save">💾</button>
        <button onClick={() => setShowGallery(true)} style={topBtn} title="Gallery">🖼️</button>
        {selectedIds.size > 0 && !playing && <button onClick={() => { setObjects(p => p.filter(o => !selectedIds.has(o.id))); setSelectedIds(new Set()); }} style={{ ...topBtn, color: "#F44" }}>🗑️</button>}
        <button onClick={clearAll} style={{ ...topBtn, fontSize: 13, fontWeight: 900, color: "#F44" }}>✕</button>
      </div>

      {/* Canvas */}
      <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden", background: bg.bg, cursor: mode === "draw" && !playing ? "crosshair" : "default" }}
        onClick={() => { if (mode !== "draw" && !playing) setSelectedIds(new Set()); }}>
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", touchAction: "none", zIndex: 1 }}
          onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
          onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp} />

        {/* Objects */}
        {objects.filter(o => !o.dead).map(o => {
          const isSel = selectedIds.has(o.id) && !playing;
          const sc = o.gs || 1;
          const fs = (o.type === "number" || o.type === "letter") ? 26 : o.type === "shape" ? 34 : 38;
          const isChain = o.type === "letter" && o.chain && o.chain.length > 1;

          return (
            <div key={o.id} onMouseDown={e => onObjDown(e, o)} onTouchStart={e => onObjDown(e, o)}
              style={{
                position: "absolute", left: o.x, top: o.y, width: o.sz * sc, height: o.sz * sc,
                display: "flex", alignItems: "center", justifyContent: "center", cursor: playing ? "default" : "grab",
                zIndex: 10 + (isSel ? 5 : 0), transform: `rotate(${o.ang || 0}deg)`,
                borderRadius: o.type === "number" || o.type === "letter" ? 13 : "50%",
                background: o.type === "number" ? "linear-gradient(135deg,#FBBF24,#F97316)" : o.type === "letter" ? "linear-gradient(135deg,#34D399,#059669)" : "transparent",
                boxShadow: isSel ? "0 0 0 3px #A855F7,0 0 16px rgba(168,85,247,.4)" : o.type === "number" || o.type === "letter" ? "0 4px 10px rgba(0,0,0,.2)" : "none",
                filter: o.frozen ? "brightness(.6) saturate(.3)" : "none",
                animation: mode === "animate" && !playing ? "pulse 2s ease-in-out infinite" : "none",
                minWidth: isChain ? o.chain.length * 20 + 16 : undefined, padding: isChain ? "0 6px" : 0,
                transition: playing ? "none" : "box-shadow .15s",
              }}>
              {o.type === "shape" ? <span style={{ color: o.color, fontSize: fs * sc }}>{o.symbol}</span>
                : o.type === "sticker" ? <span style={{ fontSize: fs * sc }}>{o.emoji}</span>
                  : <span style={{ fontSize: (isChain ? Math.max(14, 26 - o.chain.length * 2) : fs) * sc, fontWeight: 900, color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,.3)" }}>{(o.display || o.value).toUpperCase()}</span>}
              {(o.movement || o.interaction) && !playing && (
                <div style={{ position: "absolute", top: -8, right: -8, display: "flex", gap: 1 }}>
                  {o.movement && <span style={{ background: "#4F46E5", borderRadius: 7, padding: "1px 3px", fontSize: 9, border: "1.5px solid #fff" }}>{MOVEMENTS.find(m => m.id === o.movement)?.icon}</span>}
                  {o.interaction && <span style={{ background: "#DC2626", borderRadius: 7, padding: "1px 3px", fontSize: 9, border: "1.5px solid #fff" }}>{INTERACTIONS.find(m => m.id === o.interaction)?.icon}</span>}
                </div>
              )}
              {o.frozen && <span style={{ position: "absolute", fontSize: 18, top: -10, left: "50%", transform: "translateX(-50%)" }}>❄️</span>}
            </div>
          );
        })}

        {/* Particles */}
        {particles.map(p => <div key={p.id} style={{ position: "absolute", left: p.x, top: p.y, width: p.emoji ? "auto" : 7, height: p.emoji ? "auto" : 7, borderRadius: "50%", background: p.emoji ? "transparent" : p.c, fontSize: p.emoji ? 18 : 0, opacity: p.life / 55, zIndex: 50, pointerEvents: "none" }}>{p.emoji || ""}</div>)}

        {/* Popups */}
        {popups.map(p => (
          <div key={p.id} style={{
            position: "absolute", left: p.x - 30, top: p.y - 25,
            background: `linear-gradient(135deg,${p.color},${p.color}cc)`, color: "#fff", fontWeight: 900, fontSize: 26,
            fontFamily: "'Nunito',sans-serif", padding: "10px 22px", borderRadius: 18,
            boxShadow: `0 8px 28px ${p.color}66`, zIndex: 100, pointerEvents: "none",
            animation: "wordPop .4s cubic-bezier(.34,1.56,.64,1)", whiteSpace: "nowrap",
            transform: `translateY(${-((3000 - p.t) / 3000) * 35}px)`, opacity: p.t < 500 ? p.t / 500 : 1,
          }}>{p.text} ✨</div>
        ))}
      </div>

      {/* Tool Panel */}
      <Panel />

      {/* Bottom Bar */}
      <div style={{ display: "flex", alignItems: "center", padding: "6px 6px 10px", background: dk ? "rgba(0,0,0,.6)" : "rgba(255,255,255,.95)", backdropFilter: "blur(12px)", borderTop: dk ? "1px solid rgba(255,255,255,.05)" : "1px solid rgba(0,0,0,.05)", gap: 4, flexShrink: 0, zIndex: 20 }}>
        {/* CHAOS BUTTON — always visible, irresistible */}
        <button onClick={() => setShowChaos(true)}
          style={{
            background: "linear-gradient(135deg,#FF4444,#FF8C00,#FFD700,#32CD32,#1E90FF,#8A2BE2,#FF69B4)",
            backgroundSize: "400% 400%", animation: "rainbowShift 3s ease infinite",
            border: "none", borderRadius: 18, padding: "8px 12px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 0,
            cursor: "pointer", boxShadow: "0 4px 20px rgba(255,68,68,.3),0 0 30px rgba(168,85,247,.2)",
            flexShrink: 0, minWidth: 56,
          }}>
          <span style={{ fontSize: 20 }}>🌋</span>
          <span style={{ fontSize: 9, fontWeight: 900, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,.4)" }}>CHAOS</span>
        </button>

        {/* Mode buttons */}
        {[
          { id: "draw", icon: "✏️", label: "Draw" },
          { id: "shapes", icon: "🔷", label: "Shapes" },
          { id: "stickers", icon: "🌟", label: "Stickers" },
          { id: "letters", icon: "🔤", label: "ABC 123" },
          { id: "animate", icon: "⚡", label: "Animate" },
        ].map(m => <button key={m.id} onClick={() => { if (!playing) setMode(mode === m.id ? "" : m.id); }} style={modeBtn(!playing && mode === m.id)}>
          <span style={{ fontSize: 16 }}>{m.icon}</span><span style={{ fontSize: 9, fontWeight: 800 }}>{m.label}</span>
        </button>)}

        {/* Speed (only during play) */}
        {playing && <button onClick={() => setSpeed(speed === 1 ? 2 : speed === 2 ? .5 : 1)} style={{ ...modeBtn(false), flexShrink: 0, maxWidth: 50 }}>
          <span style={{ fontSize: 14 }}>{speed === .5 ? "🐌" : speed === 1 ? "🐇" : "🚀"}</span>
          <span style={{ fontSize: 9, fontWeight: 800 }}>{speed}x</span>
        </button>}

        {/* PLAY / PAUSE TOGGLE */}
        <button onClick={togglePlay}
          style={{
            background: playing ? "linear-gradient(135deg,#F97316,#EF4444)" : "linear-gradient(135deg,#22C55E,#16A34A)",
            border: "none", borderRadius: 18, padding: "8px 16px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 0,
            cursor: "pointer", flexShrink: 0,
            boxShadow: playing ? "0 4px 16px rgba(239,68,68,.35)" : "0 4px 16px rgba(34,197,94,.35),inset 0 2px 0 rgba(255,255,255,.2)",
            transition: "all .2s",
          }}>
          <span style={{ fontSize: 18 }}>{playing ? "⏹" : "▶️"}</span>
          <span style={{ fontSize: 9, fontWeight: 900, color: "#fff" }}>{playing ? "STOP" : "PLAY"}</span>
        </button>
      </div>

      <ChaosModal />
      <GalleryModal />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}body{overflow:hidden}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(168,85,247,0)}50%{box-shadow:0 0 0 6px rgba(168,85,247,.15)}}
        @keyframes wordPop{from{transform:scale(0)}to{transform:scale(1)}}
        @keyframes rainbowShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      `}</style>
    </div>
  );
}
