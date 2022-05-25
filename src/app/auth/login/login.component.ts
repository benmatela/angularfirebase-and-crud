import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = {} as FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/todos']);
    }

    this.authService.setAuthSuccessMessageStore('');
    this.authService.setAuthErrorMessageStore('');

    this.authService.authSuccessMessage.subscribe(res => {
      if (res && res.length > 0) {
        this.successMessage = res;
        this.loginForm.reset();;
      }
    });
    
    this.authService.authErrorMessage.subscribe(res => {
      if (res && res.length > 0) {
        this.errorMessage = res;
      }
    });
  }

  ngOnInit() {
    this.errorMessage = '';
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  public hasError = (controlName: string, errorName: string): boolean =>
    this.loginForm.controls[controlName].hasError(errorName) &&
    this.loginForm.controls[controlName].touched;

  submitForm(): void {
    this.isLoading = true;
    this.authService.setAuthSuccessMessageStore('');
    this.authService.setAuthErrorMessageStore('');

    this.authService
      .login(String(this.loginForm.value.email), String(this.loginForm.value.password))
      .then((res) => {
        this.isLoading = false;
      });
  }
}
