import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";
import * as RecipeActions from "../recipes/store/recipes.actions";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store.select("auth").subscribe((authState) => {
      this.isAuthenticated = !!authState.user;
    });
    // this.authService.userCreated.subscribe((user) => {
    //   this.isAuthenticated = !!user;
    // });
  }

  onSaveRecipes() {
    this.store.dispatch(new RecipeActions.SaveRecipes());
    // this.dataStorageService.saveRecipes();
  }

  onFetchRecipes() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipesStart());
  }

  onSignout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
