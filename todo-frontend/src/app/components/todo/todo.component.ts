import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormControl } from '@angular/forms';
import { ITodo, TodoPriorityType, TodoStatus } from '../../shared/models/TodoModal';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SharedService } from '../../shared/services/shared.service';
import dayjs from 'dayjs'
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateTodoComponent } from '../add-update-todo/add-update-todo.component';
import { HttpApiService } from '../../shared/services/http-api.service';
import { ProfileSelectionComponent } from '../profile-selection/profile-selection.component';
import { PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DEFAULT_DIALOG_WIDTH, DEFAULT_PAGE_SIZE, TOAST_MESSAGES } from '../../shared/constants.constants';

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
  countObj: any = 0;
  count: number = 0;
  userList: {id: string, name: string}[] = [];
  userApiData: any[] = []
  users = new FormControl('');
  priority = new FormControl('');
  isLoadingList: boolean = false;
  pageNo: number = 0;
  pageSize: number = DEFAULT_PAGE_SIZE;
  originalTodos: any = [];
  priorotyList: TodoPriorityType[] = [
    TodoPriorityType.LOW,
    TodoPriorityType.MEDIUM,
    TodoPriorityType.HIGH
];
TodoStatus = TodoStatus;
selectedTodos: ITodo[] = []

  todoList: Array<ITodo> = [];
  constructor(private _commonSvc: SharedService, private _dialog: MatDialog, private _http: HttpApiService) {
  }
  ngOnInit(): void {
    this.getAllUsers();
  }
  editTodo(todo: ITodo) {
    this.handleAddUpdateTask('update', todo);
  }
  deleteTodo(todo: ITodo) {
    this.isLoadingList = true;
    this._http.deleteTodo(todo.id as string).subscribe((res: any) => {
      this._commonSvc.openToast(TOAST_MESSAGES.DELETE_SUCCESS);
      this.isLoadingList = false;
      this.getTodoByUserId();
    }
    , error => {
      this.isLoadingList = false;
      this._commonSvc.openToast(TOAST_MESSAGES.DELETE_ERROR);
    });
  }
  handleSwitch(event: MatSlideToggleChange) {
    this.activeOrInactive = event.checked;
    this.todoAssignAccordingToToggle();
  }
  handleBulkUpdate(type: string) {
    this._commonSvc.openToast(TOAST_MESSAGES.BULK_UPDATE_ERROR);
  }
  getTodoByStatus(todoList: any[], status: TodoStatus) {
    return todoList.filter((todo: any) => todo.status === status);
  }
  convertApireponseToTodoList(res: any) {
    return res.todos.map((todo: any) => {
      return {
        desc: todo.title,
        isCompleted: todo.isCompleted,
        id: todo._id,
        createdAt: todo.createdAt,
        priority: todo.priority,
        userMentioned: todo.assignedUsers,
        isDeleted: todo.isDeleted,
        longDesc: todo.description,
        status: todo.status
      }
    })
  }
  todoAssignAccordingToToggle() {
    if (this.activeOrInactive) {
      const todoList: ITodo[] = this.convertApireponseToTodoList(this.originalTodos);
      this.todoList = this.getTodoByStatus(todoList, TodoStatus.PENDING);
      this.count = this.countObj.pendingCount;
    } else {
      const todoList: ITodo[] = this.convertApireponseToTodoList(this.originalTodos);
      this.todoList = this.getTodoByStatus(todoList, TodoStatus.COMPLETED);
      this.count = this.countObj.completedCount;
    }
  }
  getTodoByUserId() {
    const payload = this.createPayloadForGettingTodo();
    this.isLoadingList = true;
    this._http.getTodos(payload, this.currentUserObj.id).subscribe((res: any) => {
      this.originalTodos = res;
      this.countObj = {
        pendingCount: res.pendingCount,
        completedCount: res.completedCount
      };
      this.todoAssignAccordingToToggle();
      this.isLoadingList = false;
    }, error => {
      this.isLoadingList = false;
      this._commonSvc.openToast(TOAST_MESSAGES.FETCH_ERROR);
    });
  }

  handleSwitchUsers() {
    this.currentUserObj = {id: '', name: ''};
    this.pageNo = 0;
    this.pageSize = 10;
    this.todoList = [];
    this.count = 0;
    this.selectedTodos = [];
    this.countObj = {
      pendingCount: 0,
      completedCount: 0
    }
    this._dialog.open(ProfileSelectionComponent, {
      width: DEFAULT_DIALOG_WIDTH,
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
        this.getTodoByUserId();
      }
    }, error => {
      this._commonSvc.openToast(TOAST_MESSAGES.FETCH_ERROR);
    });
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
      this.handleSwitchUsers();
    })
  }
  markComplete(todo: ITodo) {
    const payload = {
      title: todo.desc, 
      description: todo.longDesc, 
      tags: [], //TODO: Tag part UI is pending 
      priority: todo.priority, 
      assignedUsers: todo.userMentioned, 
      status: TodoStatus.COMPLETED
    }
    this.isLoadingList = true;
    this._http.updateTodo(payload, todo.id as string).subscribe((res: any) => {
      this._commonSvc.openToast(TOAST_MESSAGES.MARK_COMPLETE_SUCCESS);
      this.isLoadingList = false;
      this.getTodoByUserId();
    }, error => {
      this.isLoadingList = false;

      this._commonSvc.openToast(TOAST_MESSAGES.MARK_COMPLETE_ERROR);
    });
    
  }
  handleAddUpdateTask(type:'add' |'update', todo: ITodo = {} as ITodo) {
    this._dialog.open(AddUpdateTodoComponent, {
      width: DEFAULT_DIALOG_WIDTH,
      data: {
        type,
        todo,
        users: this.userList
      }
    })
    .afterClosed()
    .subscribe((res: any)=> {
      if (res) {
        const payload = {
          title: res.desc, 
          description: res.longDesc, 
          tags: [], //TODO: Tag part UI is pending 
          priority: res.priority, 
          assignedUsers: res.mentionedUsers, 
          status: TodoStatus.PENDING,
          createdBy: this.currentUserObj.id
        }
        if (type === 'update') {
          this.isLoadingList = true;
          this._http.updateTodo(payload, todo.id as string).subscribe((res: any) => {
            this.isLoadingList = false;
            this._commonSvc.openToast(TOAST_MESSAGES.UPDATE_SUCCESS);
            this.getTodoByUserId();
          },
        error=> {
          this.isLoadingList = false;
          this._commonSvc.openToast(TOAST_MESSAGES.UPDATE_ERROR);
        });
        } 
        else {
            this.isLoadingList = true;
          this._http.addTodo(payload).subscribe((res: any) => {
            this.isLoadingList = false;
            this._commonSvc.openToast(TOAST_MESSAGES.ADD_SUCCESS);
            this.getTodoByUserId();
          }, error => {
            this.isLoadingList = false;
            this._commonSvc.openToast(TOAST_MESSAGES.ADD_ERROR);
          });
        }
        
      }
      
    })
  }
  handleFilterApply() {
    this.pageNo = 0;
    this.getTodoByUserId();
  }
  handleDownload() {
    if (!this.selectedTodos.length) {
      this._commonSvc.openToast(TOAST_MESSAGES.DOWNLOAD_NO_SELECTION);
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

  onPageChange(event: PageEvent) {
    this.pageNo = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getTodoByUserId();

  }

  createPayloadForGettingTodo() {
    return {
      pageNo: this.pageNo,
      pageSize: this.pageSize,
      priority: this.priority.value,
      assignedUsers: this.users.value
  }
}

}
