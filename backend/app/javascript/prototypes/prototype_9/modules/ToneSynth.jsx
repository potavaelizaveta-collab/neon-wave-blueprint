import React, { Component } from 'react'

import SC_ToggleButtonSet from '../components/SC_ToggleButtonSet.jsx' //импортруем компонент кнопок
import SC_Slider from '../components/SC_Slider.jsx' //импортруем компонент слайдера

export default class ToneSynth extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { settings, handleValueChange } = this.props
    const options = ['sine', 'square', 'sawtooth', 'triangle']

    return <div className="ToneSynth">

      <div className="slider_min_max slider_min_max_volume">
        <h4>min</h4>
        <SC_Slider
          name="Volume"
          min={-50}
          max={50}
          step={0.01}
          value={settings.synth.volume}
          property="synthVolume"
          handleChange={handleValueChange}
        />
        <h4>max</h4>
      </div>

      <div className="slider_min_max">
        <h4>min</h4>
        <SC_Slider
          name="Portamento"
          min={0}
          max={1}
          step={0.01}
          value={settings.synth.portamento}
          property="synthPortamento"
          handleChange={handleValueChange}
        />
        <h4>max</h4>
      </div>

      <SC_ToggleButtonSet
        name="Type"
        options={options}
        value={settings.synth.oscillator.type}
        property="synthType"
        handleChange={handleValueChange}
      />

      <div className="slider_min_max">
        <h4>min</h4>
        <SC_Slider
          name="Detune"
          min={-10}
          max={10}
          step={0.01}
          value={settings.synth.detune}
          property="synthDetune"
          handleChange={handleValueChange}
        />
        <h4>max</h4>
      </div>

      <div className="slider_min_max">
        <h4>min</h4>
        <SC_Slider
          name="Phase"
          min={-10}
          max={10}
          step={0.01}
          value={settings.synth.oscillator.phase}
          property="synthPhase"
          handleChange={handleValueChange}
        />
        <h4>max</h4>
      </div>
    </div>
  }
}
