import { Routes } from '@angular/router';
import { BoardComponent } from './components/board/board.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: BoardComponent, title: 'Quadro' },
  { path: 'resumo', component: DashboardComponent, title: 'Resumo' },
  { path: '**', redirectTo: '' },
];
