import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from "./app-routing.module";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from "./app.component";
import { NzRateModule } from 'ng-zorro-antd/rate';
import { TimeAgoPipe } from './time-ago.pipe';
// import { NgZorroAntdModule, NZ_I18N, en_US } from "ng-zorro-antd";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";
import { NzGridModule } from 'ng-zorro-antd/grid';
import { HeaderComponent } from "./header/header.component";
import { SearchBoxComponent } from "./search-box/search-box.component";
import { ChatBoxComponent } from "./chat-box/chat-box.component";
import { NzAutocompleteModule } from "ng-zorro-antd/auto-complete";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzCarouselModule } from "ng-zorro-antd/carousel";
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzCardModule } from 'ng-zorro-antd/card';

import { ApiConfigInterceptor } from "./services/api-config.interceptor";
import { SpeechRecognitionService } from "./services/speech-recognition.service";
import { ScrollToBottomDirective } from "./directives/scroll-to-bottom.directive";

import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { chatbotApiInterceptor } from "./chatbot-api.interceptor";




registerLocaleData(en);

@NgModule({
   declarations: [
      AppComponent,
      HeaderComponent,
      SearchBoxComponent,
      ChatBoxComponent,
      TimeAgoPipe,

      ScrollToBottomDirective,
   ],
   providers: [
      SpeechRecognitionService,
      // { provide: NZ_I18N, useValue: en_US },
      {
         provide: HTTP_INTERCEPTORS,
         useClass: chatbotApiInterceptor,
         multi: true,
      },
      { provide: HTTP_INTERCEPTORS, useClass: ApiConfigInterceptor, multi: true },
   ],
   imports: [
      NzTagModule,
      NzIconModule,
      NzCarouselModule,
      NzCardModule,
      MatAutocompleteModule,
      NzDescriptionsModule,
      MatInputModule,
      BrowserModule,
      AppRoutingModule,
      MatFormFieldModule,
      ReactiveFormsModule,
      NzRateModule,
      NzGridModule,

      FormsModule,
      HttpClientModule,
      BrowserAnimationsModule,
      NzAutocompleteModule,
      MatCardModule,
      MatButtonModule


   ],
   bootstrap: [AppComponent],
   exports: [TimeAgoPipe]
})
export class AppModule {}
