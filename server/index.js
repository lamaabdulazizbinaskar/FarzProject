import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';

const PORT = process.env.PORT || 3001;
const MAX_AGE_MS = 1000 * 60 * 60 * 4; // auto-expire after 4 hours — this is a live clinic board, not a record store

const app = express();
app.use(cors());
app.use(express.json({ limit: '256kb' }));

/** @type {Map<string, any>} */
const submissions = new Map();

function sweepExpired() {
  const now = Date.now();
  for (const [id, entry] of submissions) {
    if (now - entry.createdAt > MAX_AGE_MS) submissions.delete(id);
  }
}
setInterval(sweepExpired, 60_000).unref();

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/sessions', (req, res) => {
  const body = req.body ?? {};
  if (!Array.isArray(body.spots)) {
    return res.status(400).json({ error: 'spots array is required' });
  }
  const id = nanoid(8);
  const triageLevel = [2, 3, 4, 5].includes(body.triageLevel) ? body.triageLevel : 5;
  const entry = {
    id,
    createdAt: Date.now(),
    seen: false,
    patientLanguage: body.patientLanguage ?? 'en',
    patientType: body.patientType ?? 'self',
    companionRelation: typeof body.companionRelation === 'string' ? body.companionRelation : null,
    spots: body.spots,
    extras: Array.isArray(body.extras) ? body.extras : [],
    highRisk: Boolean(body.highRisk),
    visitRef: typeof body.visitRef === 'string' ? body.visitRef : '',
    triageLevel,
    triageReasonKeys: Array.isArray(body.triageReasonKeys) ? body.triageReasonKeys : [],
  };
  submissions.set(id, entry);
  res.status(201).json({ id });
});

app.get('/api/sessions', (_req, res) => {
  sweepExpired();
  // Queue order: most acute first, then longest waiting.
  const list = [...submissions.values()].sort(
    (a, b) => a.triageLevel - b.triageLevel || a.createdAt - b.createdAt,
  );
  res.json(list);
});

app.get('/api/sessions/:id', (req, res) => {
  const entry = submissions.get(req.params.id);
  if (!entry) return res.status(404).json({ error: 'not found' });
  res.json(entry);
});

app.patch('/api/sessions/:id', (req, res) => {
  const entry = submissions.get(req.params.id);
  if (!entry) return res.status(404).json({ error: 'not found' });
  if (typeof req.body?.seen === 'boolean') entry.seen = req.body.seen;
  res.json(entry);
});

app.delete('/api/sessions/:id', (req, res) => {
  submissions.delete(req.params.id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`[wdih-server] listening on http://localhost:${PORT}`);
});
