import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.css']
})
export class FactoryComponent implements OnInit {


  factories: any;
  closeResult: string;
  amountArray = [];
  selectedFactory = null;
  factoryForm: FormGroup;


  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    // mock data
    this.factories = [{title: 't1', min: 0, max: 50, children: [12,1,2,5,48]},
    {title: 't2', min: 0, max: 100, children: [1,2,99,11,23]},
    {title: 't3', min: 0, max: 75, children: [1,14,2,35,70]},
    {title: 't4', min: 0, max: 85, children: [12,19,25,15,84]}];

    for (let i = 0; i <= 15; i++) {
      this.amountArray.push(i);
    }
  }

  open(content, factory) {
    this.selectedFactory = factory;
    this.factoryForm = new FormGroup({
      title: new FormControl(this.selectedFactory ? this.selectedFactory.title : null),
      amount: new FormControl(this.selectedFactory ? this.selectedFactory.children.length : null),
      min: new FormControl(this.selectedFactory ? this.selectedFactory.min : null),
      max: new FormControl(this.selectedFactory ? this.selectedFactory.max : null),
    });
    const modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true });
    console.log(this.selectedFactory);
  }

  saveFactory(form) {
    this.modalService.dismissAll();
    this.selectedFactory = null;
    console.log(this.factoryForm.value);
  }
}
