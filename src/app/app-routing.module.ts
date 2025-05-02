import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './components/quiz/quiz.component';
import { Quiz2Component } from './components/quiz2/quiz2.component';

const routes: Routes = [
  { path: 'mock1', component: QuizComponent },
  { path: 'mock2', component: Quiz2Component },
  { path: ' ', redirectTo: '/mock1', pathMatch: 'full' }, // default route
  { path: '**', redirectTo: '/mock1' } // wildcard redirect
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
