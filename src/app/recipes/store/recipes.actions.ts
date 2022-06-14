import { Action } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const SET_RECIPES = "[Recipes] SET_RECIPES"
export const FETCH_RECIPES = "[Recipes] FETCH_RECIPES";
export const ADD_RECIPE = "[Recipes] ADD_RECIPE";
export const UPDATE_RECIPE = "[Recipes] UPDATE_RECIPE"
export const DELETE_RECIPE = "[Recipes] DELETE_RECIPE"
export const SAVE_RECIPES = "[Recipes] SAVE_RECIPES";

export class SetRecipes implements Action {
  readonly type = SET_RECIPES;

  constructor(public payload: Recipe[]){}
}

export class FetchRecipesStart implements Action {
  readonly type = FETCH_RECIPES;
}

export class AddRecipe implements Action {
  readonly type = ADD_RECIPE;

  constructor(public payload: Recipe){}
}

export class UpdateRecipe implements Action {
  readonly type= UPDATE_RECIPE;

  constructor(public payload: {id: number; updatedRecipe: Recipe}) {}
}

export class DeleteRecipe implements Action {
  readonly type = DELETE_RECIPE;

  constructor(public payload: number) {}
}

export class SaveRecipes implements Action {
  readonly type = SAVE_RECIPES;
}


export type RecipeActions = SetRecipes | AddRecipe | UpdateRecipe | SaveRecipes | DeleteRecipe