import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";

import { Observable } from "rxjs";

@Injectable()
export class chatbotApiInterceptor implements HttpInterceptor {
   // get user Ip address

   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
      // console.log('ChatBotApiInterceptor was called');

      const clonedRequest = request.clone({
         headers: request.headers
            .set("Cache-Control", "max-age=31536000")
            .set("appId", "8f1a9ebe-7ce5-4c3e-bf3b-18669e4897e3"),
      });
      return next.handle(clonedRequest);
   }
}
