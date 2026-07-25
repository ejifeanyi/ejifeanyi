import type { Metadata } from "next";
import Image from "next/image";
import { about, siteConfig } from "@/lib/config";
import { markdownToHtml } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "About",
  description: `An overview of ${siteConfig.fullName}'s work and background.`,
  openGraph: {
    title: siteConfig.fullName,
    description: `An overview of ${siteConfig.fullName}'s work and background.`,
  },
};

export default async function AboutPage() {
  const html = await markdownToHtml(about.body);

  return (
    <article>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {about.heading}
      </h1>

      <div className="prose-post prose prose-invert mt-8 max-w-none">
        {about.avatar && (
          <Image
            src={about.avatar}
            alt={siteConfig.fullName}
            width={176}
            height={176}
            priority
            className="mx-auto mb-6 mt-2 block h-44 w-44 rounded-full border border-border object-cover grayscale sm:float-right sm:mb-4 sm:ml-6"
          />
        )}
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </article>
  );
}
