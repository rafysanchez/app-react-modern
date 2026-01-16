const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')


const SECRET_KEY = '123456789'
const expiresIn = '1h'

// Create a token from a payload
function createToken(payload){
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token
function verifyToken(token){
  return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

server.use(bodyParser.json())
server.use(middlewares)

server.post('/api/auth/login', (req, res) => {
  const {email, password} = req.body
  const user = router.db.get('users').find(user => user.email === email && user.password === password).value()

  if (!user) {
    const status = 401
    const message = 'Incorrect email or password'
    res.status(status).json({status, message})
    return
  }

  const accessToken = createToken({email: user.email, username: user.username, role: user.role, id: user.id})
  res.status(200).json({ accessToken, refreshToken: "mock-refresh-token", expiresIn: 3600, user: { id: user.id, email: user.email, username: user.username, role: user.role } })
})

server.post('/api/auth/refresh', (req, res) => {
    // For simplicity, we'll just return a new access token
    const accessToken = createToken({email: 'user@example.com', username: 'Test User', role: 'admin', id: '1'})
    res.status(200).json({ accessToken, expiresIn: 3600 })
})


server.use(/^(?!\/auth).*$/,  (req, res, next) => {
  if (req.path.startsWith('/api/auth')) {
    return next();
  }

  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({status, message})
    return
  }
  try {
    let verifyTokenResult;
     verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

     if(verifyTokenResult instanceof Error) {
       const status = 401
       const message = 'Access token not provided'
       res.status(status).json({status, message})
       return
     }
     next()
  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({status, message})
  }
})

server.use('/api', router)

server.listen(3000, () => {
  console.log('JSON Server with auth is running on port 3000')
})
