import * as Tone from 'tone'
import React, { Component } from 'react'

import * as firstSettings from './tunes/first.js'
import * as secondSettings from './tunes/second.js'
import * as thirdSettings from './tunes/third.js'
import ToneSynth from './modules/ToneSynth.jsx'
import SC_Button from './components/SC_Button'

export default class Container extends Component {
  constructor(props) {
    super(props)
    this.state = { firstSettings, secondSettings, thirdSettings, playing: false }
    this.synths = []
    this.parts = []
  }

  componentWillUnmount() { this.stopAll() }

  stopAll = () => {
    Tone.Transport.stop()
    Tone.Transport.cancel()
    this.parts.forEach(part => part.dispose())
    this.synths.forEach(synth => synth.dispose())
    this.parts = []
    this.synths = []
    this.setState({ playing: false })
  }

  buildVoice = settings => {
    const synth = new Tone.Synth(settings.synth).toDestination()
    const part = new Tone.Part((time, note) => {
      synth.triggerAttackRelease(note.noteName, note.duration, time, note.velocity)
    }, settings.sequence.steps).start(0)
    part.loopEnd = settings.sequence.duration
    part.loop = true
    this.synths.push(synth)
    this.parts.push(part)
  }

  handleStart = async () => {
    if (this.state.playing) { this.stopAll(); return }
    await Tone.start()
    const { firstSettings, secondSettings, thirdSettings } = this.state
    ;[firstSettings, secondSettings, thirdSettings].forEach(this.buildVoice)
    Tone.Transport.bpm.value = 108
    Tone.Transport.start()
    this.setState({ playing: true })
  }

  changeVoice = (index, key, value) => {
    const names = ['firstSettings', 'secondSettings', 'thirdSettings']
    const name = names[index]
    const settings = this.state[name]
    const synth = this.synths[index]
    if (key === 'synthType') { settings.synth.oscillator.type = value; if (synth) synth.oscillator.type = value }
    if (key === 'synthVolume') { settings.synth.volume = value; if (synth) synth.volume.value = value }
    if (key === 'synthDetune') { settings.synth.detune = value; if (synth) synth.detune.value = value }
    if (key === 'synthPortamento') { settings.synth.portamento = value; if (synth) synth.portamento = value }
    if (key === 'synthPhase') { settings.synth.oscillator.phase = value; if (synth) synth.oscillator.phase = value }
    this.setState({ [name]: settings })
  }

  renderVoice = (title, subtitle, settings, index) => (
    <section className={`voice voice_${index + 1}`}>
      <div className="voice_head"><div><span>0{index + 1}</span><h2>{title}</h2><p>{subtitle}</p></div><i /></div>
      <ToneSynth settings={settings} handleValueChange={(p,v) => this.changeVoice(index,p,v)} />
    </section>
  )

  render() {
    const { firstSettings, secondSettings, thirdSettings, playing } = this.state
    return <main className="neon_wave">
      <header className="nw_header">
        <div className="mark">NW</div><b>NEON WAVE</b><span>THREE VOICE LOOP SYNTH / TONE.JS</span>
        <SC_Button text={playing ? 'STOP' : 'PLAY'} handleClick={this.handleStart} />
      </header>
      <section className="hero"><div><small>DIGITAL SOUND OBJECT / 2026</small><h1>NEON<br/><em>WAVE</em></h1></div><p>Three independent voices form one shifting electronic loop. Change the oscillator, volume, glide, detune and phase while it plays.</p></section>
      <section className="voices">
        {this.renderVoice('BASS','LOW / WARM / HEAVY',firstSettings,0)}
        {this.renderVoice('PULSE','MID / RHYTHMIC / SHARP',secondSettings,1)}
        {this.renderVoice('GLASS','HIGH / AIRY / BRIGHT',thirdSettings,2)}
      </section>
      <footer><span>NEON WAVE</span><span>WEB AUDIO EXPERIMENT</span><span>2026</span></footer>
    </main>
  }
}
