import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";

import {
  map,
  switchMap,
  withLatestFrom,
} from "rxjs/operators";
import { Recipe } from "../recipe.model";
import * as RecipeActions from "./recipes.actions";
import * as fromApp from "../../store/app.reducer";

@Injectable()
export class RecipeEffects {
  recipesFetch = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipeActions.FETCH_RECIPES),
      switchMap(() => {
        return this.http
          .get<Recipe[]>(
            "https://angular-710d1-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json"
          )
          .pipe(
            map((recipes) =>
              recipes.map((recipe) => ({
                ...recipe,
                ingredients: recipe.ingredients ? recipe.ingredients : [],
              }))
            ),
            map((recipes) => {
              return new RecipeActions.SetRecipes(recipes);
            })
          );
      })
    )
  );

  recipesSaved = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipeActions.SAVE_RECIPES),
        withLatestFrom(this.store.select("recipes")),
        switchMap(([actionData, recipesState]) => {
          return this.http
            .put(
              "https://angular-710d1-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json",
              recipesState.recipes
            )
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
