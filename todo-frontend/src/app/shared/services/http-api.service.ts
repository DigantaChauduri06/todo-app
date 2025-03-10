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

  getAllTodos(body: IPaginatedGetTodoAPIRequest) : Observable<ITodo[]> {
    return this._http.post(environment.todoApiUrl +'get-todos', body) as Observable<ITodo[]>;
  }

  todoCrud(body: ITodo) : Observable<IPostTodoAPIRequest> | Observable<ITodo> {
    return this._http.post(environment.todoApiUrl +'todos', body) as Observable<ITodo> | Observable<IPostTodoAPIRequest>;
  }

  getAllUsers() : Observable<string[]> {
    return this._http.get(environment.todoApiUrl +'users') as Observable<string[]>;
  }

}
