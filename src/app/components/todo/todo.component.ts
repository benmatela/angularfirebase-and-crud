import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ITodo } from 'src/app/models/todos/todo.interface';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {
  isLoading: boolean = true;
  todos: ITodo[] = [];

  constructor(private router: Router, private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoService.todos.subscribe(res => {
      if (res) {
        this.todos = res;
        this.isLoading = false;
      }
    });
  }

  onGoToAddTodo() {
    this.router.navigate(['/todos/add']);
  }

}
