/** Soft ambient blobs in the corners of warm, patient-facing screens — adds
 * depth to an otherwise flat background without ever competing with content
 * (very low opacity, blurred, pointer-events disabled). */
export function BackgroundDecor() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-primary-soft opacity-60 blur-3xl" />
      <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-pain-soft opacity-40 blur-3xl" />
    </div>
  );
}
