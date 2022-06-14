import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth.service";
import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface AuthResponseData {
  email: string;
  expiresIn?: string;
  idToken: string;
  kind: string;
  localId: string;
  refreshToken?: string;
  displayName?: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  authSignup = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((authData: AuthActions.SignupStart) => {
        return this.http
          .post<AuthResponseData>(
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" +
              environment.firebaseAPIKey,
            {
              ...authData.payload,
              returnSecureToken: true,
            }
          )
          .pipe(
            map((resData) => this.handleSuccessResponse(resData)),
            catchError((errorRes) => this.handleErrorResponse(errorRes))
          );
      })
    )
  );

  authLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
              environment.firebaseAPIKey,
            { ...authData.payload, returnSecureToken: true }
          )
          .pipe(
            map((resData) => this.handleSuccessResponse(resData)),
            catchError((errorRes) => this.handleErrorResponse(errorRes))
          );
      })
    )
  );

  authSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authData: AuthActions.AuthenticateSuccess) => {
          authData.payload.redirect ? this.router.navigate(["/recipes"]) : null;
        })
      ),
    { dispatch: false }
  );

  authLogout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          localStorage.removeItem("userData");
          this.authService.clearAutoSignoutTimer();
          this.router.navigate(["/auth"]);
        })
      ),
    { dispatch: false }
  );

  autoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem("userData"));

        if (!userData) {
          return { type: "DUMMY" };
        }

        const existingUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (existingUser.token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() - Date.now();
          this.authService.setAutoSignoutTimer(expirationDuration);

          return new AuthActions.AuthenticateSuccess({
            email: existingUser.email,
            userId: existingUser.id,
            token: existingUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false,
          });

          // this.userCreated.next(existingUser);
          // const expirationDuration =
          //   new Date(userData._tokenExpirationDate).getTime() -
          //   new Date().getTime();
          // this.autoSignout(expirationDuration);
        }

        return { type: "DUMMY" };
      })
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  private handleSuccessResponse(resData: AuthResponseData) {
    const expirationDuration: number = +resData.expiresIn * 1000;
    const expirationDate = new Date(new Date().getTime() + expirationDuration);
    const userCreated = new User(
      resData.email,
      resData.localId,
      resData.idToken,
      expirationDate
    );
    localStorage.setItem("userData", JSON.stringify(userCreated));
    this.authService.setAutoSignoutTimer(expirationDuration);
    return new AuthActions.AuthenticateSuccess({
      email: resData.email,
      token: resData.idToken,
      userId: resData.localId,
      expirationDate: expirationDate,
      redirect: true,
    });
  }

  private handleErrorResponse(errorRes) {
    let errorMessage = "Something went wrong";
    if (!errorRes.error || !errorRes.error.error) {
      return of(new AuthActions.AuthenticateFail(errorMessage));
    }
    switch (errorRes.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage =
          "Email is already taken, please try using another email address";
        break;
      case "EMAIL_NOT_FOUND":
        errorMessage = "Email address does not exist, try signing up";
        break;
      case "INVALID_PASSWORD":
        errorMessage =
          "Password entered does not match the currently stored password";
        break;
    }

    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
}
