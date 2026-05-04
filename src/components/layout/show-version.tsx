import VERSION from '@/version'

export function ShowVersion() {
  return (
    <div
      className="fixed top-1/2 left-7.5 hidden -translate-y-1/2 flex-col items-center justify-center lg:flex z-10"
      aria-hidden="true"
      role="presentation"
    >
      <p className="font-zi flex flex-col text-xl">
        <span>版</span>
        <span>本</span>
      </p>
      <span className="font-zi text-xl">{VERSION}</span>
    </div>
  )
}
