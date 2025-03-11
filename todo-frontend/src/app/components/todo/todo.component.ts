import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormControl } from '@angular/forms';
import { ITodo, TodoPriorityType } from '../../shared/models/TodoModal';
import { tempTodo } from './temp';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SharedService } from '../../shared/services/shared.service';
import dayjs from 'dayjs'
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateTodoComponent } from '../add-update-todo/add-update-todo.component';
import { HttpApiService } from '../../shared/services/http-api.service';
import { ProfileSelectionComponent } from '../profile-selection/profile-selection.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [SharedModule],
templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss', '../../../mat-input-custom.scss']
})
export class TodoComponent implements OnInit {
  currentUserObj: {id: string, name: string} = {id: '', name: ''};
  activeOrInactive: boolean = true;
  count: number = 0;
  userList: {id: string, name: string}[] = [];
  userApiData: any[] = []
  users = new FormControl('');
  priority = new FormControl('');
  priorotyList: TodoPriorityType[] = [
    TodoPriorityType.LOW,
    TodoPriorityType.MEDIUM,
    TodoPriorityType.HIGH
];
selectedTodos: ITodo[] = []

  todoList: ITodo[] = tempTodo;
  constructor(private _commonSvc: SharedService, private _dialog: MatDialog, private _http: HttpApiService) {
  }
  ngOnInit(): void {
    this.getAllUsers();
  }
  editTodo(todo: ITodo) {
    this.handleAddUpdateTask('update', todo);
  }
  deleteTodo(todo: ITodo) {
    
  }

  getAllUsers() {
    this._http.getAllUsers().subscribe((res: any) => {
      this.userApiData = res;
      this.userList = res.map((user: any) => {
        return {
          name: user.username,
          id: user._id
        }
      });
      this._dialog.open(ProfileSelectionComponent, {
        width: '35rem',
        disableClose: true,
        data: {
          users: this.userList
        }
      })
      .afterClosed()
      .subscribe((userId: any) => {
        if (userId) {
          const user = this.userList.find(user => user.id === userId); 
          if (user) {
            this.currentUserObj = user;
          }
        }
      });
    })
  }
  markComplete(todo: ITodo) {
    
  }
  handleAddUpdateTask(type:'add' |'update', todo: ITodo = {} as ITodo) {
    this._dialog.open(AddUpdateTodoComponent, {
      width: '35rem',
      data: {
        type,
        todo,
        users: this.userList
      }
    })
  }
  handleDownload() {
    if (!this.selectedTodos.length) {
      this._commonSvc.openToast('No todos selected for download');
      return;
    }
  
    const csvData = this.selectedTodos.map(todo => {
      const userMentioned = todo.userMentioned.join('; ');
      return `${todo.desc},${todo.priority},${dayjs(todo.createdAt).format("YYYY-MM-DD HH:mm:ss")},${userMentioned}`;
    });
  
    const csvContent = `Description,Priority,CreatedAt,UserMentioned\n` + csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todos.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  
  handleTodoChange(event: MatCheckboxChange, todo: ITodo) {
    if (event.checked) {
      this.selectedTodos.push(todo);
    } else {
      this.selectedTodos = this.selectedTodos.filter(_todo => todo.id != _todo.id);
    }
  }

}
