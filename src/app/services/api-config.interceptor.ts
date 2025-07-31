import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";

import { Observable } from "rxjs";

@Injectable()
export class ApiConfigInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const clonedRequest = request.clone({
      headers: request.headers,
      // .set("auth-key", "14d437de-e03a-11e9-9d36-2a2ae2dbcce4")
      // .set("app-id", "14d43568-e03a-11e9-9d36-2a2ae2dbcce4")
      // .set("Content-Type", "application/json"),
    });
    return next.handle(clonedRequest);
  }
}
