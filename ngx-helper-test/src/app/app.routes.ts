import { Routes } from '@angular/router';

import {
    PageCardComponent,
    PageIndexComponent,
    PagePageGroupComponent,
    PagePipesComponent,
    PageSectionComponent,
    PageValueComponent,
} from './pages';

export const routes: Routes = [
    { path: '', component: PageIndexComponent },

    { path: 'card', component: PageCardComponent },
    { path: 'page-group', component: PagePageGroupComponent },
    { path: 'section', component: PageSectionComponent },
    { path: 'value', component: PageValueComponent },

    { path: 'pipes', component: PagePipesComponent },

    { path: '**', redirectTo: '/' },
];
