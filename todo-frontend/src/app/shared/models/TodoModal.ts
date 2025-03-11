export enum TodoPriorityType {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}
  
export interface ITodo {
    desc: string;
    isCompleted: boolean;
    id: number | null; // it will be null when it is a new todo
    createdAt: string;
    priority: TodoPriorityType;
    userMentioned: string[];
    isDeleted: boolean;
    longDesc?: string;
}