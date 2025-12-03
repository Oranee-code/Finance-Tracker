import server from './server.ts'

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '0.0.0.0' // Listen on all network interfaces

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`)
  // eslint-disable-next-line no-console
  console.log(`Access from network: http://<your-ip>:${PORT}`)
})
