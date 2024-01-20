import Pino from 'pino'

export default Pino({
  name: 'Client',
  mixin: () => ({
    version: process.env.VERSION,
  }),
  serializers: Pino.stdSerializers,
})
