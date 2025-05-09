import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './components/quiz/quiz.component';
import { Quiz3Component } from './components/quiz3/quiz3.component';
import { Quiz4Component } from './components/quiz4/quiz4.component';
// import { Quiz2Component } from './components/quiz2/quiz2.component';
// import { Quiz3Component } from './components/quiz3/quiz3.component';

// const routes: Routes = [
//   { path: 'mock1', component: QuizComponent },
//   { path: 'mock2', component: Quiz2Component },
//   { path: 'mock3', component: Quiz3Component },
//   { path: ' ', redirectTo: '/mock1', pathMatch: 'full' }, // default route
//   { path: '**', redirectTo: '/mock1' } // wildcard redirect
// ];

const routes: Routes = [
  { path: 'mock1', component: Quiz3Component },
  { path: 'mock2', component: Quiz3Component },
  { path: 'mock3', component: Quiz3Component },
  { path: 'mock4', component: Quiz4Component },
  { path: '', redirectTo: '/mock1', pathMatch: 'full' },
  { path: '**', redirectTo: '/mock1' }
];


// const routes: Routes = [
//   { path: 'quiz/:mockType', component: QuizComponent },
//   { path: '', redirectTo: '/quiz/mock1', pathMatch: 'full' }, // default route
//   { path: '**', redirectTo: '/quiz/mock1' } // wildcard redirect
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
