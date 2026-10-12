export const metadata = {
  title: 'Agrousado.cl - Tractores que ya trabajaron la tierra',
  description: 'Vitrina de tractores usados en Osorno, Temuco, Valdivia. Contacto directo con dueño.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'Inter, system-ui, sans-serif', background: '#f7f7f5' }}>
        {children}
      </body>
    </html>
  )
}
