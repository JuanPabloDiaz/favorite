import podcastsData from '@data/podcasts.json';

export interface Podcast {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

export const getPodcasts = async (): Promise<Podcast[]> => {
  return podcastsData.podcasts || [];
};
