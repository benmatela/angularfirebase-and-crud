import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ITodo } from 'src/app/models/todos/todo.interface';
import { AddTodoService } from './add-todo.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent {
  isLoading = false;
  addTodoForm = {} as FormGroup;

  successMessage = "";
  errorMessage = "";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private addTodoService: AddTodoService,
  ) {
    this.addTodoService.setAddTodoErrorMessageStore('');
    this.addTodoService.setAddTodoSuccessMessageStore('');

    this.addTodoService.addTodoSuccessMessage.subscribe(res => {
      if (res && res.length > 0) {
        this.successMessage = res;
        this.addTodoForm.reset();
        this.isLoading = false;
      }
    });

    this.addTodoService.addTodoErrorMessage.subscribe(res => {
      if (res && res.length > 0) {
        this.errorMessage = res;
        this.addTodoForm.reset();
        this.isLoading = false;
      }
    });

    this.addTodoForm = this.formBuilder.group({
      name: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
      ]),
      description: new FormControl("", []),
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.addTodoForm.controls;
  }

  public hasError = (controlName: string, errorName: string): boolean =>
    this.addTodoForm.controls[controlName].hasError(errorName) &&
    this.addTodoForm.controls[controlName].touched;

  submitForm() {
    this.isLoading = true;
    let todo = {} as ITodo;
    todo.name = String(this.addTodoForm.value.name);
    todo.description = String(this.addTodoForm.value.description);
    this.addTodoService.addTodo(todo);
  }

  onGoToTodos() {
    this.router.navigate(['/todos']);
  }

}
