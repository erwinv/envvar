### Install

```shell
$ npm install @erwinv/envvar
```

### Usage

```TypeScript
import {
  bool,
  num,
  str,
  enu,
  url,
  EnvVars,
} from '@erwinv/envvar'

const envVars = new EnvVars({
  NODE_ENV: enu(['development', 'staging', 'production']).default('development'),
  HOST: str().default('localhost'),
  PORT: num().required(),
  DEBUG: bool().default(true),
  JWT_SECRET: str().required(),
  AUTH_API: url().default(new URL('http://gateway.localhost.localdomain/api/v1/auth')),
})

// fail fast but print all missing/incorrect-type ENV vars
// instead of bailing on the first error
const env = envVars.resolve()
```

#### Type Inferrence

TypeScript will correctly infer the resolved ENV vars types:

```TypeScript
// ...
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

/*
typeof config == {
    env: "development" | "staging" | "production"
    port: number
    debug: boolean
    jwt: {
        privateKey: string
    };
    apiUrl: {
        auth: URL
    }
}
*/
```

This will enable autocompletion and real-time type-checking for supported IDE's (e.g., VSCode).

#### Generate dot env example file

Default values for optional ENV vars will be emitted on the output example file.

```TypeScript
const runningAsScript = require.main === module

if (runningAsScript) {
  const [,, filepath] = process.argv

  fs.promises.writeFile(filepath ?? './.env.example', envVars.example())
    .then(() => process.exit(0))
    .catch(e => {
      console.error(e)
      process.exit(1)
    })
}
```
