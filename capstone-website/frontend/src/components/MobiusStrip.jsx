import { useEffect, useRef } from 'react'

const PALETTE = [[0,255,224],[0,180,216],[167,139,250]]

function lerpColor(a, b, t) {
  return [(a[0]+(b[0]-a[0])*t)|0,(a[1]+(b[1]-a[1])*t)|0,(a[2]+(b[2]-a[2])*t)|0]
}
function colorAt(u) {
  const n = PALETTE.length
  const t = (u / (2*Math.PI)) * n
  const i = Math.floor(t) % n
  return lerpColor(PALETTE[i], PALETTE[(i+1)%n], t - Math.floor(t))
}
function mobiusPoint(u, v) {
  const R=1.1, hw=0.44
  const c2=Math.cos(u/2), s2=Math.sin(u/2), cu=Math.cos(u), su=Math.sin(u)
  return { x:(R+hw*v*c2)*cu, y:(R+hw*v*c2)*su, z:hw*v*s2 }
}
function rotate(px,py,pz,ax,ay) {
  let y = py*Math.cos(ax)-pz*Math.sin(ax)
  let z = py*Math.sin(ax)+pz*Math.cos(ax)
  let x = px*Math.cos(ay)+z*Math.sin(ay)
  z = -px*Math.sin(ay)+z*Math.cos(ay)
  return {x,y,z}
}
function project(x,y,z,cx,cy,s) {
  const f = 5, pz = f/(f+z+1.2)
  return {x:cx+x*s*pz, y:cy+y*s*pz}
}

export default function MobiusStrip({ opacity=0.45 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W=0, H=0, animId=null, angle=0
    const dpr = window.devicePixelRatio || 1
    const U=90, V=16

    function resize() {
      W = canvas.width  = Math.round(canvas.offsetWidth*dpr)
      H = canvas.height = Math.round(canvas.offsetHeight*dpr)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    function draw() {
      if (!W||!H) { animId=requestAnimationFrame(draw); return }
      ctx.clearRect(0,0,W,H)

      const cx=W/2, cy=H/2, scale=Math.min(W,H)*0.24
      const ax = 0.38+Math.sin(angle*0.28)*0.12
      const ay = angle*0.75

      const quads = []
      for (let i=0;i<U;i++) {
        const u0=(i/U)*2*Math.PI, u1=((i+1)/U)*2*Math.PI, um=(u0+u1)/2
        for (let j=0;j<V-1;j++) {
          const v0=-1+(j/(V-1))*2, v1=-1+((j+1)/(V-1))*2
          const r00=rotate(...Object.values(mobiusPoint(u0,v0)),ax,ay)
          const r10=rotate(...Object.values(mobiusPoint(u1,v0)),ax,ay)
          const r01=rotate(...Object.values(mobiusPoint(u0,v1)),ax,ay)
          const r11=rotate(...Object.values(mobiusPoint(u1,v1)),ax,ay)
          quads.push({
            p00:project(r00.x,r00.y,r00.z,cx,cy,scale),
            p10:project(r10.x,r10.y,r10.z,cx,cy,scale),
            p01:project(r01.x,r01.y,r01.z,cx,cy,scale),
            p11:project(r11.x,r11.y,r11.z,cx,cy,scale),
            avgZ:(r00.z+r10.z+r01.z+r11.z)/4,
            col:colorAt(um),
          })
        }
      }
      quads.sort((a,b)=>a.avgZ-b.avgZ)

      for (const {p00,p10,p01,p11,col} of quads) {
        ctx.beginPath()
        ctx.moveTo(p00.x,p00.y)
        ctx.lineTo(p10.x,p10.y)
        ctx.lineTo(p11.x,p11.y)
        ctx.lineTo(p01.x,p01.y)
        ctx.closePath()
        ctx.fillStyle=`rgba(${col[0]},${col[1]},${col[2]},0.07)`
        ctx.fill()
        ctx.strokeStyle=`rgba(${col[0]},${col[1]},${col[2]},0.2)`
        ctx.lineWidth=0.7
        ctx.stroke()
      }

      angle += 0.005
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity, pointerEvents:'none' }}
    />
  )
}
