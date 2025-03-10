import { ITodo } from "./TodoModal";

export interface IPaginatedGetTodoAPIRequest {
    pageNumber: number;
    pageSize: number;
    sortByState: boolean;
}

export interface IPaginatedGetTodoAPIResponse {
    todos: ITodo[];
    total: number;
}


export interface IPostTodoAPIRequest {
    success: boolean;
    message: string;
}