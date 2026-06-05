import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/containers/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'editor',
    loadComponent: () => import('./features/editor/containers/editor/editor.component').then(m => m.EditorComponent),
    canActivate: [authGuard]
  },
  {
    path: 'editor/:id',
    loadComponent: () => import('./features/editor/containers/editor/editor.component').then(m => m.EditorComponent),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/containers/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'media',
    loadComponent: () => import('./features/media/containers/media/media.component').then(m => m.MediaComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/containers/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
