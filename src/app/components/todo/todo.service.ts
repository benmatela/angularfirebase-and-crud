import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ITodo } from 'src/app/models/todos/todo.interface';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosCollection: AngularFirestoreCollection<ITodo>;
  todos: Observable<ITodo[]>;

  constructor(private firestore: AngularFirestore) {
    this.todosCollection = firestore.collection<ITodo>('todos');
    this.todos = this.todosCollection.valueChanges();
  }

  getTodos() { 
    return this.firestore.collection("todos").snapshotChanges();
  }
}
