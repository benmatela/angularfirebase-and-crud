import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';
import { ITodo } from 'src/app/models/todos/todo.interface';

@Injectable({
  providedIn: 'root',
})
export class AddTodoService implements OnDestroy {
  private addTodoErrorMessage$ = new BehaviorSubject<string>('');
  private addTodoErrorMessageStore: { message: string } = {
    message: '',
  };
  readonly addTodoErrorMessage = this.addTodoErrorMessage$.asObservable();

  private addTodoSuccessMessage$ = new BehaviorSubject<string>('');
  private addTodoSuccessMessageStore: { message: string } = {
    message: '',
  };
  readonly addTodoSuccessMessage = this.addTodoSuccessMessage$.asObservable();

  constructor(private firestore: AngularFirestore) {}

  setAddTodoSuccessMessageStore(message: string): void {
    this.addTodoSuccessMessageStore.message = message;
    this.addTodoSuccessMessage$.next(message);
  }

  setAddTodoErrorMessageStore(message: string): void {
    this.addTodoErrorMessageStore.message = message;
    this.addTodoSuccessMessage$.next(message);
  }

  addTodo(todo: ITodo) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection('todos')
        .add(todo)
        .then((res) => {
          this.setAddTodoSuccessMessageStore('Todo added successfully.');
        },
        (err) => {reject(err)
          this.setAddTodoSuccessMessageStore('Error while adding todo.');
        });
    });
  }

  ngOnDestroy(): void {
    this.addTodoSuccessMessage$.subscribe();
    this.addTodoErrorMessage$.subscribe();
  }

}
