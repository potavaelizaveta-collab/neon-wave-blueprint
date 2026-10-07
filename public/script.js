'use strict';
const $ = id => document.getElementById(id);
// Sound Sketch: settings → instruments → effects → channels → transport.
// Structure follows the teacher's Tone.js examples; UI preserves the author’s design.
const bass = {
  name: 'SYNTH 1 / BASS', wave: 'sawtooth', level: .45, pan: -.3, mute: false,
  synth: { volume: -12, oscillator: { type: 'sawtooth' }, envelope: { attack: .005, decay: .08, sustain: .3, release: .1 } },
  chorus: { wet: .2, frequency: .8, delayTime: 18, depth: .22 },
  distortion: { wet: .15, distortion: .15, oversample: '2x' },
  pingPongDelay: { wet: .2, delayTime: '8n.', feedback: .32 },
  jcReverb: { wet: .2, roomSize: .35 },
  channel: { volume: -6.94, pan: -.3, mute: false, solo: false },
  sequence: [], loop: '1m'
};
const glass = {
  name: 'SYNTH 2 / GLASS', wave: 'sine', level: .3, pan: .3, mute: false,
  synth: { volume: -12, oscillator: { type: 'sine' }, envelope: { attack: .005, decay: .08, sustain: .3, release: .1 } },
  chorus: { wet: .2, frequency: .8, delayTime: 18, depth: .22 },
  distortion: { wet: .15, distortion: .15, oversample: '2x' },
  pingPongDelay: { wet: .2, delayTime: '8n.', feedback: .32 },
  jcReverb: { wet: .2, roomSize: .35 },
  channel: { volume: -10.46, pan: .3, mute: false, solo: false },
  sequence: [], loop: '1m'
};
const drums = {
  name: 'DRUMS / PULSE', level: .65, pan: 0, mute: false,
  sampler: { urls: { C2: 'BT7A0D0.WAV', D2: 'ST0T3S7.WAV', 'F#2': 'HHCD6.WAV' }, baseUrl: 'roland_tr_909/', volume: -10, release: .06 },
  chorus: { wet: .2, frequency: .8, delayTime: 18, depth: .22 },
  distortion: { wet: .15, distortion: .15, oversample: '2x' },
  pingPongDelay: { wet: .2, delayTime: '8n.', feedback: .32 },
  jcReverb: { wet: .2, roomSize: .35 },
  channel: { volume: -3.74, pan: 0, mute: false, solo: false },
  sequence: [], loop: '1m'
};
const voices = [bass, glass, drums];
const defaults = [
  [1,0,0,1,1,0,0,1,1,0,1,0,1,0,0,1],
  [1,0,1,0,0,0,1,0,1,0,1,0,0,1,0,0],
  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
  [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0]
];
const bassNotes = ['A1','A1','C2','D2','G1','A1','E2','C2'];
const glassNotes = ['E4','G4','A4','B4','A4','G4','F4','D4'];
for (let step = 0; step < 16; step++) {
  const time = '0:' + Math.floor(step / 4) + ':' + step % 4;
  bass.sequence.push({ time, noteName: bassNotes[Math.floor(step / 2)], duration: '16n', velocity: .8, step, row: 0 });
  glass.sequence.push({ time, noteName: glassNotes[Math.floor(step / 2)], duration: '16n', velocity: .8, step, row: 1 });
  ['C2','D2','F#2'].forEach((noteName, i) => {
    drums.sequence.push({ time, noteName, duration: '16n', velocity: [.8,.65,.32][i], step, row: i + 2 });
  });
}
let patterns = defaults.map(row => row.slice());
const fxSettings = { chorus: .2, drive: .15, delay: .2, reverb: .2 };
const audio = { ready: false, channels: [], chains: [], instruments: [], parts: [], sampleReady: null, step: 0 };
let playing = false, starting = false, playbackRun = 0, bpm = 105;


function initInterface() {
const waveShapes={sine:'M2 16 Q9 0 16 16 T30 16',triangle:'M2 24 L9 8 L23 24 L30 8',square:'M2 24 L2 8 L16 8 L16 24 L30 24 L30 8',sawtooth:'M2 24 L15 8 L15 24 L28 8 L28 24'};
voices.forEach((v,i)=>{
  const e=document.createElement('article');e.className='panel';
  e.innerHTML='<div class="panelhead"><h2>'+'<img src="images/'+["bass","glass","pulse"][i]+'.svg" alt="'+["BASS","GLASS","PULSE"][i]+'">'+'</h2><button id="mute'+i+'" class="mute" title="Отключить канал" aria-label="Отключить '+v.name+'" aria-pressed="false">'+String(i+1).padStart(2,'0')+'</button></div>'+
    (i<2?'<div class="waves" role="group" aria-label="Тип волны '+v.name+'">'+Object.keys(waveShapes).map(w=>'<button data-wave="'+w+'" title="'+w+'" aria-label="'+v.name+': '+w+'" aria-pressed="'+(w===v.wave)+'" class="'+(w===v.wave?'active':'')+'"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="'+waveShapes[w]+'"/></svg></button>').join('')+'</div>':'<div class="drum-mark" aria-hidden="true"><i></i><i></i><i></i></div>')+
    '<div class="faders"><div><label class="fader-label" for="level'+i+'">LEVEL</label><input id="level'+i+'" title="Громкость" type="range" min="0" max="1" step=".01" value="'+v.level+'"><div class="scale" aria-hidden="true"><span>−</span><span>+</span></div><output class="sr-only" id="levelValue'+i+'">'+Math.round(v.level*100)+'%</output></div><div><label class="fader-label" for="pan'+i+'">PAN</label><input id="pan'+i+'" title="Панорама" type="range" min="-1" max="1" step=".01" value="'+v.pan+'"><div class="scale" aria-hidden="true"><span>L</span><span>R</span></div><output class="sr-only" id="panValue'+i+'">'+v.pan.toFixed(2)+'</output></div></div>';
  $('channels').append(e);if(i===0)e.append($('fxPanel'));
  e.querySelectorAll('[data-wave]').forEach(b=>b.onclick=()=>{v.wave=b.dataset.wave;v.synth.oscillator.type=v.wave;if(audio.ready)audio.instruments[i].oscillator.type=v.wave;e.querySelectorAll('[data-wave]').forEach(q=>{q.classList.toggle('active',q===b);q.setAttribute('aria-pressed',q===b)})});
  $('level'+i).oninput=event=>{v.level=+event.target.value;$('levelValue'+i).textContent=Math.round(v.level*100)+'%';updateChannel(i)};
  $('pan'+i).oninput=event=>{v.pan=+event.target.value;$('panValue'+i).textContent=v.pan.toFixed(2);updateChannel(i)};
  $('mute'+i).onclick=()=>{v.mute=!v.mute;$('mute'+i).classList.toggle('active',v.mute);$('mute'+i).setAttribute('aria-pressed',v.mute);updateChannel(i)};
});
Object.keys(fxSettings).forEach((key,i)=>{
  const e=document.createElement('div');e.className='fx-control';
  e.innerHTML='<label for="fx'+key+'" title="'+key+'"><span>'+String(i+1).padStart(2,'0')+'</span><span class="sr-only">'+key+'</span></label><input id="fx'+key+'" title="'+key+'" type="range" min="0" max="1" step=".01" value="'+fxSettings[key]+'"><output class="sr-only" id="value'+key+'">'+Math.round(fxSettings[key]*100)+'%</output>';
  $('effects').append(e);$('fx'+key).oninput=event=>{fxSettings[key]=+event.target.value;$('value'+key).textContent=Math.round(fxSettings[key]*100)+'%';updateFX()};
});
cells=[];
['SYNTH 1','SYNTH 2','KICK','SNARE','HI-HAT'].forEach((name,row)=>{
  const e=document.createElement('div');e.className='track';e.innerHTML='<span class="trackname" title="'+name+'">'+['B','G','K','S','H'][row]+'</span><div class="steps"></div>';cells[row]=[];
  for(let col=0;col<16;col++){const b=document.createElement('button');b.className='step'+(patterns[row][col]?' on':'');b.title=name+' · '+(col+1);b.setAttribute('aria-label',name+' шаг '+(col+1));b.setAttribute('aria-pressed',!!patterns[row][col]);b.onclick=()=>{patterns[row][col]=patterns[row][col]?0:1;b.classList.toggle('on',!!patterns[row][col]);b.setAttribute('aria-pressed',!!patterns[row][col])};e.lastChild.append(b);cells[row].push(b)}$('tracks').append(e);
});

}
let cells = [];
function initEffectChain(settings, instrument) {
  const chorus = new Tone.Chorus(settings.chorus).start();
  const distortion = new Tone.Distortion(settings.distortion);
  const delay = new Tone.PingPongDelay(settings.pingPongDelay);
  const reverb = new Tone.JCReverb(settings.jcReverb);
  const channel = new Tone.Channel(settings.channel);
  instrument.chain(chorus, distortion, delay, reverb, channel);
  channel.connect(audio.compressor);
  audio.channels.push(channel);
  audio.chains.push({ chorus, distortion, delay, reverb });
  return channel;
}

function initPart(settings, instrument) {
  const part = new Tone.Part((time, note) => {
    if (!playing || !patterns[note.row][note.step]) return;
    instrument.triggerAttackRelease(note.noteName, note.duration, time, note.velocity);
  }, settings.sequence).start(0);
  part.loopEnd = settings.loop;
  part.loop = true;
  audio.parts.push(part);
}

function initBass() {
  const synth = new Tone.Synth(bass.synth);
  audio.instruments.push(synth);
  initEffectChain(bass, synth);
  initPart(bass, synth);
}

function initGlass() {
  const synth = new Tone.Synth(glass.synth);
  audio.instruments.push(synth);
  initEffectChain(glass, synth);
  initPart(glass, synth);
}

function initDrums() {
  // Sampler loads the three WAV files before Transport starts.
  audio.sampleReady = new Promise((resolve, reject) => {
    const sampler = new Tone.Sampler({ ...drums.sampler, onload: resolve, onerror: reject });
    audio.instruments.push(sampler);
    initEffectChain(drums, sampler);
    initPart(drums, sampler);
  });
  // Avoid an unhandled rejection if loading fails before PLAY awaits it.
  audio.sampleReady.catch(() => {});
}

function initWebAudio() {
  if (audio.ready) return;
  audio.compressor = new Tone.Compressor({ threshold: -12, knee: 12, ratio: 4, attack: .003, release: .2 });
  audio.master = new Tone.Gain(0);
  audio.waveform = new Tone.Waveform(1024);
  audio.compressor.chain(audio.master, audio.waveform, Tone.Destination);
  initBass();
  initGlass();
  initDrums();
  audio.cursor = new Tone.Loop(time => {
    const step = audio.step++ % 16;
    const token = playbackRun;
    Tone.Draw.schedule(() => {
      if (!playing || token !== playbackRun) return;
      cells.forEach(row => row.forEach((button, index) => button.classList.toggle('now', index === step)));
    }, time);
  }, '16n').start(0);
  audio.ready = true;
  voices.forEach((_, i) => updateChannel(i));
  updateFX();
  draw();
}

function updateChannel(index) {
  const settings = voices[index];
  settings.channel.volume = settings.level > 0 ? 20 * Math.log10(settings.level) : -Infinity;
  settings.channel.pan = settings.pan;
  settings.channel.mute = settings.mute;
  if (!audio.ready) return;
  const channel = audio.channels[index];
  channel.volume.rampTo(settings.channel.volume, .02);
  channel.pan.rampTo(settings.pan, .02);
  channel.mute = settings.mute;
}

function updateFX() {
  voices.forEach(settings => {
    settings.chorus.wet = fxSettings.chorus;
    settings.distortion.wet = fxSettings.drive;
    settings.distortion.distortion = fxSettings.drive;
    settings.pingPongDelay.wet = fxSettings.delay;
    settings.jcReverb.wet = fxSettings.reverb;
  });
  if (!audio.ready) return;
  audio.chains.forEach(chain => {
    chain.chorus.wet.rampTo(fxSettings.chorus, .02);
    chain.distortion.wet.rampTo(fxSettings.drive, .02);
    chain.distortion.distortion = fxSettings.drive;
    chain.delay.wet.rampTo(fxSettings.delay, .02);
    chain.reverb.wet.rampTo(fxSettings.reverb, .02);
  });
}

function setPlaybackUI(running) {
  $('record').classList.toggle('spin', running);
  $('platter').setAttribute('aria-pressed', running);
  $('platter').setAttribute('aria-label', running ? 'Остановить диск' : 'Запустить диск');
  $('power').textContent = running ? 'STOP' : 'PLAY';
  $('power').setAttribute('aria-label', running ? 'Остановить' : 'Воспроизвести');
}

function initTransport() {
  Tone.Transport.bpm.value = bpm;
  Tone.Transport.position = 0;
  audio.step = 0;
  audio.master.gain.rampTo(+$('master').value, .02);
  Tone.Transport.start('+0.05');
}

async function start() {
  if (playing || starting) return;
  if (typeof Tone === 'undefined') { $('status').textContent = 'Не удалось загрузить Tone.js'; return; }
  starting = true;
  const token = ++playbackRun;
  $('status').textContent = 'ЗАГРУЗКА ЗВУКОВ…';
  try {
    await Tone.start();
    if (token !== playbackRun) return;
    initWebAudio();
    await audio.sampleReady;
    if (token !== playbackRun) return;
    playing = true;
    setPlaybackUI(true);
    initTransport();
    $('status').textContent = 'SIGNAL RUNNING / ' + bpm + ' BPM';
  } catch (error) {
    if (token === playbackRun) {
      halt();
      $('status').textContent = 'Не удалось загрузить звуки. Обнови страницу и проверь WAV-файлы.';
    }
    console.error(error);
  } finally {
    if (token === playbackRun) starting = false;
  }
}

function halt() {
  playing = false;
  starting = false;
  playbackRun++;
  if (audio.ready) {
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    audio.master.gain.rampTo(0, .015);
    audio.instruments.forEach(instrument => {
      if (instrument instanceof Tone.Sampler) instrument.releaseAll();
      else instrument.triggerRelease();
    });
  }
  setPlaybackUI(false);
  cells.forEach(row => row.forEach(button => button.classList.remove('now')));
  $('status').textContent = 'SIGNAL STOPPED / ' + bpm + ' BPM';
}

function draw() {
  const canvas = $('scope');
  canvas.dataset.live = 'true';
  const pen = canvas.getContext('2d');
  function frame() {
    const data = audio.waveform.getValue();
    pen.clearRect(0, 0, canvas.width, canvas.height);
    pen.strokeStyle = '#0764ba';
    pen.lineWidth = 2;
    pen.beginPath();
    data.forEach((value, index) => {
      const x = index / (data.length - 1) * canvas.width;
      const y = (1 - value) * canvas.height / 2;
      if (index) pen.lineTo(x, y); else pen.moveTo(x, y);
    });
    pen.stroke();
    requestAnimationFrame(frame);
  }
  frame();
}

function initControls() {
  $('play').onclick = start;
  $('stop').onclick = halt;
  $('platter').onclick = $('power').onclick = () => (playing || starting) ? halt() : start();
  $('bpm').onchange = event => {
    const value = Number(event.target.value);
    bpm = Number.isFinite(value) ? Math.max(60, Math.min(180, value)) : 105;
    event.target.value = bpm;
    if (audio.ready) Tone.Transport.bpm.value = bpm;
    $('status').textContent = (playing ? 'SIGNAL RUNNING / ' : 'READY / ') + bpm + ' BPM';
  };
  $('bpm').oninput = event => {
    const value = Number(event.target.value);
    if (!event.target.value || value < 60 || value > 180) return;
    bpm = value;
    if (audio.ready) Tone.Transport.bpm.value = bpm;
    $('status').textContent = (playing ? 'SIGNAL RUNNING / ' : 'READY / ') + bpm + ' BPM';
  };
  $('master').oninput = event => {
    const value = +event.target.value;
    $('masterValue').textContent = Math.round(value * 100) + '%';
    if (audio.ready && playing) audio.master.gain.rampTo(value, .02);
  };
  $('reset').onclick = () => {
    patterns = defaults.map(row => row.slice());
    cells.forEach((row, r) => row.forEach((button, c) => {
      button.classList.toggle('on', !!patterns[r][c]);
      button.setAttribute('aria-pressed', !!patterns[r][c]);
    }));
  };
  window.addEventListener('pagehide', halt);
}

document.addEventListener("DOMContentLoaded", () => { initInterface(); initControls(); });
