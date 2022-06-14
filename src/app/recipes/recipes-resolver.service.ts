import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Actions, ofType } from "@ngrx/effects";

import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";
import * as fromApp from "../store/app.reducer";
import * as RecipeActions from "./store/recipes.actions";
import { take } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    this.store.dispatch(new RecipeActions.FetchRecipesStart());
    return this.actions$.pipe(ofType(RecipeActions.SET_RECIPES), take(1));

    // const recipes = this.recipeService.getRecipes();

    // if (recipes.length > 0) {
    //   return recipes;
    // } else {
    //   return this.dataStorageService.fetchRecipes();
    // }
  }
}
