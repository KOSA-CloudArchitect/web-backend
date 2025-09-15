const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

function initSentry(app) {
  if (!process.env.SENTRY_DSN) {
    console.warn('⚠️  SENTRY_DSN not configured, skipping Sentry initialization');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    beforeSend(event) {
      // 민감한 정보 필터링
      if (event.request && event.request.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }
      return event;
    },
  });

  // Request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  console.log('✅ Sentry initialized');
}

function setupSentryErrorHandler(app) {
  // Error handler must be before any other error middleware
  app.use(Sentry.Handlers.errorHandler());
}

module.exports = {
  initSentry,
  setupSentryErrorHandler,
  Sentry
};