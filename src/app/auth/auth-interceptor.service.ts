import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { switchMap, take, map } from "rxjs/operators";
import { AuthService } from "./auth.service";
import * as fromApp from "../store/app.reducer"

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private store: Store<fromApp.AppState>) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.select("auth").pipe(
      take(1),
      map(authState => authState.user),
      switchMap(user => {
        if(!user) {
          return next.handle(req);
        }

        const modifiedReq = req.clone({
          params: req.params.append("auth", user.token)
        })

        return next.handle(modifiedReq);
      })
    )
    // return this.authService.userCreated.pipe(
    //   take(1),
    //   switchMap((user) => {
    //     if(!user) {
    //       return next.handle(req);
    //     }
    //     const modifiedReq = req.clone({
    //       params: req.params.append("auth", user.token),
    //     });
    //     return next.handle(modifiedReq);
    //   })
    // );
  }
}
