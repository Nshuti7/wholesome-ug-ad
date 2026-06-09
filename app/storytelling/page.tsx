"use client";
import ShowcaseManager from "@/components/showcase/ShowcaseManager";

export default function StorytellingPage() {
  return (
    <ShowcaseManager
      kind="story"
      pageTitle="Storytelling"
      entityName="Story"
      addButtonText="Add work"
    />
  );
}
