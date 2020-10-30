import { EnvVar, OptEnvVar } from './index'

export const config = {
  env: OptEnvVar('string', 'NODE_ENV') ?? 'development',
  port: OptEnvVar('number', 'PORT') ?? 3000,
  jwt: {
    secret: EnvVar('string', 'JWT_SECRET'),
  },
}
