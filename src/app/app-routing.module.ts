import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo:'import-survey',
    pathMatch:"full"
  },

  {
    path:'import',
    loadChildren: () => import('./modules/import-safety/import-safety.module').then(m => m.ImportSafetyModule)
  },
  {
    path:'import-survey',
    loadChildren: () => import('./modules/import-survey/import-survey.module').then(m => m.ImportSurveyModule)
  },
  {
    path:'export-survey',
    loadChildren: () => import('./modules/export-survey/export-survey.module').then(m => m.ExportSurveyModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
