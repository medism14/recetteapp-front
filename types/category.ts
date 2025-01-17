import type { Recipe } from "./recipe";

export interface Category {
  id: number;
  name: string;
  description?: string;
  recipes?: Recipe[];
  createdAt?: Date;
}
