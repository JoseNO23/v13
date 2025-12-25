export default function HomePage() {
  return (
    <section style={{ maxWidth: '420px', width: '100%', background: '#1e293b', padding: '2rem', borderRadius: '16px' }}>
      <h1 style={{ marginTop: 0 }}>storiesV13 · Autenticación</h1>
      <p>
        Usa los enlaces superiores para registrarte o iniciar sesión. Esta interfaz mínima consume el backend NestJS
        en <strong>http://localhost:4000</strong>.
      </p>
    </section>
  );
}