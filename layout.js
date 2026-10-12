
export const metadata = {
  title: 'Agrousados.cl - Maquinaria Agrícola Usada',
  description: 'Venta de tractores y maquinaria agrícola usada en Osorno, Temuco, Valdivia'
}
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{margin:0, fontFamily:'Inter, system-ui, sans-serif', background:'#F6F6F3'}}>
        {children}
      </body>
    </html>
  )
}
