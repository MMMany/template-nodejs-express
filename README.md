# Template for Node.js + Express BE application

This is a template project for "Node.js `20.x` LTS + Express" BE application.

## Environment variables

Manage environment variables using `dotenv` and `dotenv-expand`.

> See more in `src/config/dotenv.js`

Default config options:

```js
/**
 * load order
 *
 * 1. `.env`
 * 2. `.env.local` (NODE_ENV is not "test")
 * 3. `.env.${NODE_ENV}`
 * 4. `.env.${NODE_ENV}.local`
 */
{
  path: file,
  override: true,
  debug: NODE_ENV === "development",
  quiet: NODE_ENV !== "development",
  encoding: "utf8",
}
```
