This is a template builded whit

Nextjs
tailwindcss
pwa optimization

[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, set the environment variables

I using JSON.stringify to convert the firebase object into a string

// .env

```
  NEXT_PUBLIC_ENV=dev
  NEXT_PUBLIC_FIREBASE_CONFIG=<string>

```

If you what use testing you should set test environment variables

// .env.test

```

  VITE_NEXT_PUBLIC_FIREBASE_CONFIG=<string>
  VITE_ENV=test

```

now you can run

```
  yarn vitest

```

Second, run the development server:

```bash
npm run dev
# or
yarn dev
```
