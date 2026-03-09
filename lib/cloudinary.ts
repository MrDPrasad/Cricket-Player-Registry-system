export async function uploadImage(buffer: Buffer, filename: string): Promise<string> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME!
  const key = process.env.CLOUDINARY_API_KEY!
  const secret = process.env.CLOUDINARY_API_SECRET!

  const timestamp = String(Math.round(Date.now() / 1000))
  const folder = 'cricket'

  const crypto = await import('crypto')
  const sig = crypto
    .createHash('sha1')
    .update(`folder=${folder}&timestamp=${timestamp}${secret}`)
    .digest('hex')

  const form = new FormData()
  form.append('file', new Blob([buffer]), filename)
  form.append('api_key', key)
  form.append('timestamp', timestamp)
  form.append('signature', sig)
  form.append('folder', folder)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) throw new Error('Image upload failed')
  const data = await res.json()
  return data.secure_url as string
}
