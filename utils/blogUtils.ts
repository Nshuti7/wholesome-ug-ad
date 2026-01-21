// utils/blogUtils.ts
export const BLOG_CATEGORIES = [
  "Technology",
  "Web Development",
  "Mobile Development",
  "AI & Machine Learning",
  "Design",
  "Business",
  "Tutorial",
  "News",
  "Opinion",
  "Review",
];

export const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
