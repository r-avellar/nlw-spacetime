import { randomUUID } from 'node:crypto'
import { extname, resolve } from 'node:path'
import { FastifyInstance } from 'fastify'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

const pump = promisify(pipeline)

export async function uploadRotes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_88, // 5mb
      },
    })
    if (!upload) {
      return reply.status(400).send()
    }
    const mimetypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimetypeRegex.test(upload.mimetype)
    if (!isValidFileFormat) {
      return reply.status(400).send()
    }
    const fieldId = randomUUID()
    const extension = extname(upload.filename)
    const filename = fieldId.concat(extension)
    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads/', filename),
    )
    await pump(upload.file, writeStream)
    const fullURL = request.protocol.concat('://').concat(request.hostname)
    const fileURL = new URL(`/uploads/${filename}`, fullURL).toString()
    return fileURL
  })
}
