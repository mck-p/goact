import Pino from 'pino'

export default Pino({
  name: 'Client',
  mixin: () => ({
    version: process.env.VERSION,
  }),
  serializers: Pino.stdSerializers,
  level: process.env.LOG_LEVEL || 'trace',
})
