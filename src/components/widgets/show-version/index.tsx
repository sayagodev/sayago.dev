import VERSION from '@/lib/version'
import './show-version.css'

export function ShowVersion() {
  return (
    <div
      className="version-badge"
      aria-hidden="true"
      role="presentation"
    >
      <p className="version-badge__text">
        <span>版</span>
        <span>本</span>
      </p>
      <span className="version-badge__number">{VERSION}</span>
    </div>
  )
}
