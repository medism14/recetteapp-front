/** @format */

import type { Category } from "./category";
import type { Favorite } from "./favorite";
import type { User } from "./user";

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Recipe {
  id: number;
  name: string;
  description?: string;
  prepTime: number;
  cookTime: number;
  difficulty: Difficulty;
  ingredients: string;
  instructions: string;
  image: string;
  categoryId: number;
  userId: number;
  category?: Category;
  user?: User;
  favorites?: Favorite[];
  createdAt?: Date;
  updatedAt?: Date;
}
