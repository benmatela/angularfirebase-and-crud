import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/models/auth/user.interface';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  isLoading = false;
  registerForm = {} as FormGroup;
  errorMessage = '';
  successMessage = '';
  authError: any;

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/todos']);
    }

    this.authService.setAuthSuccessMessageStore('');
    this.authService.setAuthErrorMessageStore('');

    this.authService.authSuccessMessage.subscribe((res) => {
      if (res && res.length > 0) {
        this.successMessage = res;
        this.registerForm.reset();
      }
    });

    this.authService.authErrorMessage.subscribe((res) => {
      if (res && res.length > 0) {
        this.errorMessage = res;
      }
    });
  }

  ngOnInit() {
    this.successMessage = '';
    this.errorMessage = '';
    this.registerForm = this.formBuilder.group(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      },
      {
        validator: this.passwordValidator('password', 'confirmPassword'),
      }
    );
  }

  passwordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.passwordValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  public hasError = (controlName: string, errorName: string): boolean =>
    this.registerForm.controls[controlName].hasError(errorName) &&
    this.registerForm.controls[controlName].touched;

  submitForm(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
    const user = {} as IUser;
    user.email = String(this.registerForm.value.email);
    user.password = String(this.registerForm.value.password);

    this.authService.register(user).then((res) => {
      this.isLoading = false;
    });
  }
}
