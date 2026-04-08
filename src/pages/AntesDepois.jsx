import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'

const page = { padding: '24px 20px', maxWidth: '480px', margin: '0 auto' }
const card = { background: '#141414', borderRadius: '20px', padding: '24px', marginBottom: '16px', border: '1px solid #1e1e1e' }
const fadeIn = `@keyframes b2-fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`

function drawCover(ctx, img, x, y, w, h) {
  const ir = img.width / img.height, br = w / h
  let sx, sy, sw, sh
  if (ir > br) { sh = img.height; sw = sh * br; sx = (img.width - sw) / 2; sy = 0 } else { sw = img.width; sh = sw / br; sx = 0; sy = (img.height - sh) / 2 }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}

function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath() }

export default function AntesDepois() {
  const navigate = useNavigate()
  const [nomeUsuario] = useLocalStorage('b2_nome', '')
  const [step, setStep] = useState(1)
  const [fotoBefore, setFotoBefore] = useState(null)
  const [fotoAfter, setFotoAfter] = useState(null)
  const [nomeCliente, setNomeCliente] = useState('')
  const [servico, setServico] = useState('')
  const [focused, setFocused] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const fileRefBefore = useRef(null)
  const fileRefAfter = useRef(null)
  const canvasRef = useRef(null)

  function handleFile(e, setter) { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => setter(ev.target.result); reader.readAsDataURL(file) }
  const canProceed = step === 1 ? fotoBefore !== null : step === 2 ? fotoAfter !== null : true
  function nextStep() { if (step < 4) setStep(step + 1) }
  function prevStep() { if (step > 1) setStep(step - 1) }

  const generateCard = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas || !fotoBefore || !fotoAfter) return
    const W = 1080, H = 1350; canvas.width = W; canvas.height = H; const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, W, H)
    const imgBefore = new Image(); const imgAfter = new Image()
    let loaded = 0
    const onLoad = () => {
      loaded++; if (loaded < 2) return
      const photoH = H - 180, halfW = W / 2 - 2
      drawCover(ctx, imgBefore, 0, 0, halfW, photoH)
      drawCover(ctx, imgAfter, W / 2 + 2, 0, halfW, photoH)
      ctx.fillStyle = '#FF6B35'; ctx.fillRect(W / 2 - 2, 0, 4, photoH)
      ctx.font = 'bold 28px Sora, sans-serif'
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; roundRect(ctx, 20, photoH - 60, 130, 44, 10); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.fillText('ANTES', 40, photoH - 28)
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; roundRect(ctx, W / 2 + 22, photoH - 60, 140, 44, 10); ctx.fill(); ctx.fillStyle = '#ffffff'; ctx.fillText('DEPOIS', W / 2 + 40, photoH - 28)
      const footerY = photoH + 20
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 32px Sora, sans-serif'; ctx.fillText(nomeCliente || 'Cliente', 30, footerY + 35)
      ctx.fillStyle = '#a0a0a0'; ctx.font = '24px Sora, sans-serif'; ctx.fillText(servico || 'Transformação', 30, footerY + 70)
      ctx.fillStyle = '#FF6B35'; ctx.font = 'bold 24px Space Grotesk, sans-serif'; const proName = nomeUsuario || 'B2 Pro'; ctx.fillText(proName, W - ctx.measureText(proName).width - 30, footerY + 50)
      canvas.toBlob((blob) => { if (!blob) return; const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `antes-depois-${Date.now()}.png`; a.click(); URL.revokeObjectURL(url); setShowSuccess(true); setTimeout(() => setShowSuccess(false), 2500) }, 'image/png')
    }
    imgBefore.onload = onLoad; imgAfter.onload = onLoad; imgBefore.src = fotoBefore; imgAfter.src = fotoAfter
  }, [fotoBefore, fotoAfter, nomeCliente, servico, nomeUsuario])

  const inputStyle = (name) => ({ width: '100%', padding: '14px 16px', background: '#141414', border: `2px solid ${focused === name ? '#FF6B35' : '#1e1e1e'}`, borderRadius: '14px', color: '#ffffff', fontSize: '14px', fontFamily: 'Sora, sans-serif', outline: 'none', transition: 'border-color 0.2s' })
  const btnPrimary = { width: '100%', padding: '18px', background: 'linear-gradient(135deg, #FF6B35, #ff8c42)', border: 'none', borderRadius: '16px', color: '#ffffff', fontSize: '16px', fontWeight: 700, fontFamily: 'Sora, sans-serif', cursor: 'pointer', boxShadow: '0 4px 24px rgba(255,107,53,0.3)' }
  const btnSecondary = { width: '100%', padding: '16px', background: 'none', border: '2px solid #1e1e1e', borderRadius: '16px', color: '#a0a0a0', fontSize: '14px', fontWeight: 500, fontFamily: 'Sora, sans-serif', cursor: 'pointer', marginTop: '10px' }

  return (
    <div style={page}>
      <style>{fadeIn}</style>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>Antes & Depois</div>
      <div style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '28px', lineHeight: 1.5 }}>Tire as fotos, o app gera o card pronto pra postar.</div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
        {[1, 2, 3, 4].map((s) => (<div key={s} style={{ width: '32px', height: '4px', borderRadius: '2px', background: step > s ? '#22c55e' : step === s ? '#FF6B35' : '#1e1e1e', transition: 'background 0.3s' }} />))}
      </div>

      {step === 1 && (
        <div style={card}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#a0a0a0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Foto antes do serviço</div>
          <input ref={fileRefBefore} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => handleFile(e, setFotoBefore)} />
          <div onClick={() => fileRefBefore.current?.click()} style={{ width: '100%', aspectRatio: '3/4', background: '#1a1a1a', borderRadius: '16px', border: fotoBefore ? '2px solid #FF6B35' : '2px dashed #2a2a2a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
            {fotoBefore ? (<><img src={fotoBefore} alt="Antes" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /><button onClick={(e) => { e.stopPropagation(); setFotoBefore(null) }} style={{ position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: '1px solid #333', color: '#ffffff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button></>) : (<><div style={{ fontSize: '48px', marginBottom: '12px' }}>📸</div><div style={{ fontSize: '14px', color: '#a0a0a0', fontWeight: 500 }}>Tirar foto ANTES</div><div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Toque para abrir câmera</div></>)}
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={card}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#a0a0a0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Foto depois do serviço</div>
          <input ref={fileRefAfter} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => handleFile(e, setFotoAfter)} />
          <div onClick={() => fileRefAfter.current?.click()} style={{ width: '100%', aspectRatio: '3/4', background: '#1a1a1a', borderRadius: '16px', border: fotoAfter ? '2px solid #FF6B35' : '2px dashed #2a2a2a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
            {fotoAfter ? (<><img src={fotoAfter} alt="Depois" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /><button onClick={(e) => { e.stopPropagation(); setFotoAfter(null) }} style={{ position: 'absolute', top: '10px', right: '10px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: '1px solid #333', color: '#ffffff', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button></>) : (<><div style={{ fontSize: '48px', marginBottom: '12px' }}>📸</div><div style={{ fontSize: '14px', color: '#a0a0a0', fontWeight: 500 }}>Tirar foto DEPOIS</div><div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Toque para abrir câmera</div></>)}
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={card}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: '#a0a0a0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Informações do card</div>
          <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontFamily: 'Space Grotesk, sans-serif' }}>Nome do cliente (opcional)</label><input type="text" placeholder="Ex: João" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} onFocus={() => setFocused('nome')} onBlur={() => setFocused(null)} style={inputStyle('nome')} /></div>
          <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontSize: '12px', color: '#a0a0a0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontFamily: 'Space Grotesk, sans-serif' }}>Serviço realizado (opcional)</label><input type="text" placeholder="Ex: Degradê com navalha" value={servico} onChange={(e) => setServico(e.target.value)} onFocus={() => setFocused('servico')} onBlur={() => setFocused(null)} style={inputStyle('servico')} /></div>
        </div>
      )}

      {step === 4 && (
        <>
          <div style={{ background: '#0a0a0a', borderRadius: '20px', overflow: 'hidden', border: '1px solid #1e1e1e', marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
              <div style={{ aspectRatio: '3/4', overflow: 'hidden', position: 'relative' }}>{fotoBefore && <img src={fotoBefore} alt="Antes" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}<span style={{ position: 'absolute', bottom: '8px', left: '8px', padding: '4px 10px', background: 'rgba(0,0,0,0.7)', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: '#ffffff', textTransform: 'uppercase' }}>Antes</span></div>
              <div style={{ aspectRatio: '3/4', overflow: 'hidden', position: 'relative' }}>{fotoAfter && <img src={fotoAfter} alt="Depois" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}<span style={{ position: 'absolute', bottom: '8px', left: '8px', padding: '4px 10px', background: 'rgba(255,107,53,0.8)', borderRadius: '6px', fontSize: '11px', fontWeight: 600, color: '#ffffff', textTransform: 'uppercase' }}>Depois</span></div>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><div style={{ fontFamily: 'Sora, sans-serif', fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>{nomeCliente || 'Cliente'}</div><div style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '2px' }}>{servico || 'Transformação'}</div></div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', fontWeight: 700, color: '#FF6B35' }}>{nomeUsuario || 'B2 Pro'}</div>
            </div>
          </div>
          <button style={btnPrimary} onClick={generateCard}>Baixar card em alta qualidade</button>
          <button style={btnSecondary} onClick={() => setStep(1)}>Refazer fotos</button>
        </>
      )}

      {step < 4 && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          {step > 1 && <button style={{ ...btnSecondary, marginTop: 0, flex: 1 }} onClick={prevStep}>← Voltar</button>}
          <button onClick={nextStep} disabled={!canProceed} style={{ ...btnPrimary, flex: 1, opacity: canProceed ? 1 : 0.4, cursor: canProceed ? 'pointer' : 'not-allowed' }}>{step === 3 ? 'Ver preview' : 'Próximo →'}</button>
        </div>
      )}

      {showSuccess && (<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10,10,10,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '24px', animation: 'b2-fadeIn 0.3s ease' }}><div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div><div style={{ fontFamily: 'Sora, sans-serif', fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Card salvo!</div><div style={{ fontSize: '14px', color: '#a0a0a0', textAlign: 'center' }}>Pronto pra postar nos stories e atrair clientes novos.</div></div>)}
    </div>
  )
}
