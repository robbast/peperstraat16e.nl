import * as Sentry from '@sentry/browser'

Sentry.init({
  dsn: 'https://f7f1302daf526d2130b03eea44bc5a02@o172628.ingest.us.sentry.io/4507355505819648',
  // Only report errors from the live site, not from `npm run dev` or `npm run preview`
  enabled: import.meta.env.PROD && /(^|\.)peperstraat16e\.nl$/.test(location.hostname),
  environment: import.meta.env.MODE,
})
