export default function handler(req, res) {
  res.status(200).json({ status: 'API en línea', timestamp: Date.now() });
}
