import { Routes } from '@angular/router';

import { PageIndexComponent, PagePageGroupComponent, PagePipesComponent } from './pages';

export const routes: Routes = [
    { path: '', component: PageIndexComponent },
    { path: 'pipes', component: PagePipesComponent },
    { path: 'page-group', component: PagePageGroupComponent },
    { path: '**', redirectTo: '/' },
];
