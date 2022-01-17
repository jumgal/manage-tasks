import { NotFoundException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";



@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto
        const query = this.createQueryBuilder('task')
        query.where({ user })
        if (status) {
            query.andWhere('task.status = :status', { status })
        }

        if (search) {
            query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', {
                search: `%${search}%`
            })
        }

        return query.getMany()

    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto

        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        })
        await this.save(task)

        return task
    }

    async deleteTask(id: string, user: User): Promise<void> {
        const result = await this.delete({ id, user })

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not Found`)
        }

    }

    async updateTask(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.findOne({ id, user })
        if (!task) throw new NotFoundException(`Task with ID ${id} not found`)
        task.status = status
        await this.save(task)
        return task
    }
}