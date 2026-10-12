
'use client'
import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const MARCAS = ['Todas','John Deere','New Holland','Massey Ferguson','Valtra','Kubota','Otra']

const MOCK = [
  {id:'1', marca:'John Deere', modelo:'5075E', anio:2019, horas:3200, valor:18500000, documentacion:true, telefono:'56912345678', ciudad:'Osorno', calle:'Ruta U-55 km 7', fotos:['https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800'], youtube_url:'https://www.youtube.com/watch?v=dQw4w9WgXcQ', estado:'aprobado', checkin:true},
  {id:'2', marca:'New Holland', modelo:'T7.175', anio:2017, horas:5400, valor:28000000, documentacion:true, telefono:'56987654321', ciudad:'Temuco', calle:'Fundo El Carmen', fotos:['https://images.unsplash.com/photo-1592985684811-6c0f98adb014?w=800'], youtube_url:'', estado:'aprobado', checkin:true},
  {id:'3', marca:'Massey Ferguson', modelo:'7719', anio:2020, horas:2100, valor:35000000, documentacion:false, telefono:'56911223344', ciudad:'Valdivia', fotos:['https://images.unsplash.com/photo-1625602812206-5d6d16b1eeb4?w=800'], youtube_url:'', estado:'aprobado', checkin:true},
]

function youtubeId(url){
  if(!url) return null
  const m = url.match(/(?:youtube\.com.*v=|youtu\.be\/)([^&]+)/)
  return m? m[1] : null
}

export default function Page(){
  const [tractores, setTractores] = useState(MOCK)
  const [filtro, setFiltro] = useState({marca:'Todas', modelo:'', valorMax:'', anioMin:'', horasMax:'', ciudad:''})
  const [sel, setSel] = useState(null)
  const [showSell, setShowSell] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [pendientes, setPendientes] = useState([])

  useEffect(()=>{ fetchTractores() },[])
  async function fetchTractores(){
    if(!process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http')){ return }
    const { data } = await supabase.from('tractores').select('*').eq('estado','aprobado').order('created_at',{ascending:false})
    if(data && data.length) setTractores(data)
    const { data: pend } = await supabase.from('tractores').select('*').eq('estado','pendiente').order('created_at',{ascending:false})
    if(pend) setPendientes(pend)
  }

  const filtrados = tractores.filter(t=>{
    if(filtro.marca!=='Todas' && t.marca!==filtro.marca) return false
    if(filtro.modelo && !t.modelo.toLowerCase().includes(filtro.modelo.toLowerCase())) return false
    if(filtro.valorMax && t.valor > parseInt(filtro.valorMax)) return false
    if(filtro.anioMin && t.anio < parseInt(filtro.anioMin)) return false
    if(filtro.horasMax && t.horas > parseInt(filtro.horasMax)) return false
    if(filtro.ciudad && !t.ciudad.toLowerCase().includes(filtro.ciudad.toLowerCase())) return false
    return true
  })

  function copiarTexto(t){
    const txt = `🚜 ${t.marca} ${t.modelo} - ${t.anio} - ${t.horas}h - $${(t.valor/1000000).toFixed(1)}M - ${t.ciudad}\nMira en Agrousados.cl`
    navigator.clipboard.writeText(txt)
    alert('Copiado para Facebook / Instagram')
  }
  function copiarLink(t){
    navigator.clipboard.writeText(`https://agrousado.cl/tractor/${t.id}`)
    alert('Link copiado')
  }

  return (
    <>
      <style>{`
        .header{ background:#000; padding:12px 24px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:20}
        .logo{ height:96px; width:auto; object-fit:contain }
        .btn-naranja{ background:#FF6B00; color:white; border:none; padding:12px 22px; border-radius:999px; font-weight:800; cursor:pointer; letter-spacing:.5px}
        .card{ background:white; border-radius:18px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.06); cursor:pointer; transition:.2s}
        .card:hover{ transform:translateY(-3px)}
        .filtros{ background:white; padding:16px; border-radius:16px; display:grid; grid-template-columns: repeat(auto-fit,minmax(160px,1fr)); gap:12px; margin:18px 0}
        input,select{ padding:10px 12px; border:1px solid #ddd; border-radius:10px; width:100%}
        .badge{ font-size:11px; padding:4px 8px; border-radius:999px; font-weight:700}
      `}</style>

      <header className="header">
        <img src="/logo.jpg" alt="Agrousado" className="logo"/>
        <button className="btn-naranja" onClick={()=>setShowSell(true)}>+ VENDE TU TRACTOR</button>
      </header>

      <main style={{maxWidth:1200, margin:'0 auto', padding:'18px'}}>
        <div style={{background:'#E8EFE2', borderRadius:28, padding:'28px', marginBottom:18}}>
          <div style={{color:'#2E5A2E', fontSize:12, letterSpacing:2}}>EN LÍNEA AHORA · OSORNO, TEMUCO, VALDIVIA</div>
          <h1 style={{fontFamily:'Georgia', fontStyle:'italic', fontSize:48, lineHeight:.9, margin:'12px 0'}}>Tractores que ya<br/>trabajaron la tierra.</h1>
          <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:16}}>
            <span className="badge" style={{background:'white'}}><span style={{color:'#2ecc71'}}>●</span> WhatsApp directo</span>
            <span className="badge" style={{background:'white'}}><span style={{color:'#3498db'}}>●</span> Check-in verificado</span>
            <span className="badge" style={{background:'white'}}><span style={{color:'#FF6B00'}}>●</span> Sin comisión</span>
          </div>
        </div>

        <div className="filtros">
          <select value={filtro.marca} onChange={e=>setFiltro({...filtro, marca:e.target.value})}>{MARCAS.map(m=><option key={m}>{m}</option>)}</select>
          <input placeholder="Modelo" value={filtro.modelo} onChange={e=>setFiltro({...filtro, modelo:e.target.value})}/>
          <input placeholder="Valor máx CLP" type="number" value={filtro.valorMax} onChange={e=>setFiltro({...filtro, valorMax:e.target.value})}/>
          <input placeholder="Año desde" type="number" value={filtro.anioMin} onChange={e=>setFiltro({...filtro, anioMin:e.target.value})}/>
          <input placeholder="Horas máx" type="number" value={filtro.horasMax} onChange={e=>setFiltro({...filtro, horasMax:e.target.value})}/>
          <input placeholder="Ciudad" value={filtro.ciudad} onChange={e=>setFiltro({...filtro, ciudad:e.target.value})}/>
        </div>

        <h2 style={{margin:'18px 0'}}>Maquinaria Disponible · {filtrados.length}</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:18}}>
          {filtrados.map(t=>(
            <div key={t.id} className="card" onClick={()=>setSel(t)}>
              <img src={t.fotos?.[0]} style={{width:'100%', height:180, objectFit:'cover'}}/>
              <div style={{padding:14}}>
                <div style={{fontWeight:800}}>{t.marca} {t.modelo}</div>
                <div style={{fontSize:13, color:'#666'}}>{t.anio} · {t.horas}h · {t.ciudad} · {t.documentacion?'DOC SÍ':'DOC NO'}</div>
                <div style={{fontWeight:900, fontSize:20, marginTop:6}}>${(t.valor/1000000).toFixed(1)}M</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {sel && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:30, display:'flex', alignItems:'center', justifyContent:'center', padding:12}} onClick={()=>setSel(null)}>
          <div style={{background:'white', maxWidth:900, width:'100%', borderRadius:20, overflow:'auto', maxHeight:'90vh'}} onClick={e=>e.stopPropagation()}>
            <div style={{position:'relative'}}>
              <img src={sel.fotos?.[0]} style={{width:'100%', height:380, objectFit:'cover'}}/>
              <button onClick={()=>setSel(null)} style={{position:'absolute', top:12, right:12, background:'black', color:'white', borderRadius:999, width:36, height:36, border:'none', cursor:'pointer'}}>X</button>
            </div>
            <div style={{padding:18, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
              <div>
                <h2>{sel.marca} {sel.modelo}</h2>
                <p>Año: {sel.anio} · Horas: {sel.horas} · Doc: {sel.documentacion?'Sí':'No'}</p>
                <p>Ciudad: {sel.ciudad} {sel.calle?'- '+sel.calle:''}</p>
                <p style={{fontSize:22, fontWeight:900}}>${sel.valor?.toLocaleString('es-CL')} CLP</p>
                {youtubeId(sel.youtube_url) && <iframe width="100%" height="200" src={`https://www.youtube.com/embed/${youtubeId(sel.youtube_url)}`} style={{borderRadius:12, border:'none'}}></iframe>}
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(90px,1fr))', gap:6, marginTop:10}}>
                  {sel.fotos?.slice(0,10).map((f,i)=><img key={i} src={f} style={{width:'100%', height:70, objectFit:'cover', borderRadius:8}}/>) }
                </div>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:8}}>
                <a href={`https://wa.me/56${String(sel.telefono).replace(/[^0-9]/g,'').slice(-9)}?text=Hola, me interesa tu ${sel.marca} ${sel.modelo} en Agrousado`} target="_blank" style={{background:'#25D366', color:'white', padding:14, borderRadius:12, textAlign:'center', textDecoration:'none', fontWeight:800}}>WhatsApp Dueño</a>
                <button onClick={()=>copiarTexto(sel)} style={{padding:12, borderRadius:12, border:'1px solid #ddd', cursor:'pointer'}}>Copiar para Face / IG</button>
                <button onClick={()=>copiarLink(sel)} style={{padding:12, borderRadius:12, border:'1px solid #ddd', cursor:'pointer'}}>Copiar Link</button>
                <div style={{fontSize:12, color:'#666', marginTop:10}}>Contacto directo con dueño. Agrousados.cl solo vitrina.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSell && (
        <SellForm onClose={()=>setShowSell(false)} onSaved={(nuevo)=>{ setShowSell(false); alert('¡Recibido! Queda pendiente de revisión (24h)'); fetchTractores(); }}/>
      )}

      <footer style={{textAlign:'center', padding:24, color:'#888', fontSize:12}}>
        <span onClick={()=>setShowAdmin(true)} style={{cursor:'pointer', textDecoration:'underline'}}>Admin</span> · Agrousado.cl © 2026
      </footer>

      {showAdmin && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.7)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{background:'white', padding:24, borderRadius:16, width:400}}>
            {!isAdmin ? <>
              <h3>Clave Admin</h3>
              <input type="password" value={adminKey} onChange={e=>setAdminKey(e.target.value)} placeholder="Clave"/>
              <div style={{display:'flex', gap:8, marginTop:12}}>
                <button onClick={()=>{ if(adminKey==='1990'){ setIsAdmin(true); } else alert('Clave incorrecta'); }} className="btn-naranja">Entrar</button>
                <button onClick={()=>setShowAdmin(false)}>Cerrar</button>
              </div>
            </>: <>
              <h3>Pendientes ({pendientes.length})</h3>
              {pendientes.map(p=>(
                <div key={p.id} style={{border:'1px solid #eee', padding:8, margin:'6px 0', borderRadius:8}}>
                  <b>{p.marca} {p.modelo}</b> - {p.ciudad}
                  <div style={{display:'flex', gap:6, marginTop:6}}>
                    <button onClick={async()=>{
                      if(process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http')){
                        await supabase.from('tractores').update({estado:'aprobado'}).eq('id',p.id)
                      }
                      setPendientes(pendientes.filter(x=>x.id!==p.id)); fetchTractores()
                    }} style={{background:'#2ecc71', color:'white', border:'none', padding:'6px 10px', borderRadius:8, cursor:'pointer'}}>Aprobar</button>
                    <button onClick={async()=>{
                      if(process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http')){
                        await supabase.from('tractores').update({estado:'baja'}).eq('id',p.id)
                      }
                      setPendientes(pendientes.filter(x=>x.id!==p.id))
                    }} style={{background:'#e74c3c', color:'white', border:'none', padding:'6px 10px', borderRadius:8, cursor:'pointer'}}>Rechazar / Baja</button>
                  </div>
                </div>
              ))}
              <button onClick={()=>setShowAdmin(false)} style={{marginTop:12}}>Cerrar</button>
            </>}
          </div>
        </div>
      )}
    </>
  )
}

function SellForm({onClose, onSaved}){
  const [form, setForm] = useState({marca:'John Deere', modelo:'', anio:'', horas:'', valor:'', telefono:'', ciudad:'Osorno', calle:'', documentacion:'Sí', youtube_url:''})
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    try{
      let fotoUrls=[]
      if(process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http') && files.length){
        for(let f of Array.from(files).slice(0,10)){
          const name = `${Date.now()}-${f.name}`
          const { data, error } = await supabase.storage.from('tractor-fotos').upload(name, f)
          if(!error){
            const { data: urlData } = supabase.storage.from('tractor-fotos').getPublicUrl(name)
            fotoUrls.push(urlData.publicUrl)
          }
        }
      } else {
        fotoUrls = ['https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800']
      }
      const payload = {
        marca: form.marca,
        modelo: form.modelo,
        anio: parseInt(form.anio),
        horas: parseInt(form.horas),
        valor: parseInt(form.valor),
        telefono: form.telefono,
        ciudad: form.ciudad,
        calle: form.calle,
        documentacion: form.documentacion==='Sí',
        youtube_url: form.youtube_url,
        fotos: fotoUrls,
        estado: 'pendiente'
      }
      if(process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http')){
        await supabase.from('tractores').insert(payload)
      }
      onSaved(payload)
    }catch(err){ alert('Error: '+err.message) }
    setLoading(false)
  }
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:40, display:'flex', alignItems:'center', justifyContent:'center', padding:12}}>
      <form onSubmit={handleSubmit} style={{background:'white', maxWidth:600, width:'100%', borderRadius:20, padding:20, maxHeight:'90vh', overflow:'auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h3>VENDE TU TRACTOR / MÁQUINA</h3>
          <button type="button" onClick={onClose} style={{border:'none', background:'black', color:'white', borderRadius:999, width:32, height:32, cursor:'pointer'}}>X</button>
        </div>
        <p style={{fontSize:13, color:'#666'}}>Completa los datos de tu equipo. Lo revisamos y lo publicamos en menos de 24h.</p>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12}}>
          <div><label>MARCA *</label><select value={form.marca} onChange={e=>setForm({...form, marca:e.target.value})}><option>John Deere</option><option>New Holland</option><option>Massey Ferguson</option><option>Valtra</option><option>Kubota</option><option>Otra</option></select></div>
          <div><label>MODELO *</label><input required value={form.modelo} onChange={e=>setForm({...form, modelo:e.target.value})} placeholder="Ej: 5075E"/></div>
          <div><label>AÑO</label><input type="number" value={form.anio} onChange={e=>setForm({...form, anio:e.target.value})}/></div>
          <div><label>HORAS</label><input type="number" value={form.horas} onChange={e=>setForm({...form, horas:e.target.value})}/></div>
          <div><label>DOCUMENTACIÓN</label><select value={form.documentacion} onChange={e=>setForm({...form, documentacion:e.target.value})}><option>Sí</option><option>No</option></select></div>
          <div><label>VALOR CLP *</label><input required type="number" value={form.valor} onChange={e=>setForm({...form, valor:e.target.value})}/></div>
          <div><label>TELÉFONO DUEÑO *</label><input required value={form.telefono} onChange={e=>setForm({...form, telefono:e.target.value})} placeholder="9 1234 5678"/></div>
          <div><label>CIUDAD</label><input value={form.ciudad} onChange={e=>setForm({...form, ciudad:e.target.value})}/></div>
          <div style={{gridColumn:'1 / -1'}}><label>CALLE / PREDIO</label><input value={form.calle} onChange={e=>setForm({...form, calle:e.target.value})} placeholder="Ruta, Fundo..."/></div>
          <div style={{gridColumn:'1 / -1'}}><label>VIDEO YOUTUBE (15 seg)</label><input value={form.youtube_url} onChange={e=>setForm({...form, youtube_url:e.target.value})} placeholder="https://youtube.com/..."/></div>
          <div style={{gridColumn:'1 / -1'}}><label>FOTOS (10 máx)</label><input type="file" multiple accept="image/*" onChange={e=>setFiles(e.target.files)}/></div>
        </div>
        <button disabled={loading} className="btn-naranja" style={{width:'100%', marginTop:16}}>{loading?'Subiendo...':'Publicar Tractor'}</button>
      </form>
    </div>
  )
}
