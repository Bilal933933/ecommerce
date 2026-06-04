import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

const loadersCss = (isDark: boolean) => {
  const c = isDark ? "#3a3a3a" : "#e0e0e0"
  const cBall = isDark ? "#555" : "rgb(232,232,232)"
  const bdr = isDark ? "#4a4a4a" : "#e2e2e2"
  const shIn1 = isDark ? "rgba(0,0,0,0.5)" : "#d3d2d2ab"
  const shIn2 = isDark ? "rgba(60,60,60,0.5)" : "#e9e9e9ab"
  const shBall = isDark
    ? `rgba(0,0,0,0.4) 0px -10px 10px 0px inset, rgba(0,0,0,0.3) 0px -15px 15px 0px inset, rgba(0,0,0,0.2) 0px -40px 20px 0px inset, rgba(255,255,255,0.03) 0px 2px 1px, rgba(255,255,255,0.05) 0px 4px 2px, rgba(255,255,255,0.05) 0px 8px 4px, rgba(255,255,255,0.05) 0px 16px 8px, rgba(255,255,255,0.05) 0px 32px 16px, 0px -1px 15px -8px rgba(255,255,255,0.05)`
    : `rgba(0,0,0,0.17) 0px -10px 10px 0px inset, rgba(0,0,0,0.15) 0px -15px 15px 0px inset, rgba(0,0,0,0.1) 0px -40px 20px 0px inset, rgba(0,0,0,0.06) 0px 2px 1px, rgba(0,0,0,0.09) 0px 4px 2px, rgba(0,0,0,0.09) 0px 8px 4px, rgba(0,0,0,0.09) 0px 16px 8px, rgba(0,0,0,0.09) 0px 32px 16px, 0px -1px 15px -8px rgba(0,0,0,0.09)`

  return `
  .lc-wrap { position: relative; width: 11em; height: 11em; flex-shrink: 0; transform: scale(0.75); }
  .lc-bars, .lc-balls { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
  .lc-bar { position: absolute; width: 1.15em; height: 13em; border-radius: 50px; background: ${c}; }
  .lc-bar::after {
    content: ""; position: absolute; left: 0; top: 0; width: 1.15em; height: 5em;
    background: ${c}; border-radius: 50px; border: 1px solid ${bdr};
    box-shadow: inset 5px 5px 15px ${shIn1}, inset -5px -5px 15px ${shIn2};
    mask-image: linear-gradient(to bottom, black calc(100% - 48px), transparent 100%);
  }
  .lc-bar::before {
    content: ""; position: absolute; bottom: 0; right: 0; width: 1.15em; height: 4.5em;
    background: ${c}; border-radius: 50px; border: 1px solid ${bdr};
    box-shadow: inset 5px 5px 15px ${shIn1}, inset -5px -5px 15px ${shIn2};
    mask-image: linear-gradient(to top, black calc(100% - 48px), transparent 100%);
  }
  .lc-ball-wrap { position: absolute; width: 1.15em; height: 13em; border-radius: 50px; background: transparent; }
  .lc-ball {
    width: 1.15em; height: 1.15em; border-radius: 50%;
    box-shadow: ${shBall};
    background-color: ${cBall};
    animation: 3.63s move ease-in-out infinite;
  }
  .lc-bar:nth-child(2), .lc-ball-wrap:nth-child(2) { transform: rotate(20deg); }
  .lc-bar:nth-child(3), .lc-ball-wrap:nth-child(3) { transform: rotate(40deg); }
  .lc-bar:nth-child(4), .lc-ball-wrap:nth-child(4) { transform: rotate(60deg); }
  .lc-bar:nth-child(5), .lc-ball-wrap:nth-child(5) { transform: rotate(80deg); }
  .lc-bar:nth-child(6), .lc-ball-wrap:nth-child(6) { transform: rotate(100deg); }
  .lc-bar:nth-child(7), .lc-ball-wrap:nth-child(7) { transform: rotate(120deg); }
  .lc-bar:nth-child(8), .lc-ball-wrap:nth-child(8) { transform: rotate(140deg); }
  .lc-bar:nth-child(9), .lc-ball-wrap:nth-child(9) { transform: rotate(160deg); }
  .lc-ball-1 { animation-delay: 0.2s; }
  .lc-ball-2 { animation-delay: 0.4s; }
  .lc-ball-3 { animation-delay: 0.6s; }
  .lc-ball-4 { animation-delay: 0.8s; }
  .lc-ball-5 { animation-delay: 1s; }
  .lc-ball-6 { animation-delay: 1.2s; }
  .lc-ball-7 { animation-delay: 1.4s; }
  .lc-ball-8 { animation-delay: 1.6s; }
  @keyframes move {
    0% { transform: translateY(0em); }
    50% { transform: translateY(12em); }
    100% { transform: translateY(0em); }
  }
`}

function Loader({ className, ...props }: React.ComponentProps<"div">) {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"))
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return (
    <div
      data-slot="loader"
      className={cn("flex items-center justify-center py-8 overflow-hidden", className)}
      {...props}
    >
      <style>{loadersCss(isDark)}</style>
      <div className="lc-wrap">
        <div className="lc-bars">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="lc-bar" />
          ))}
        </div>
        <div className="lc-balls">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="lc-ball-wrap">
              <div className={`lc-ball lc-ball-${i}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { Loader }
