import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
import { isUUID } from 'class-validator'

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository) { }


    getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user)
    }

    async getTaskById(id: string, user: User): Promise<Task> {

        try {
            const found = await this.taskRepository.findOne({ id, user })
            if (id && !isUUID(id)) throw new Error(`Invalid id, UUID format expected but received ${id}`);
            if (!found) throw new NotFoundException(`Task with ID ${id} not found`)

            return found;
        } catch (error) {
            console.log(error)
        }
    }



    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user)
    }

    deleteTask(id: string, user: User): Promise<void> {
        return this.taskRepository.deleteTask(id, user)
    }


    updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        return this.taskRepository.updateTask(id, status, user)
    }

















    // private tasks: Task[] = []

    // getTaskById(id: string): Task {
    //     const found = this.tasks.find(t => t.id === id)

    //     if (!found) {
    //         throw new NotFoundException()
    //     }

    //     return found
    // }

    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    // getTaskWithFilters(filterDto: GetTasksFilterDto) {

    //     const { status, search } = filterDto

    //     let tasks = this.getAllTasks()
    //     if (status) {
    //         tasks = tasks.filter(task => task.status === status)
    //     }

    //     if (search) {
    //         tasks = tasks.filter(task => {
    //             if (task.title.includes(search) || task.description.includes(search)) {
    //                 return true
    //             }
    //             return false
    //         })
    //     }
    //     return tasks
    // }

    // createTask(createTaskDto: CreateTaskDto): Task {
    //     const { title, description } = createTaskDto
    //     const task: Task = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN
    //     }
    //     this.tasks.push(task)
    //     return task
    // }

    // deleteTaskById(id: string): void {
    //     const found = this.getTaskById(id)
    //     this.tasks = this.tasks.filter(task => task.id !== id)
    // }

    // updateTaskStatus(id: string, status: TaskStatus) {
    //     const task = this.getTaskById(id)

    //     task.status = status
    //     return task
    // }
}
