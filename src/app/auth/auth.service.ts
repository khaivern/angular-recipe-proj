import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BehaviorSubject } from "rxjs";
import { User } from "./user.model";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

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

@Injectable({ providedIn: "root" })
export class AuthService {
  userCreated = new BehaviorSubject<User>(null);
  signoutTimer: any;

  constructor(
    private store: Store<fromApp.AppState>
  ) {}




  setAutoSignoutTimer(expirationDuration: number) {
    console.log(expirationDuration);
    this.signoutTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout())
    }, expirationDuration);
  }

  clearAutoSignoutTimer() {
    this.signoutTimer ? clearTimeout(this.signoutTimer) : null;
  }
}
