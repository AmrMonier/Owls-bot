import express from "express"

const server =  express()
server.all('/', (req, res) => {
  return res.json({status: 'online'})
})
export function KeepAlive () {
  server.listen(3030)
}