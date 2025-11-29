class AudioSystem {
  constructor() {
    this.sounds = {};
    this.music = null;
    this.musicVolume = 0.3;
    this.sfxVolume = 0.5;
    this.initialized = false;
    this.musicPlaying = false;
  }

 
  init() {
    if (this.initialized) return;
    
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.initialized = true;
    console.log("Audio system initialized!");
  }

 
  playDiamondCollect() {
    if (!this.initialized) return;
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
   
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.1); // C6
    
    gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc.start(now);
    osc.stop(now + 0.15);
  }

  
  playColorSwitch() {
    if (!this.initialized) return;
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
    
    gain.gain.setValueAtTime(this.sfxVolume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.start(now);
    osc.stop(now + 0.1);
  }


  playPowerUp() {
    if (!this.initialized) return;
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    
    osc1.type = 'sine';
    osc2.type = 'sine';
    
    osc1.frequency.setValueAtTime(261.63, now); 
    osc1.frequency.exponentialRampToValueAtTime(523.25, now + 0.2); 
    
    osc2.frequency.setValueAtTime(329.63, now); // E4
    osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.2);
    
    gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.25);
    osc2.stop(now + 0.25);
  }


  playGameOver() {
    if (!this.initialized) return;
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.5);
    
    gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    osc.start(now);
    osc.stop(now + 0.5);
  }

  
  playCombo(multiplier) {
    if (!this.initialized) return;
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    
    const baseFreq = 440 + (multiplier * 100);
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.1);
    
    gain.gain.setValueAtTime(this.sfxVolume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.start(now);
    osc.stop(now + 0.1);
  }

 
  startMusic() {
    if (!this.initialized) return;
    if (this.musicPlaying) return;
    
    this.musicPlaying = true;
    this.playPsychedelicLoop();
  }


  playPsychedelicLoop() {
    if (!this.musicPlaying) return;
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    
    const notes = [
      261.63,  
      329.63,  
      392.00,  
      523.25, 
    ];
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      
      const vol = this.musicVolume * 0.05;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.5);
      gain.gain.setValueAtTime(vol, now + 3.5);
      gain.gain.linearRampToValueAtTime(0, now + 4);
      
      osc.start(now);
      osc.stop(now + 4);
    });
    
    
    setTimeout(() => this.playPsychedelicLoop(), 4000);
  }

  stopMusic() {
    this.musicPlaying = false;
  }

  
  setMusicVolume(vol) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
  }

  setSFXVolume(vol) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }
}


export const audioSystem = new AudioSystem();