import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AuthService } from "./auth.service";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoading = false;
  isLoginMode = true;
  authForm: FormGroup;
  error: string;
  storeSub: Subscription

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.storeSub = this.store.select("auth").subscribe({
      next: (authState) => {
        this.isLoading = authState.isLoading;
        this.error = authState.authError;
      },
    });
    this.initForm();
  }

  private initForm() {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    // let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      // authObs = this.authService.login(this.authForm.value);
      this.store.dispatch(new AuthActions.LoginStart(this.authForm.value));
    } else {
      // authObs = this.authService.signup(this.authForm.value);
      this.store.dispatch(new AuthActions.SignupStart(this.authForm.value));
    }

    // authObs.subscribe({
    //   next: (responseData) => {
    //     this.isLoading = false;
    //   },
    //   error: (errorMessage) => {
    //     this.isLoading = false;
    //     this.error = errorMessage;
    //   },
    // });
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError())
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
