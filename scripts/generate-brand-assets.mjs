// Regenerate brand icons and the social preview from the approved captured logo.
// The owner-supplied image was verified pixel-identical to this existing asset.
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

// Use the image processor already shipped with Next.js, without adding a package.
const require = createRequire(import.meta.url)
const nextRequire = createRequire(require.resolve('next/package.json'))
const sharp = nextRequire('sharp')
const publicDir = join(process.cwd(), 'public')
const source = join(
  publicDir,
  '_ffc-assets/viewpointministriesinternational.org/wp-content/uploads/2022/05/logo-2.jpg'
)
await mkdir(join(publicDir, 'Images'), { recursive: true })

// Contain the entire artwork on white: no stretching, cropping or redrawing.
const square = (size) =>
  sharp(source)
    .resize(size, size, { fit: 'contain', background: '#ffffff' })
    .png({ palette: true, colours: 256, effort: 10 })
    .toBuffer()

for (const [file, size] of [
  ['icon.png', 32],
  ['apple-icon.png', 180],
  ['android-chrome-192x192.png', 192],
  ['android-chrome-512x512.png', 512],
  ['web-app-manifest-512x512.png', 512],
]) {
  await writeFile(join(publicDir, file), await square(size))
}

// ICO directory entries point at lossless PNG frames, supported by modern browsers.
const sizes = [16, 32, 48]
const frames = await Promise.all(sizes.map(square))
const header = Buffer.alloc(6 + sizes.length * 16)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(sizes.length, 4)
let offset = header.length
frames.forEach((frame, index) => {
  const entry = 6 + index * 16
  header[entry] = sizes[index]
  header[entry + 1] = sizes[index]
  header.writeUInt16LE(1, entry + 4)
  header.writeUInt16LE(32, entry + 6)
  header.writeUInt32LE(frame.length, entry + 8)
  header.writeUInt32LE(offset, entry + 12)
  offset += frame.length
})
await writeFile(join(publicDir, 'favicon.ico'), Buffer.concat([header, ...frames]))
await sharp(source)
  .resize(1200, 630, { fit: 'contain', background: '#ffffff' })
  .png({ palette: true, colours: 256, effort: 10 })
  .toFile(join(publicDir, 'Images/og-image.png'))
