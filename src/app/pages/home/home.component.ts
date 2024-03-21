import { Component, Injector, WritableSignal, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  task: WritableSignal<Task[]> = signal([]);

  filter : WritableSignal<string> = signal('all');
  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.task();
    if (filter === 'completed') {
      return tasks.filter((task) => task.completed);
    }
    if (filter === 'pending') {
      return tasks.filter((task) => !task.completed);
    }
    return tasks;
  })

  newTaskControl: FormControl = new FormControl('',{
    nonNullable: true,
    validators: [
      Validators.required,

    ]
  }
  );

  injector = inject(Injector);
  ngOnInit() {
    console.log('first')
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      this.task.set(JSON.parse(tasks));
    }
    this.trackTasks();
  }

  trackTasks(){
    effect(() => {
      const tasks = this.task();
      console.log('run effect')
      localStorage.setItem('tasks', JSON.stringify(tasks));
    },{injector: this.injector})
  }
  
  changeEditing(index: number) {
    this.task.update((tasks) => tasks.map((task, i) => {
      if (i === index) {
        return { ...task, isEditing: true };
      }
      return {
        ...task,
        isEditing: false
      };
    }));
  }
  updateTaskTitle(index: number, event : Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.task.update((tasks) => tasks.map((task, i) => {
      if (i === index) {
        return { ...task, title: value, isEditing: false };
      }
      return task;
    }
    ));
  }



  addTask() {
    if(this.newTaskControl.invalid || this.newTaskControl.value.trim() == '') return
    const value = this.newTaskControl.value;
    const newTask: Task = {
      title: value,
      completed: false
    }
    this.task.update((tasks) => [...tasks, newTask]);
    this.newTaskControl.reset();
  }
  removeTask(index: number) {
    this.task.update((tasks) => tasks.filter((_, i) => i !== index));
  }

  updateTaskCompleted(index: number) {
    this.task.update((tasks) => tasks.map((task, i) => {
      if (i === index) {
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  }
  changeFilter(filter: string) {
    this.filter.set(filter);
  }
}
