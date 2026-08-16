export default async function handler(req, res) {
  const { path, ...params } = req.query;

  if (!path) {
    return res.status(400).json({ error: 'missing_path' });
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'server_missing_api_key' });
  }

  const query = new URLSearchParams({ ...params, api_key: apiKey }).toString();
  const url = `https://api.themoviedb.org/3${path}?${query}`;

  try {
    const tmdbRes = await fetch(url);
    const data = await tmdbRes.json();
    res.status(tmdbRes.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'upstream_error' });
  }
}
