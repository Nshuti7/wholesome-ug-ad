"use client";
import ShowcaseManager from "@/components/showcase/ShowcaseManager";

export default function ArtPage() {
  return (
    <ShowcaseManager
      kind="art"
      pageTitle="Art"
      entityName="Art piece"
      addButtonText="Add art piece"
    />
  );
}
