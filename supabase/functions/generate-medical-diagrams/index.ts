import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const diagrams = {
  mallampati: [
    {
      name: 'mallampati-1',
      prompt: 'Medical illustration of Mallampati Class I, showing oral cavity from front view. Soft palate, uvula, fauces, and pillars clearly visible. Professional medical diagram style, clean lines, anatomically accurate.',
    },
    {
      name: 'mallampati-2',
      prompt: 'Medical illustration of Mallampati Class II, showing oral cavity from front view. Soft palate, uvula, and fauces visible, pillars partially obscured. Professional medical diagram style.',
    },
    {
      name: 'mallampati-3',
      prompt: 'Medical illustration of Mallampati Class III, showing oral cavity from front view. Only soft palate and base of uvula visible. Professional medical diagram style, anatomically accurate.',
    },
    {
      name: 'mallampati-4',
      prompt: 'Medical illustration of Mallampati Class IV, showing oral cavity from front view. Only hard palate visible, soft palate not visible. Professional medical diagram style.',
    }
  ],
  malocclusion: [
    {
      name: 'malocclusion-normal',
      prompt: 'Medical illustration of normal dental occlusion, side view. Perfect alignment of upper and lower teeth. Professional dental diagram, clean lines.',
    },
    {
      name: 'malocclusion-cross',
      prompt: 'Medical illustration of dental cross bite, side view. Upper teeth fitting inside lower teeth. Professional dental diagram showing malocclusion.',
    },
    {
      name: 'malocclusion-open',
      prompt: 'Medical illustration of dental open bite, side view. Gap between upper and lower front teeth when biting. Professional dental diagram.',
    },
    {
      name: 'malocclusion-deep',
      prompt: 'Medical illustration of dental deep bite, side view. Upper front teeth excessively overlapping lower front teeth. Professional dental diagram.',
    }
  ],
  inflammation: [
    {
      name: 'inflammation-mild',
      prompt: 'Medical illustration of mild oral tissue inflammation. Slight redness and minimal swelling. Professional medical diagram style.',
    },
    {
      name: 'inflammation-moderate',
      prompt: 'Medical illustration of moderate oral tissue inflammation. Increased redness, noticeable swelling. Professional medical diagram style.',
    },
    {
      name: 'inflammation-severe',
      prompt: 'Medical illustration of severe oral tissue inflammation. Significant redness, marked swelling. Professional medical diagram style.',
    }
  ]
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { category, index } = await req.json()
    
    if (!diagrams[category] || !diagrams[category][index]) {
      throw new Error('Invalid category or index')
    }

    const diagram = diagrams[category][index]
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    console.log(`Generating ${diagram.name} with prompt: ${diagram.prompt}`)

    const image = await hf.textToImage({
      inputs: diagram.prompt,
      model: 'black-forest-labs/FLUX.1-schnell',
      parameters: {
        negative_prompt: 'blurry, low quality, distorted, unrealistic'
      }
    })

    // Upload to Supabase Storage
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const arrayBuffer = await image.arrayBuffer()
    const fileName = `${diagram.name}.png`

    const { data, error: uploadError } = await supabase.storage
      .from('lab_script_files')
      .upload(fileName, arrayBuffer, {
        contentType: 'image/png',
        upsert: true
      })

    if (uploadError) {
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('lab_script_files')
      .getPublicUrl(fileName)

    return new Response(
      JSON.stringify({ 
        success: true, 
        fileName,
        publicUrl,
        name: diagram.name
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate or upload image', 
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    )
  }
})