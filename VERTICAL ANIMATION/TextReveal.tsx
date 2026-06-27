import type { CSSProperties } from 'react'

type AnimatedStyle = CSSProperties & Record<`--${string}`, string | number>

const clusters = [
  { x: 2, y: 79, delay: 0.15, drift: -8, lines: ['NO SIGNAL', 'PRISMATIC', 'ECHO', 'VOID'] },
  { x: 92, y: 71, delay: 0.42, drift: 10, lines: ['STATE: NULL', 'CORRUPTED', 'MEMORY'] },
  { x: 26, y: 58, delay: 0.75, drift: -5, lines: ['>MASK', 'AN EMPTY ORBIT', 'QUANTUM GHOST'] },
  { x: 8, y: 72, delay: 1.1, drift: 8, lines: ['MUTUS SPECTRUM', '0x0F', 'FALSE MEMORY'] },
  { x: 71, y: 47, delay: 1.55, drift: -10, lines: ['NEURAL ID', 'VIRTUAL DISTORTION', 'DATA STREAM', 'ZERO'] },
  { x: 1, y: 86, delay: 2.15, drift: 5, lines: ['BEACON', 'SYNTHETIC VOID', 'HIDDEN STATE'] },
  { x: 73, y: 58, delay: 2.7, drift: 8, lines: ['アクセス権限がありません', '■'] },
  { x: 27, y: 43, delay: 3.15, drift: -7, lines: ['NEBULA', 'DIGITAL MATTER', 'ORBITAL DRIFT', 'PRISM IMAGE'] },
  { x: 24, y: 70, delay: 3.65, drift: 8, lines: ['7C04A9', 'DARK DEVICE', 'UNREAL BASIS', 'FRAME: 0248'] },
  { x: 1, y: 76, delay: 4.2, drift: -8, lines: ['暗号がありません', '■'] },
  { x: 25, y: 36, delay: 4.7, drift: 6, lines: ['LATENT DREAM', 'NOCTURNE SENSOR', 'WIDE EMISSION', 'ANALOG PHANTOM'] },
  { x: 89, y: 26, delay: 5.15, drift: -6, lines: ['FLARE', 'WAVE TRANSIT', 'NULL EVENT', 'SECOND SIGNAL'] },
  { x: 2, y: 55, delay: 5.65, drift: 9, lines: ['LATENT CHANNEL', 'HARD SHADOW', 'PHOTON TRAIL', 'SURFACE MEMORY'] },
  { x: 72, y: 68, delay: 6.05, drift: -9, lines: ['SILENT CURRENT', 'ORBITAL VECTOR', 'MAGNETIC FIELD', 'SOFT PROJECTION'] },
  { x: 1, y: 85, delay: 6.5, drift: 7, lines: ['QUANTUM ANCHOR', 'DORMANT PATH', 'INVISIBLE HAND'] },
  { x: 72, y: 82, delay: 6.9, drift: -7, lines: ['DORMANT SIGNAL', 'MICRO ARRAY', 'UNKNOWN: 023'] },
  { x: 25, y: 24, delay: 7.2, drift: 10, lines: ['LATENT DESIGN', 'QUANTUM IMPULSE', 'DISTRIBUTED FIELD'] },
]

const glyphs = [
  { char: 'V', x: 2, y: 76, delay: 0.45, rotate: -1 },
  { char: 'E', x: 2, y: 55, delay: 1.8, rotate: 1 },
  { char: 'N', x: 73, y: 72, delay: 3.15, rotate: 0 },
  { char: 'O', x: 72, y: 22, delay: 4.5, rotate: 0 },
  { char: 'M', x: 25, y: 28, delay: 5.85, rotate: -1 },
]

const streams = [
  { x: 74, y: 83, delay: 0.1, text: '010010  VOID::VECTOR  77A2' },
  { x: 26, y: 84, delay: 1.7, text: 'FRAME_0019 // ABSENCE' },
  { x: 42, y: 76, delay: 3.2, text: 'SIGNAL LOST — MEMORY UNBOUND' },
  { x: 14, y: 42, delay: 4.8, text: 'LATENT FIELD / 0X00F1' },
]

export default function TextReveal() {
  return (
    <main className="signal-frame" aria-label="Venom animated title sequence">
      <div className="signal-grid" aria-hidden="true" />
      <div className="signal-noise" aria-hidden="true" />
      <div className="edge-scan" aria-hidden="true" />

      <a
        className="signal-title"
        data-text="VENOM"
        href="https://github.com/VenomDevX"
        target="_blank"
        rel="noreferrer"
        role="heading"
        aria-level={1}
        aria-label="Visit the Venom GitHub profile"
      >
        {'VENOM'.split('').map((character, index) => (
          <span key={`${character}-${index}`} style={{ '--i': index } as AnimatedStyle}>
            {character === ' ' ? '\u00a0' : character}
          </span>
        ))}
      </a>

      <div className="glyph-field" aria-hidden="true">
        {glyphs.map((glyph, index) => (
          <span
            className="signal-glyph"
            key={`${glyph.char}-${index}`}
            style={{
              '--x': `${glyph.x}%`, '--y': `${glyph.y}%`, '--delay': `${glyph.delay}s`,
              '--rotate': `${glyph.rotate}deg`,
            } as AnimatedStyle}
          >
            {glyph.char}
          </span>
        ))}
      </div>

      <div className="cluster-field" aria-hidden="true">
        {clusters.map((cluster, index) => (
          <span
            className="data-cluster"
            key={`${cluster.x}-${cluster.y}-${index}`}
            style={{
              '--x': `${cluster.x}%`, '--y': `${cluster.y}%`, '--delay': `${cluster.delay}s`,
              '--drift': `${cluster.drift}px`, '--cycle': `${2.2 + (index % 4) * 0.22}s`,
            } as AnimatedStyle}
          >
            {cluster.lines.map((line) => <span key={line}>{line}</span>)}
          </span>
        ))}
      </div>

      {streams.map((stream, index) => (
        <span
          aria-hidden="true"
          className="data-stream"
          key={stream.text}
          style={{
            '--x': `${stream.x}%`, '--y': `${stream.y}%`, '--delay': `${stream.delay}s`,
            '--stream-index': index,
          } as AnimatedStyle}
        >
          {stream.text}
        </span>
      ))}

      <span className="pixel-cursor cursor-one" aria-hidden="true" />
      <span className="pixel-cursor cursor-two" aria-hidden="true" />
      <a
        className="copyright-tag"
        href="https://github.com/VenomDevX"
        target="_blank"
        rel="noreferrer"
        aria-label="Open VenomDevX GitHub profile"
      >
        &copy; 2026 @VenomDevX
      </a>
      <span className="frame-index" aria-hidden="true">V/03&nbsp;&nbsp;&nbsp;0320</span>
    </main>
  )
}
