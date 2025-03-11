import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { TodoPriorityType } from '../../shared/models/TodoModal';
import { FormControl } from '@angular/forms';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-add-update-todo',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-update-todo.component.html',
  styleUrls: ['./add-update-todo.component.scss', '.././../../mat-input-custom.scss']
})
export class AddUpdateTodoComponent implements OnInit {
  constructor(private _dialogRef: MatDialogRef<AddUpdateTodoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _commonSvc: SharedService) {
  }
  priorotyList: TodoPriorityType[] = [
      TodoPriorityType.LOW,
      TodoPriorityType.MEDIUM,
      TodoPriorityType.HIGH
  ];
  priorityControl = new FormControl('');
  isReadOnly: boolean = false;
  count: number = 0;
  description: string = "";
  title: string = "";
  users: string[] = []
  ngOnInit() {
    if (this.data.type === "update") {
      this.title = this.data.todo.desc;
      this.description = this.data.todo.longDesc || "";
      this.priorityControl.setValue(this.data.todo.priority);
      this.count = this.description.length;
      this.users = this.data.users.map((user: any) => user.name.toLowerCase());
    }
  }
  handleDescription(event: any) {
    this.count = event.target["value"]?.length || 0;
  }
  handleUpdate() {
    if (!this.priorityControl.value || !this.title) {
      this._commonSvc.openToast("Please update mandatory fields");
      return;
    }
    if (this.count > 500) {
      this._commonSvc.openToast("Todo description should be below 500 characters");
      return;
    }
  
    // const userList = this.users;
    const mentionedUsers = this.description.match(/@([A-Za-z]+(?:\s[A-Za-z]+)?)/g)?.map(user => user.substring(1)) || [];
    const notFoundUsers: string[] = [];
    // user must have first name and last name
    mentionedUsers.forEach((user) => {
      if (!this.users.includes(user)) {
        notFoundUsers.push(user);
      }
    })
    if (notFoundUsers.length === 0) {
      this._dialogRef.close({
        desc: this.title,
        mentionedUsers: mentionedUsers,
        priority: this.priorityControl.value,
        longDesc: this.description
      })
    } else {
      this._commonSvc.openToast(`User(s) not found: ${notFoundUsers.join(", ")}`);
    }
  }
}
