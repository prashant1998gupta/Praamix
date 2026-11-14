import sharp from 'sharp'

/**
 * Photographs the whole page and lays it out as a sheet of screens, read left
 * to right and top to bottom, so a long phone page can be reviewed at a glance.
 */
export async function saveSheet(page, file, { height }) {
  const full = await page.screenshot({ fullPage: true, type: 'png', scale: 'css' })
  const { width, height: pageHeight } = await sharp(full).metadata()

  const count = Math.min(16, Math.ceil(pageHeight / height))
  const columns = Math.max(1, Math.min(count, Math.round(Math.sqrt((count * height) / width))))
  const rows = Math.ceil(count / columns)
  const gap = Math.max(8, Math.round(width * 0.03))

  const tiles = []
  for (let index = 0; index < count; index += 1) {
    const top = index * height
    const input = await sharp(full)
      .extract({ left: 0, top, width, height: Math.min(height, pageHeight - top) })
      .toBuffer()
    tiles.push({
      input,
      left: gap + (index % columns) * (width + gap),
      top: gap + Math.floor(index / columns) * (height + gap),
    })
  }

  const sheet = await sharp({
    create: {
      width: columns * (width + gap) + gap,
      height: rows * (height + gap) + gap,
      channels: 3,
      background: '#8a8a8a',
    },
  })
    .composite(tiles)
    .png()
    .toBuffer()

  await sharp(sheet)
    .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(file)

  return count
}
