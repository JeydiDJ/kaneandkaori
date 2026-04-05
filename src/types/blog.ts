export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  authorName: string;
  seoTitle: string;
  seoDescription: string;
  isPublished: boolean;
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostInput = {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  authorName: string;
  seoTitle: string;
  seoDescription: string;
  isPublished: boolean;
  featured: boolean;
  publishedAt: string | null;
};
