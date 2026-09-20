export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const apiKey = process.env.MAGIC_HOUR_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "MAGIC_HOUR_API_KEY is not configured"
      });
    }

    const { photoExtension, videoExtension } = req.body;

    if (!photoExtension || !videoExtension) {
      return res.status(400).json({
        error: "Photo and video extensions are required"
      });
    }

    const response = await fetch(
      "https://api.magichour.ai/v1/files/upload-urls",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          items: [
            {
              type: "image",
              extension: photoExtension
            },
            {
              type: "video",
              extension: videoExtension
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json({
      photo: data.items[0],
      video: data.items[1]
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
