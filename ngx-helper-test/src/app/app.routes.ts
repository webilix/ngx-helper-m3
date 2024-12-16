import { Routes } from '@angular/router';

import {
    PageCardComponent,
    PageIndexComponent,
    PagePageGroupComponent,
    PagePipesComponent,
    PageSectionComponent,
} from './pages';

export const routes: Routes = [
    { path: '', component: PageIndexComponent },

    { path: 'card', component: PageCardComponent },
    { path: 'page-group', component: PagePageGroupComponent },
    { path: 'section', component: PageSectionComponent },

    { path: 'pipes', component: PagePipesComponent },

    { path: '**', redirectTo: '/' },
];
