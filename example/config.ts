import {
  bool,
  num,
  str,
  optional,
  Enum,
  EnvVars,
} from '../index'

const nodeEnv = new Enum(['development', 'staging', 'production'])

const envVars = new EnvVars({
  NODE_ENV: optional(nodeEnv.enum, 'development'),
  HOST: optional(str, 'localhost'),
  PORT: num,
  DEBUG: optional(bool, true),
  JWT_SECRET: str,
})

const env = envVars.resolve()

export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  debug: env.DEBUG,
  jwt: {
    secret: env.JWT_SECRET,
  },
}
