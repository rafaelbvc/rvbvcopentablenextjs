import { Review } from "@prisma/client";

export default interface FetchRestaurantBySlug {
    id: number;
    name: string;
    images: string[];
    description: string;
    reviews: Review[];
    slug: string;
  }