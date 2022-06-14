import { Recipe } from "../recipe.model";
import * as RecipeActions from "./recipes.actions";

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [],
};

export function recipesReducer(
  state = initialState,
  action: RecipeActions.RecipeActions
) {
  switch (action.type) {
    case RecipeActions.SET_RECIPES:
      return {
        ...state,
        recipes: action.payload,
      };
    case RecipeActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload],
      };
    case RecipeActions.UPDATE_RECIPE:
      const copiedRecipes = [...state.recipes];
      const updatedRecipeObj = {
        ...copiedRecipes[action.payload.id],
        ...action.payload.updatedRecipe,
      };
      copiedRecipes[action.payload.id] = updatedRecipeObj;
      return {
        ...state,
        recipes: copiedRecipes,
      };
    case RecipeActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter(
          (recipe, index) => index !== action.payload
        ),
      };
    default:
      return state;
  }
}
