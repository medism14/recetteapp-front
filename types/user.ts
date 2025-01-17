/** @format */

import type { Favorite } from "./favorite";
import type { Recipe } from "./recipe";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  recipes?: Recipe[];
  favorites?: Favorite[];
  createdAt?: Date;
}
