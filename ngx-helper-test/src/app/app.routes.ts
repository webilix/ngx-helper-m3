import { Routes } from '@angular/router';

import { PageIndexComponent, PagePipesComponent } from './pages';

export const routes: Routes = [
    { path: '', component: PageIndexComponent },
    { path: 'pipes', component: PagePipesComponent },
    { path: '**', redirectTo: '/' },
];
