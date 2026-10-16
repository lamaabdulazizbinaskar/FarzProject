import type { ClinicalField } from '../../utils/clinicalText';

export function ClinicalFieldGrid({ fields }: { fields: ClinicalField[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
      {fields.map((f) => (
        <div key={f.label}>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{f.label}</dt>
          <dd className="text-sm font-semibold text-slate-800">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
