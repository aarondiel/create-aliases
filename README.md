# create-aliases

this package serves to parse your tsconfig and to create the appropriate configs
so that when a new path-alias is added you don't have to repeat yourself for it
to work everywhere accordingly.

## installation & basic setup

```sh
npm install create-aliases
```

in vite.config.ts / vite.config.js
```typescript
import { parse_tsconfig, vite_aliases } from "create-aliases"
import type { UserConfig } from "vite"

const [ aliases, directory_root ] = parse_tsconfig()

const config: UserConfig = {
	resolve: {
		alias: vite_aliases(aliases, directory_root)
	}
}

export default config
```
