# فرز · Farz

**Wordless first assessment for emergency intake.**
A patient who cannot describe their pain — a young child, an elderly patient, a worker who does not share a language with the nurse — *shows* it instead of telling it, and the clinician receives a structured, bilingual intake summary with a suggested triage priority.

Built for the HyperBloom October UI/UX & Web Design Hackathon.

---

## The problem

In an emergency department, the first question is always the same: *where does it hurt?* When the answer cannot be spoken, the whole assessment stalls. Interpreters are not always available, family members end up translating sensitive medical detail, and children simply cry.

## The approach

The patient never types a word. They tap an anatomical body map, then answer four questions with pictures — what it feels like, how strong, since when, how it comes. The result is a clinical chart in two languages side by side: the patient's own language, and the clinician's.

## What it does

- **Anatomical body map** — front and back, with the clinical nine-region abdominal grid (epigastric, umbilical, hypogastric, hypochondriac, lumbar, iliac). Sides follow clinical convention: the figure faces the patient, so the patient's right is drawn on the screen's left.
- **Three figures** — male, female, and child. A child is not a scaled adult; the proportions differ, and picking "my child" switches the figure automatically.
- **Region-aware vocabulary** — the pain qualities offered depend on where the pain is. The gut offers *colicky* and *cramping*; the head offers *throbbing* and *pressure*.
- **Rule-based triage support** — a transparent, deterministic assessment loosely modelled on the five-level CTAS scale, which always shows the reasons that produced the level. It never auto-assigns Level 1, because that requires vital signs. It is triage *support*, not a diagnosis.
- **Bilingual clinician view** — patient language and clinician language rendered simultaneously. The patient picks "around the navel"; the chart records *Umbilical region*.
- **Live triage board** — submitted intakes appear on a clinician dashboard ordered by acuity, then by who has waited longest.
- **Visit reference** — a short code (`FRZ-7K3M2`) the patient shows at reception, drawn from an alphabet with no `0/O/1/I/L` so it cannot be misread aloud.

## Accessibility

Accessibility is the product, not a checklist item.

- WCAG AA contrast, verified by computing every foreground/background pair
- All tap targets at or above 24×24 CSS px, measured in the browser (WCAG 2.5.8)
- Visible keyboard focus on every control, including the SVG body map
- Full RTL support, with `lang` and `dir` set per language — the body figure never mirrors, so anatomy stays correct
- Large-text mode, optional audio prompts, and `prefers-reduced-motion` respected throughout
- Region names announced on hover and on keyboard focus

## Running it

```bash
npm install
npm run dev
```

The patient app runs at `http://localhost:5173`, and the clinician board at `http://localhost:5173/dashboard`.

The board reads from a small Express service with in-memory storage; submissions expire automatically after four hours and nothing is written to disk.

```bash
npm run server
```

The patient flow works entirely without the server — only the live board needs it.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Zustand · react-i18next · Express

## Notes

- `General Hospital` and `Emergency Department` in `src/config/facility.ts` are deliberate placeholders. Replace them with the deploying institution's own details.
- Triage output is patient-reported and rule-based. It supports clinical judgement; it never replaces it.
