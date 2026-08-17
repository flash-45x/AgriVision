import React, { useState } from "react";
import {
  FileText,
  Download,
  Share2,
  TrendingUp,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  PieChart,
  Layers,
  ArrowUpRight,
  Printer,
  Sparkles,
  Building,
  Check,
  FileSpreadsheet,
  FileCheck,
} from "lucide-react";
import { LanguageCode } from "../../types";
import {
  INITIAL_CLUSTER_OUTBREAKS,
  INITIAL_GOV_SCHEMES,
  MANDI_PRICE_TRENDS,
} from "../../data/fpoData";
import { AudioButton } from "../common/AudioButton";
import { soundEffects, speakText } from "../../utils/audio";

interface FpoReportsTabProps {
  currentLanguage: LanguageCode;
  onBroadcastClusterAlert?: (disease: string) => void;
}

export const FpoReportsTab: React.FC<FpoReportsTabProps> = ({
  currentLanguage,
  onBroadcastClusterAlert,
}) => {
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const cropBreakdown = [
    { name: "Soybean", farmers: 185, acres: 680, estYield: "12,240 Qtl", color: "bg-amber-500", percent: 46 },
    { name: "Wheat", farmers: 120, acres: 490, estYield: "10,290 Qtl", color: "bg-emerald-600", percent: 33 },
    { name: "Mustard", farmers: 65, acres: 190, estYield: "2,660 Qtl", color: "bg-yellow-500", percent: 13 },
    { name: "Tomato", farmers: 40, acres: 85, estYield: "11,900 Qtl", color: "bg-rose-500", percent: 6 },
    { name: "Gram / Chana", farmers: 25, acres: 35, estYield: "420 Qtl", color: "bg-indigo-600", percent: 2 },
  ];

  const handleExport = (reportName: string, format: "pdf" | "csv") => {
    soundEffects.success();
    setExportSuccess(reportName);
    speakText(`Generating and downloading ${reportName} in ${format.toUpperCase()} format`, currentLanguage);

    // Create a dynamic downloadable simulated text/CSV file
    const element = document.createElement("a");
    const sampleData = `FPO REPORT: ${reportName}\nOrganization: Malwa Krishi Vikas Producer Co. Ltd.\nGenerated At: ${new Date().toLocaleString()}\n\nCrop,Farmers,Acres,Est.Yield (Qtl)\nSoybean,185,680,12240\nWheat,120,490,10290\nMustard,65,190,2660\nTomato,40,85,11900\nGram,25,35,420\n\nTotal Managed Land: 1480 Acres\nTotal Members: 342 Farmers\n`;
    const file = new Blob([sampleData], { type: format === "csv" ? "text/csv" : "application/pdf" });
    element.href = URL.createObjectURL(file);
    element.download = `${reportName.toLowerCase().replace(/[^a-z0-9]/g, "_")}.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setTimeout(() => {
      setExportSuccess(null);
    }, 3500);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Header & Audio narration */}
      <div className="bg-white p-5 rounded-3xl border-2 border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              Bulk Agronomy Insights & Compliance
            </h2>
          </div>
          <p className="text-xs font-bold text-stone-700 mt-0.5">
            Regional outbreak epidemiology, crop distributions, Mandi prices, and government scheme tracking.
          </p>
        </div>

        <AudioButton
          textToSpeak="Agronomy Insights and Compliance Reports. Total 1,480 acres cultivated. Soybean and Wheat represent 79 percent of acreage. 312 members enrolled in PM-KISAN. Export certified audit reports anytime."
          language={currentLanguage}
          size="sm"
        />
      </div>

      {exportSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex items-center justify-between animate-in zoom-in-95">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-emerald-700" />
            <span className="text-xs font-black">
              Export ready: <strong>{exportSuccess}</strong> downloaded successfully!
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase text-emerald-800">Saved to device</span>
        </div>
      )}

      {/* 2. Crop-Wise Breakdown & Production Projections */}
      <div className="bg-white p-5 rounded-3xl border-2 border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider block">
              Aggregate Acreage Breakdown
            </span>
            <h3 className="text-lg font-black text-stone-900">
              Crop Distribution & Projected Output
            </h3>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-stone-700 block">Gross FPO Output</span>
            <span className="text-base font-black text-emerald-900">₹3.42 Cr Est.</span>
          </div>
        </div>

        {/* Stacked Percentage Bar */}
        <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
          {cropBreakdown.map((crop) => (
            <div
              key={crop.name}
              className={`${crop.color} h-full transition-all`}
              style={{ width: `${crop.percent}%` }}
              title={`${crop.name}: ${crop.percent}%`}
            />
          ))}
        </div>

        {/* Breakdown Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {cropBreakdown.map((crop) => (
            <div
              key={crop.name}
              className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${crop.color}`} />
                  <h4 className="font-black text-sm text-stone-900">{crop.name}</h4>
                </div>
                <span className="text-xs font-black text-indigo-950">{crop.percent}%</span>
              </div>

              <div className="text-xs font-semibold text-stone-700 flex justify-between pt-1">
                <span>{crop.farmers} Farmers</span>
                <span className="font-black text-stone-900">{crop.acres} Acres</span>
              </div>

              <div className="text-[11px] font-bold text-emerald-800 flex justify-between">
                <span>Est. Harvest:</span>
                <span>{crop.estYield}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Regional Disease & Pest Outbreak Clusters */}
      <div className="bg-white p-5 rounded-3xl border-2 border-rose-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <AlertOctagon size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
                Regional Outbreak Clusters
              </h3>
              <p className="text-xs font-bold text-rose-900">
                Triggered automatically when multiple linked farms report identical disease vectors.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {INITIAL_CLUSTER_OUTBREAKS.map((outbreak) => (
            <div
              key={outbreak.id}
              className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-rose-950">
                    {outbreak.diseaseName} Cluster
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      outbreak.severity === "High"
                        ? "bg-rose-600 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {outbreak.severity} Severity
                  </span>
                </div>

                <p className="text-xs font-bold text-stone-700 mt-1">
                  Affecting <strong className="text-stone-900">{outbreak.affectedMembersCount} Farms</strong> in{" "}
                  {outbreak.affectedVillages.join(", ")} ({outbreak.crop})
                </p>

                <p className="text-xs font-semibold text-rose-900 mt-1 bg-white/70 p-2 rounded-xl border border-rose-100">
                  Advisory Protocol: {outbreak.recommendedAction}
                </p>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.success();
                    alert(`Dispatched targeted spray protocol for ${outbreak.diseaseName} to all ${outbreak.affectedMembersCount} farms in ${outbreak.affectedVillages.join(", ")}.`);
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs active:scale-95 transition-all text-center"
                >
                  Broadcast Notice
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.click();
                    alert(`Initiated collective input requisition for certified bio-fungicides at 18% subsidized bulk rate.`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white text-stone-800 border border-stone-300 font-bold text-xs hover:bg-stone-100 text-center"
                >
                  Order Subsidized Inputs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Market Price Trends & Collective Mandi Selling */}
      <div className="bg-white p-5 rounded-3xl border-2 border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider block">
              Mandi Spot Intelligence
            </span>
            <h3 className="text-lg font-black text-stone-900">
              Live Mandi Prices & Selling Windows
            </h3>
          </div>

          <div className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 font-black text-xs border border-emerald-200">
            Pool Savings: ~₹45 / Qtl
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {MANDI_PRICE_TRENDS.map((mandi) => (
            <div
              key={mandi.crop}
              className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-stone-900">{mandi.crop}</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                    mandi.trend === "up"
                      ? "bg-emerald-100 text-emerald-900"
                      : mandi.trend === "down"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-stone-200 text-stone-700"
                  }`}
                >
                  {mandi.trend === "up" ? "↑ Rising" : mandi.trend === "down" ? "↓ Dropping" : "↔ Stable"}
                </span>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-indigo-950">₹{mandi.currentRate}</span>
                <span className="text-xs font-bold text-stone-700">/ Qtl</span>
              </div>

              <div className="text-[10px] font-bold text-stone-700 flex justify-between">
                <span>Gov MSP: ₹{mandi.mspRate}</span>
                <span className="text-emerald-800 font-black">
                  {mandi.currentRate >= mandi.mspRate ? `+₹${mandi.currentRate - mandi.mspRate} above MSP` : "At MSP"}
                </span>
              </div>

              <p className="text-[10px] font-semibold text-indigo-950 bg-indigo-50/70 p-1.5 rounded-lg">
                💡 {mandi.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Government Scheme Integration */}
      <div className="bg-white p-5 rounded-3xl border-2 border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider block">
              Statutory Program Tracking
            </span>
            <h3 className="text-lg font-black text-stone-900">
              Government Scheme Enrollments
            </h3>
          </div>

          <span className="text-xs font-bold text-indigo-950 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200">
            District Agri Dept Synchronized
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INITIAL_GOV_SCHEMES.map((scheme) => (
            <div
              key={scheme.id}
              className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-black text-sm text-stone-900">{scheme.schemeName}</h4>
                <span className="text-xs font-black text-emerald-900">
                  {Math.round((scheme.enrolledCount / scheme.totalEligible) * 100)}% Done
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{
                    width: `${(scheme.enrolledCount / scheme.totalEligible) * 100}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-xs font-bold text-stone-700">
                <span>
                  <strong className="text-stone-900">{scheme.enrolledCount}</strong> / {scheme.totalEligible} Enrolled
                </span>
                <span className="text-amber-800">
                  {scheme.pendingCount} Pending Action
                </span>
              </div>

              <p className="text-[11px] font-semibold text-stone-700">
                Benefit: {scheme.subsidyAmountPerAcre}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Exportable Audit & Compliance Dossier Action Bar */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-stone-900 to-indigo-950 text-white shadow-md space-y-3">
        <div>
          <h3 className="text-base sm:text-lg font-black leading-tight">
            Export Certified FPO Compliance Reports
          </h3>
          <p className="text-xs text-stone-300 mt-0.5">
            Download print-ready official registers for auditing, NABARD submissions, and bank credit facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => handleExport("FPO_Annual_Compliance_Dossier_2026", "pdf")}
            className="py-3 px-4 rounded-2xl bg-white text-stone-900 font-black text-xs hover:bg-stone-100 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <FileCheck size={16} className="text-indigo-700" />
            <span>Compliance Dossier (PDF)</span>
          </button>

          <button
            type="button"
            onClick={() => handleExport("FPO_Member_Land_Registry", "csv")}
            className="py-3 px-4 rounded-2xl bg-white/15 text-white font-black text-xs hover:bg-white/25 active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/20"
          >
            <FileSpreadsheet size={16} className="text-emerald-400" />
            <span>Land & Member Register (CSV)</span>
          </button>

          <button
            type="button"
            onClick={() => handleExport("Cluster_Disease_Audit_Report", "pdf")}
            className="py-3 px-4 rounded-2xl bg-white/15 text-white font-black text-xs hover:bg-white/25 active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/20"
          >
            <Printer size={16} className="text-amber-400" />
            <span>Cluster Risk Audit (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
