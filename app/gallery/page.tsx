// app/gallery/page.tsx or pages/gallery.tsx
import { PageLayout } from "@/components/layouts/page-layout";
import { GalleryComponent } from "@/components/gallery/gallery-component";

export default function GalleryPage() {
  return (
    <PageLayout pageTitle="Gallery" className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <div className="p-6">
          <GalleryComponent />
        </div>
      </div>
    </PageLayout>
  );
}
