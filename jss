let hour = 0;
let power = 100;
let usage = 1;
let camera = 'CAM-1A';
let night = 1;
let nightmare = false;
let radar = false;
let infinitePower = false;
let jumpscareActive = false;

const scareImages = {
  'Bonnie': 'assets/bonnie.png',
  'Chica': 'assets/chica.png',
  'Freddy': 'assets/freddy.png',
  'Foxy': 'assets/foxy.png',
  'Golden Freddy': 'assets/golden-freddy.png',
  'Power Out': 'assets/static.png'
};

const scareAudio = 'assets/scream.mp3';

const animatronics = {
  Bonnie: { path: ['CAM-1A', 'CAM-1B', 'CAM-5', 'CAM-2A', 'CAM-2B'], pos: 0, ai: 3 },
  Chica: { path: ['CAM-1A', 'CAM-1B', 'CAM-7', 'CAM-4A', 'CAM-4B'], pos: 0, ai: 3 },
  Freddy: { path: ['CAM-1A', 'CAM-1B', 'CAM-4A', 'CAM-4B'], pos: 0, ai: 3 },
  Foxy: { path: ['CAM-1C', 'HALLWAY'], pos: 0, ai: 3 }
};

let doors = {
  leftDoor: false,
  rightDoor: false,
  leftLight: false,
  rightLight: false
};

function toggle(which) {
  doors[which] = !doors[which];
  updateUsage();
}

function updateUsage() {
  usage = 1;
  Object.values(doors).forEach(v => { if (v) usage++; });
}

function updatePower() {
  if (!infinitePower && !jumpscareActive) {
    power -= usage * 0.05;
    if (power <= 0) {
      power = 0;
      triggerJumpscare('Power Out');
    }
  }
  document.getElementById('power').innerText = `Power: ${Math.floor(power)}%`;
}

function updateTime() {
  hour++;
  if (hour >= 6) {
    alert("6 AM! You survived.");
    resetNight();
    return;
  }
  const times = ['12:00 AM','1:00 AM','2:00 AM','3:00 AM','4:00 AM','5:00 AM','6:00 AM'];
  document.getElementById('time').innerText = times[hour];
  if (hour === 4 && power > 20) {
    nightmare = true;
    alert("⚠️ Nightmare Mode Activated");
  }
}

function setCam(cam) {
  camera = cam;
  updateCameraView();
}

function updateCameraView() {
  document.getElementById('camName').innerText = camera;
  let found = false;
  Object.keys(animatronics).forEach(name => {
    let anim = animatronics[name];
    if (anim.path[anim.pos] === camera) {
      document.getElementById('camView').innerText = `${name} ${nightmare ? "(Nightmare)" : ""} is here!`;
      found = true;
    }
  });
  if (!found) {
    document.getElementById('camView').innerText = radar ? 'Nothing here (Radar ON)' : 'No animatronic detected';
  }
}

function runAI() {
  Object.keys(animatronics).forEach(name => {
    let anim = animatronics[name];
    if (Math.random() * 20 < anim.ai * (nightmare ? 2 : 1)) {
      if (anim.pos < anim.path.length - 1) {
        anim.pos++;
      } else {
        if (!doorBlocked(name)) {
          triggerJumpscare(name);
        } else {
          anim.pos = anim.path.length - 2;
        }
      }
    }
  });

  if (Math.random() < 0.01) {
    triggerJumpscare('Golden Freddy');
  }

  updateCameraView();
}

function doorBlocked(name) {
  if (name === 'Bonnie' || name === 'Foxy') return doors.leftDoor;
  if (name === 'Chica' || name === 'Freddy') return doors.rightDoor;
  return false;
}

function showCustomNight() {
  document.getElementById('customNight').style.display = 'block';
}

function startNight() {
  animatronics.Bonnie.ai = parseInt(document.getElementById('ai-bonnie').value);
  animatronics.Chica.ai = parseInt(document.getElementById('ai-chica').value);
  animatronics.Freddy.ai = parseInt(document.getElementById('ai-freddy').value);
  animatronics.Foxy.ai = parseInt(document.getElementById('ai-foxy').value);
  document.getElementById('customNight').style.display = 'none';
  resetNight();
}

function resetNight() {
  hour = 0;
  power = 100;
  nightmare = false;
  Object.keys(animatronics).forEach(name => animatronics[name].pos = 0);
  document.getElementById('night').innerText = `Night ${night++}`;
  document.getElementById('time').innerText = '12:00 AM';
  document.getElementById('power').innerText = 'Power: 100%';
}

function cheat() {
  infinitePower = true;
  radar = true;
  power = 999;
  alert("Cheat Mode Enabled: Infinite Power + Radar");
}

function triggerJumpscare(name) {
  if (jumpscareActive) return;
  jumpscareActive = true;
  const img = document.getElementById('jumpscareImg');
  const audio = document.getElementById('jumpscareAudio');
  img.src = scareImages[name] || scareImages['Freddy'];
  audio.src = scareAudio;
  document.getElementById('jumpscare').style.display = 'flex';
  audio.play();
  setTimeout(() => {
    alert(`${name} got you! Game Over.`);
    document.getElementById('jumpscare').style.display = 'none';
    jumpscareActive = false;
    resetNight();
  }, 3000);
}

setInterval(updatePower, 1000);
setInterval(updateTime, 10000);
setInterval(runAI, 5000);

