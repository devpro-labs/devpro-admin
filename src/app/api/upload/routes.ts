import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Upload API called')
    
    const formData = await request.formData()
    const file = formData.get('file') as File

    console.log('[v0] File received:', file?.name, file?.size)

    if (!file) {
      console.log('[v0] No file provided')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file
    if (file.size === 0) {
      return NextResponse.json(
        { error: 'File is empty' },
        { status: 400 }
      )
    }

    const fileName = file.name
    const timestamp = new Date().getTime()
    const mockUrl = `https://cloudinary-mock.com/uploads/${timestamp}-${fileName}`

    console.log('[v0] Mock upload URL generated:', mockUrl)

    // TODO: Replace with actual Cloudinary upload
    // const formDataCloudinary = new FormData()
    // formDataCloudinary.append('file', file)
    // formDataCloudinary.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET!)
    // 
    // const cloudinaryResponse = await fetch(
    //   `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
    //   {
    //     method: 'POST',
    //     body: formDataCloudinary,
    //   }
    // )
    //
    // if (!cloudinaryResponse.ok) {
    //   throw new Error('Cloudinary upload failed')
    // }
    //
    // const cloudinaryData = await cloudinaryResponse.json()
    // const url = cloudinaryData.secure_url

    return NextResponse.json({ url: mockUrl }, { status: 200 })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
