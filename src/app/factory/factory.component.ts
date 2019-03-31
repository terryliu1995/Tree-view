import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.css']
})
export class FactoryComponent implements OnInit {


  factories: any;


  constructor() { }

  ngOnInit() {
    // mock data
    this.factories = [{title: 't1', min: 0, max: 50, children: [12,1,2,5,48]},
    {title: 't2', min: 0, max: 100, children: [1,2,99,11,23]},
    {title: 't3', min: 0, max: 75, children: [1,14,2,35,70]},
    {title: 't4', min: 0, max: 85, children: [12,19,25,15,84]}]
  }

}
