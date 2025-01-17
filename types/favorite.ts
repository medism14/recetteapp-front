import type { Recipe } from "./recipe";
import type { User } from "./user";

export interface Favorite {
  userId: number;
  recipeId: number;
  user?: User;
  recipe?: Recipe;
  createdAt: Date;
}
