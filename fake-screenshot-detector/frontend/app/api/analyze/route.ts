export async function POST() {
  return Response.json({
    fake_score: 72,
    metadata: {
      suspicious: false,
      editing_software: "None"
    },
    pixel_analysis: {
      possible_edit: true
    },
    text: "API route working successfully"
  })
}