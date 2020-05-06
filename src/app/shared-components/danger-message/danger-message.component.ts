import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-danger-message',
  templateUrl: './danger-message.component.html',
  styleUrls: ['./danger-message.component.scss']
})
export class DangerMessageComponent implements OnInit {
  @Input() text: string;

  constructor() { }

  ngOnInit() {
  }

}
