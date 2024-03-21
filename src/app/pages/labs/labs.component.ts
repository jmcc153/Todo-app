import { Component, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.scss'
})
export class LabsComponent {
  welcome = 'Welcome to the Labs page!';
  task: WritableSignal<string[]> = signal([
    'Create a new component',
    'Create a new service',
    'Create a new module'
  ])
  name : WritableSignal<string> = signal('Labs');
  lastName : string = 'Page';
  age : number = 25;

  colorControl: FormControl = new FormControl();
  widthControl: FormControl = new FormControl(50);
  messageControl: FormControl = new FormControl('',{
    nonNullable: true,
    validators: [
      Validators.required
    ]
  });

  constructor() {
    this.colorControl.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }


  onClick() {
    console.log('Button clicked');
  }
  onChangeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.name.set(newValue);
    console.log(input.value);
  }
  onKeyDownHandler(event: KeyboardEvent) {
    console.log(event.key);
  }

}
