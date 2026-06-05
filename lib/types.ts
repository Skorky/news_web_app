export type Region = 'top10' | 'world' | 'usa' | 'europe' | 'asia' | 'czechia';
export type Topic =
  | 'top'
  | 'politics'
  | 'economy'
  | 'finance'
  | 'war_security'
  | 'technology'
  | 'marketing_media'
  | 'investigations';

export type NewsItem = {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt?: string;
  region: Region;
  topics: Topic[];
  summaryCz: string;
  whyItMatters: string;
  importance: number;
  paywall: 'ne' | 'ano' | 'pravděpodobně' | 'neznámé';
};

export type FeedSource = {
  name: string;
  region: Region;
  topics: Topic[];
  url: string;
  paywall?: NewsItem['paywall'];
};
