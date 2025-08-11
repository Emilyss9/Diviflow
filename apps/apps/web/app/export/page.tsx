"use client";

import * as XLSX from "xlsx";
import { useState } from "react";

export default function ExportPage() {
  const [profile, setProfile] = useState<""|"private"|"as">("");

  function exportPrivate() {
    const rows = [
      { isin: "NO0003733800", company: "Orkla", country: "NO", currency:"NOK", gross:1250, withhold:0,   net:1250, nok:1250 },
      { isin: "NO0010345853", company: "Aker BP", country: "NO", currency:"USD", gross:120,  withhold:18, net:102,  nok:1200 },
    ];
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dividends");
    XLSX.writeFile(wb, `diviflow_private_${Date.now()}.xlsx`);
  }

  function exportAS() {
    const rows = [
      { date:"2025-07-02", voucher_no:"1", account_no_debit:"1920", account_no_credit:"8040", amount: "1250", currency:"NOK", description:"Orkla utbytte", project:"", department:"" },
      { date:"2025-07-10", voucher_no:"2", account_no_debit:"1920", account_no_credit:"8040", amount: "11990", currency:"NOK", description:"Aker BP utbytte", project:"", department:"" }
    ];
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Journal");
    XLSX.writeFile(wb, `diviflow_as_${Date.now()}.xlsx`);
  }

  return (
    <div className="space-y-6">
      <header className="hero-glow p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Eksport</h1>
        <p className="text-slate-400">Velg profil og last ned filer klare for skattemelding/regnskap.</p>
      </header>

      <section className="card-glass p-6">
        <div className="flex items-center gap-3">
          <select className="w-56 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
                  onChange={(e)=> setProfile(e.target.value as any)} defaultValue="">
            <option value="" disabled>Velg profil</option>
            <option value="private">Privat</option>
            <option value="as">AS</option>
          </select>

          {profile==="private" && (
            <button className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm" onClick={exportPrivate}>
              Last ned Excel
            </button>
          )}
          {profile==="as" && (
            <button className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm" onClick={exportAS}>
              Last ned Journal (Excel)
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
