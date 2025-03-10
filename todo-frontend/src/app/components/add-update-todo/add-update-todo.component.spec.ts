import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateTodoComponent } from './add-update-todo.component';

describe('AddUpdateTodoComponent', () => {
  let component: AddUpdateTodoComponent;
  let fixture: ComponentFixture<AddUpdateTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateTodoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUpdateTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
