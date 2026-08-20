import { SiteNav } from "@/components/site/SiteNav";
import { DeckNavigation } from "@/components/site/DeckNavigation";
import { Hero } from "@/components/site/Hero";
import { WhyNowWithRails } from "@/components/site/WhyNowWithRails";
import { Segments } from "@/components/site/Segments";
import { PlantBlocks } from "@/components/site/PlantBlocks";
import { AsIsAssessment } from "@/components/site/AsIsAssessment";
import { ToBeArchitecture } from "@/components/site/ToBeArchitecture";
import { UseCases } from "@/components/site/UseCases";
import { Offerings } from "@/components/site/Offerings";
import { WhyEy } from "@/components/site/WhyEy";
import { Credentials } from "@/components/site/Credentials";
import { ClosingCta } from "@/components/site/ClosingCta";
import { copy } from "@/content/sectionCopy";
import "@/components/site/PresentationViewport.css";

export function DeckBody({ chrome = true }: { chrome?: boolean }) {
  return (
    <div className="min-h-screen bg-background">
      {chrome && <SiteNav />}
      {chrome && <DeckNavigation />}
      <main>
        <Hero />
        <WhyNowWithRails />
        <Segments />
        <PlantBlocks />
        <AsIsAssessment />
        <ToBeArchitecture />
        <UseCases />
        <Offerings />
        <WhyEy />
        <Credentials />
        <ClosingCta />
      </main>
      <footer className="border-t border-hairline bg-navy py-8 text-navy-foreground">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 text-xs text-navy-muted md:flex-row md:items-center md:justify-between md:px-8">
          <p>{copy.footer.left}</p>
          <p>{copy.footer.right}</p>
        </div>
      </footer>
    </div>
  );
}
