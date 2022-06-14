import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, switchMap } from "rxjs/operators";
import { Subscription } from "rxjs";

import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";
import * as fromApp from "../../store/app.reducer";
import * as RecipeActions from "../store/recipes.actions";
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions'

@Component({
  selector: "app-recipe-detail",
  templateUrl: "./recipe-detail.component.html",
  styleUrls: ["./recipe-detail.component.css"],
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe;
  id: number;
  selectedRecipeSub: Subscription;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.selectedRecipeSub = this.route.params
      .pipe(
        map((params: Params) => {
          this.id = +params.id;
          return this.id;
        }),
        switchMap((id) => {
          return this.store.select("recipes");
        }),
        map((recipesState) => recipesState.recipes)
      )
      .subscribe((recipes) => {
        this.recipe = recipes[this.id];
        // this.recipe = this.recipeService.getRecipe(this.id);
      });
  }

  onAddToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients))
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(["edit"], { relativeTo: this.route });
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    // this.recipeService.deleteRecipe(this.id);
    this.router.navigate(["/recipes"]);
  }

  ngOnDestroy(): void {
    this.selectedRecipeSub.unsubscribe();
  }
}
