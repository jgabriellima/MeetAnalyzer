import { NextRequest, NextResponse } from 'next/server'
import { createSSRClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const supabase = createSSRClient()
    
    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('meetings')
      .upload(`${params.id}/${file.name}`, file)

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('meetings')
      .getPublicUrl(`${params.id}/${file.name}`)

    // Update meeting with audio URL and status
    const { error: updateError } = await supabase
      .from('meetings')
      .update({
        audio_url: publicUrl,
        status: 'uploaded'
      })
      .eq('id', params.id)

    if (updateError) {
      throw new Error(`Failed to update meeting: ${updateError.message}`)
    }

    return NextResponse.json({
      success: true,
      url: publicUrl
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
} 