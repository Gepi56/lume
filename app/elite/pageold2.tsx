import { Metadata } from "next";
import { EliteHero } from "@/components/elite/EliteHero";
import { EliteBenefits } from "@/components/elite/EliteBenefits";
import { EliteRequirements } from "@/components/elite/EliteRequirements";
import { EliteProgress } from "@/components/elite/EliteProgress";
import { EliteFAQ } from "@/components/elite/EliteFAQ";
import { eliteMock } from "@/lib/mock/elite";

export const metadata: Metadata = {
  title: "Elite | Lume",
  description: "Stato Elite, vantaggi, criteri di accesso e progresso su Lume",
};

export default function ElitePage() {
  const data = eliteMock;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <EliteHero data={data} />

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <EliteBenefits benefits={data.benefits} />
          </div>

          <div className="xl:col-span-1">
            <EliteRequirements requirements={data.requirements} />
          </div>
        </div>

        <EliteProgress progress={data.progress} />

        <EliteFAQ items={data.faq} />
      </div>
    </main>
  );
}
