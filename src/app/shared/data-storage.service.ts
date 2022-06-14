import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { tap, map } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import * as fromApp from '../store/app.reducer'
import * as RecipeActions from '../recipes/store/recipes.actions'

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  saveRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        "https://angular-710d1-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json",
        recipes
      )
      .subscribe();
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        "https://angular-710d1-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json"
      )
      .pipe(
        map((recipes) =>
          recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          })
        ),
        tap((recipes) => {
          this.store.dispatch(new RecipeActions.SetRecipes(recipes));
        })
      );
  }
}
