import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IPaginatedGetTodoAPIRequest, IPostTodoAPIRequest } from '../models/ApiRequest';
import { Observable } from 'rxjs';
import { ITodo } from '../models/TodoModal';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {

  constructor(private _http: HttpClient) { }

  getAllUsers() : Observable<string[]> {
    return this._http.get(environment.todoApiUrl +'/users') as Observable<string[]>;
  }
  getTodos(body: any, userId: string) {
    return this._http.post(`${environment.todoApiUrl}/todos/user/${userId}`, body);
  }

  updateTodo(payload: any, todoId: string) {
    return this._http.put(`${environment.todoApiUrl}/todos/${todoId}`, payload);
  }
  addTodo(payload: any) {
    return this._http.post(`${environment.todoApiUrl}/todos`, payload);
  }
  deleteTodo(todoId: string) {
    return this._http.delete(`${environment.todoApiUrl}/todos/${todoId}`);
  }
}
