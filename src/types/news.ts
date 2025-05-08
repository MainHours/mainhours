
export interface NewsSource {
  id: string;
  name: string;
  logo: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  source: string;
  category: string;
  imageUrl: string;
  time: string;
  url?: string;
  isBreaking?: boolean;
  trending?: number;
  comments?: number;
}
