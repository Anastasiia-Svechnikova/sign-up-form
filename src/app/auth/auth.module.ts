import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthService } from './components/sign-up/sign-up.service';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

const routes = [
  {
    path: '',
    component: SignUpComponent,
  },
];

@NgModule({
  declarations: [SignUpComponent],
  imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
  ],
  providers: [AuthService],
})
export class AuthModule {}
