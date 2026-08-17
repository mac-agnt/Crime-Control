import { notFound } from "next/navigation";
import { allNav } from "@/lib/nav";
import { TestPage } from "@/components/TestPage";

export function generateStaticParams() {
  return allNav
    .filter((item) => item.href.startsWith("/test/"))
    .map((item) => ({ slug: item.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = allNav.find((nav) => nav.slug === slug);
  if (!item) notFound();

  return <TestPage slug={item.slug} label={item.label} />;
}
