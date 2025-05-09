import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { SharedModule } from './shared/shared.module';
import { LoaderComponent } from './shared/loader/loader.component';
import { HeaderComponent } from './layout/header/header.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { FooterComponent } from './layout/footer/footer.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { Quiz2Component } from './components/quiz2/quiz2.component';
import { Quiz3Component } from './components/quiz3/quiz3.component';
import { Quiz4Component } from './components/quiz4/quiz4.component';

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    LoaderComponent,
    Quiz2Component,
    HeaderComponent,
    LayoutComponent,
    FooterComponent,
    Quiz3Component,
    Quiz4Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
