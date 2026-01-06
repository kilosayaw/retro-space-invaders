class AudioManager {
  private context: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    try {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  private createOscillator(frequency: number, duration: number, type: OscillatorType = 'square') {
    if (!this.context || !this.enabled) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.1, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + duration);
  }

  playShoot() {
    if (!this.context || !this.enabled) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, this.context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.15, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);

    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + 0.1);
  }

  playExplosion() {
    if (!this.context || !this.enabled) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(20, this.context.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.2, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);

    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + 0.3);
  }

  playPowerUp() {
    if (!this.context || !this.enabled) return;

    const frequencies = [262, 330, 392, 523];
    frequencies.forEach((freq, i) => {
      const time = this.context!.currentTime + (i * 0.05);
      const oscillator = this.context!.createOscillator();
      const gainNode = this.context!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.context!.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = freq;

      gainNode.gain.setValueAtTime(0.1, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

      oscillator.start(time);
      oscillator.stop(time + 0.1);
    });
  }

  playGameOver() {
    if (!this.context || !this.enabled) return;

    const frequencies = [440, 392, 349, 294];
    frequencies.forEach((freq, i) => {
      const time = this.context!.currentTime + (i * 0.15);
      this.createOscillator(freq, 0.15, 'triangle');
    });
  }

  playWaveComplete() {
    if (!this.context || !this.enabled) return;

    const melody = [523, 587, 659, 784, 880];
    melody.forEach((freq, i) => {
      const time = this.context!.currentTime + (i * 0.08);
      const oscillator = this.context!.createOscillator();
      const gainNode = this.context!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.context!.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = freq;

      gainNode.gain.setValueAtTime(0.12, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.12);

      oscillator.start(time);
      oscillator.stop(time + 0.12);
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

export const audioManager = new AudioManager();
