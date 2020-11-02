import {
  bool,
  num,
  str,
  enu,
  url,
  EnvVars,
} from '../index'

const envVars = new EnvVars({
  NODE_ENV: enu(['development', 'staging', 'production']).default('development'),
  HOST: str().default('localhost'),
  PORT: num().required(),
  DEBUG: bool().default(true),
  JWT_SECRET: str().required(),
  AUTH_API: url().default(new URL('http://gateway.localhost.localdomain/api/v1/auth')),
})

const env = envVars.resolve()

export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  debug: env.DEBUG,
  jwt: {
    privateKey: env.JWT_SECRET,
  },
  apiUrl: {
    auth: env.AUTH_API,
  },
}

// generate .env example file

// const runningAsScript = require.main === module
// if (runningAsScript) {
//   const [,, filepath] = process.argv
//   fs.promises.writeFile(filepath ?? './.env.example', envVars.example())
//     .then(() => process.exit(0))
//     .catch(e => {
//       console.error(e)
//       process.exit(1)
//     })
// }
