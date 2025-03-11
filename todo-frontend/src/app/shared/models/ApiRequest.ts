import { ITodo, TodoPriorityType } from "./TodoModal";

export interface IPaginatedGetTodoAPIRequest {
    pageNumber: number;
    pageSize: number;
    priority: TodoPriorityType[];
    assignedUsers: string[]
}

export interface IPaginatedGetTodoAPIResponse {
    todos: ITodo[];
    total: number;
}


export interface IPostTodoAPIRequest {
    success: boolean;
    message: string;
}