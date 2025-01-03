import { Routes } from '@angular/router';

import {
    PageCardComponent,
    PageIndexComponent,
    PagePageGroupComponent,
    PagePipesComponent,
    PageProgressComponent,
    PageSectionComponent,
    PageStickyComponent,
    PageValueComponent,
} from './pages';

export const routes: Routes = [
    { path: '', component: PageIndexComponent },

    { path: 'card', component: PageCardComponent },
    { path: 'page-group', component: PagePageGroupComponent },
    { path: 'progress', component: PageProgressComponent },
    { path: 'section', component: PageSectionComponent },
    { path: 'value', component: PageValueComponent },

    { path: 'sticky', component: PageStickyComponent },

    { path: 'pipes', component: PagePipesComponent },

    { path: '**', redirectTo: '/' },
];
