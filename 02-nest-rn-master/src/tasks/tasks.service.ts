import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Model } from 'mongoose';
import aqp from 'api-query-params';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksGateway } from './tasks.gateway';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name)
  private taskModel: Model<TaskDocument>,
    private tasksGateway: TasksGateway,
  ) { }

  async create(dto: CreateTaskDto) {
    const doc: any = {
      title: dto.title,
      description: dto.description ?? '',
      status: dto.status ?? 'todo',
      assignee: dto.assignee ?? null,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
    };
    const task = await this.taskModel.create(doc);

    // ADD: emit socket event
    this.tasksGateway.emitTaskCreated({
      _id: task._id,
      title: task.title,
      description: task.description,
      status: task.status,
      assignee: task.assignee,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
    });

    return { _id: task._id };
  }

  async findAll(query: any, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    // Support 'search' -> search in title (exact requirement was /tasks; we'll allow title search)
    if (filter.search) {
      const val = String(filter.search);
      filter.title = { $regex: val, $options: 'i' };
      delete filter.search;
    }

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current || isNaN(current)) current = 1;
    if (!pageSize || isNaN(pageSize)) pageSize = 10;

    const totalItems = await this.taskModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const results = await this.taskModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any)
      .lean();

    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      results,
    };
  }

  async findOne(id: string) {
    return await this.taskModel.findById(id).lean();
  }

  async update(dto: UpdateTaskDto) {
    const { _id, ...rest } = dto as any;
    const res = await this.taskModel.updateOne({ _id }, { ...rest });

    // Phát sự kiện sau khi update
    this.tasksGateway.emitTaskUpdated(dto);

    return res;
  }

  async remove(_id: string) {
    if (!_id) throw new BadRequestException('Id required');
    // const res = await this.taskModel.deleteOne({ _id });
    this.tasksGateway.emitTaskDeleted(_id);

    return this.taskModel.deleteOne({ _id });
  }
}
