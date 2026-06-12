import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(ClerkAuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
   
    @Post()
    @ApiOperation({ summary: 'Create a new task' })
    @ApiBody({ type: CreateTaskDto })
    @ApiResponse({ status: 201, description: 'Task successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request. Validation errors.' })
    create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
        return this.tasksService.create(createTaskDto, user.userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tasks for the current user' })
    @ApiResponse({ status: 200, description: 'List of tasks.' })
    findAll(@CurrentUser() user: any){
        return this.tasksService.findAll(user.userId)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific task by ID' })
    @ApiParam({ name: 'id', description: 'The ID of the task', type: String })
    @ApiResponse({ status: 200, description: 'The requested task.' })
    @ApiResponse({ status: 404, description: 'Task not found.' })
    findOne(@Param('id') id: string, @CurrentUser() user: any) {
        return this.tasksService.findOne(id, user.userId);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a task' })
    @ApiParam({ name: 'id', description: 'The ID of the task to update', type: String })
    @ApiBody({ type: UpdateTaskDto })
    @ApiResponse({ status: 200, description: 'The updated task.' })
    @ApiResponse({ status: 404, description: 'Task not found.' })
    update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @CurrentUser() user: any) {
        return this.tasksService.update(id, updateTaskDto, user.userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a task' })
    @ApiParam({ name: 'id', description: 'The ID of the task to delete', type: String })
    @ApiResponse({ status: 200, description: 'Task successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Task not found.' })
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.tasksService.remove(id, user.userId);
    }
}
