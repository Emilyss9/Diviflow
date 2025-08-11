"use client";

import { useMemo, useState } from "react";
import Papa from "papaparse";

const REQUIRED_FIELDS = [
  "date","isin","company","currency","gross_dividend","withholding_tax","net_dividend","shares"
];
type Row = Record<string, string>;

export default function ImportPage() {
  const [step, setStep] = useState<1|2|3|4>(1);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [mapping, setMapping] = useState<Record<string,string>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const preview = useMemo(() => rows.slice(0, 10), [rows]);

  function onFile(file: File) {
    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase().replaceAll(" ", "_"),
      complete: (res) => {
        const parsed = res.data.filter(Boolean);
        const hdrs = res.meta.fields?.map(h => h?.toString() || "").filter(Boolean) || [];
        setHeaders(hdrs);
        setRows(parsed.slice(0, 2000));
        setStep(2);
      }
    });
  }

  function validateMapping() {
    const missing = REQUIRED_FIELDS.filter(f => !Object.values(mapping).includes(f));
    if (missing.length) { setErrors([`Mangler mapping for: ${missing.join(", ")}`]); return false; }
    setErrors([]); return true;
  }

  function runValidation() {
    const issues: string[] = [];
    const rev = (target: string) => Object.entries(mapping).find(([,v]) => v===target)?.[0];
    for (let i=0;i<Math.min(rows.length, 500);i++) {
      const r = rows[i];
      const g = toNum(r[rev("gross_dividend")||""]);
      const w = toNum(r[rev("withholding_tax")||""]);
      const n = toNum(r[rev("net_dividend")||""]);
      const isin = (r[rev("isin")||""]||"").toString();
      if (Math.abs(g - (w + n)) > Math.max(0.5, g*0.005)) issues.push(`Rad ${i+1}: sum-avvik`);
      if (isin.length !== 12) issues.push(`Rad ${i+1}: ISIN-lengde ≠ 12`);
    }
    setErrors(issues);
  }

  return (
    <div className="space-y-6">
      <header className="hero-glow p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Importer CSV</h1>
        <p className="text-slate-400">Veiviser for å mappe kolonner og validere data før eksport.</p>
      </header>

      {/* Stepper */}
      <div className="flex gap-2 text-xs">
        {[1,2,3,4].map(n => (
          <div key={n} className={`px-3 py-1 rounded-full border ${step>=n?"bg-indigo-500/20 text-indigo-200 border-indigo-400/30":"bg-white/5 text-slate-400 border-white/10"}`}>
            Steg {n}
          </div>
        ))}
      </div>

      {/* 1: Opplasting */}
      {step===1 && (
        <section className="card-glass p-6">
          <div className="text-sm text-slate-300 mb-3">Last opp CSV (Nordnet, DNB, VPS)</div>
          <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-10 cursor-pointer hover:bg-white/5">
            <span className="text-sm">Dra og slipp, eller klikk for å velge fil</span>
            <input type="file" accept=".csv" className="hidden" onChange={(e)=> e.target.files && onFile(e.target.files[0])}/>
          </label>
        </section>
      )}

      {/* 2: Mapping */}
      {step===2 && (
        <section className="card-glass p-6 space-y-4">
          <div className="text-sm text-slate-300">Match kolonner til felter</div>
          <div className="grid md:grid-cols-2 gap-3">
            {REQUIRED_FIELDS.map((field)=> (
              <div key={field} className="flex items-center justify-between gap-3">
                <div className="text-sm text-slate-300">{field}</div>
                <select className="w-56 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
                        onChange={(e)=> setMapping(m => ({...m, [e.target.value]: field}))}>
                  <option>Velg kolonne</option>
                  {headers.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            ))}
          </div>
          {errors.length>0 && <div className="text-sm text-red-300">{errors.join("; ")}</div>}
          <div className="flex justify-end">
            <button onClick={()=> { if (validateMapping()) setStep(3); }}
                    className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm">Neste</button>
          </div>
        </section>
      )}

      {/* 3: Forhåndsvisning */}
      {step===3 && (
        <section className="card-glass p-6">
          <div className="text-sm text-slate-300 mb-3">Forhåndsvisning (første 10 rader)</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
              <tr className="text-left text-slate-300">
                {headers.map(h => <th key={h} className="py-2 pr-4">{h}</th>)}
              </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
              {preview.map((r,i) => (
                <tr key={i} className="hover:bg-white/5">
                  {headers.map(h => <td key={h} className="py-2 pr-4">{r[h]}</td>)}
                </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={()=> { runValidation(); setStep(4); }}
                    className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm">Valider</button>
          </div>
        </section>
      )}

      {/* 4: Validering */}
      {step===4 && (
        <section className="card-glass p-6 space-y-3">
          <div className="text-sm text-slate-300">
            Sjekker at <code>gross_dividend ≈ withholding_tax + net_dividend</code> og at ISIN har 12 tegn.
          </div>
          {errors.length===0 ? (
            <div className="rounded-xl p-4 bg-emerald-500/15 border border-emerald-400/30">Alt ser bra ut! ✅</div>
          ) : (
            <div className="rounded-xl p-4 bg-red-500/15 border border-red-400/30">
              <div className="text-sm font-medium">Fant {errors.length} avvik:</div>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">{errors.map((e,i)=>(<li key={i}>{e}</li>))}</ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function toNum(v:any){ if(typeof v==='string'){ return Number(v.replace(/\s/g,'').replace(',','.')) } return Number(v||0) }
