export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.MAGIC_HOUR_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "MAGIC_HOUR_API_KEY is not configured"
      });
    }

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        error: "Job ID is required"
      });
    }

    const response = await fetch(
      `https://api.magichour.ai/v1/video-projects/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json"
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const downloads = data.downloads || [];

    return res.status(200).json({
      status: data.status,
      download_url:
        downloads.length > 0
          ? (downloads[0].url || downloads[0].download_url || null)
          : null,
      error: data.error || null
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
