import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { FactoryService } from '../services/factory.service';

@Component({
  selector: 'app-factory',
  templateUrl: './factory.component.html',
  styleUrls: ['./factory.component.css']
})
export class FactoryComponent implements OnInit {


  factories: any;
  closeResult: string;
  amountArray = [];
  selectedIndex = null;
  factoryForm: FormGroup;

  rangeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const min = control.get('min');
    const max = control.get('max');
    return min && max && min.value && max.value && min.value > max.value ? { range: 'Range is invalid' } : null;
  };

  constructor(private modalService: NgbModal, private factoryService: FactoryService) { }

  ngOnInit() {
    // mock data
    // this.factories = [{ title: 't1', min: 0, max: 50, children: [12, 1, 2, 5, 48] },
    // { title: 't2', min: 0, max: 100, children: [1, 2, 99, 11, 23] },
    // { title: 't3', min: 0, max: 75, children: [1, 14, 2, 35, 70] },
    // { title: 't4', min: 0, max: 85, children: [12, 19, 25, 15, 84] }];

    this.factoryService.getFactories().subscribe(res => this.factories = res);
    console.log(this.factories);
    for (let i = 0; i <= 15; i++) {
      this.amountArray.push(i);
    }
  }

  open(content: any, selectedIndex: any, ) {
    console.log(selectedIndex);

    this.selectedIndex = selectedIndex;
    console.log(this.factories[selectedIndex]);
    this.factoryForm = new FormGroup({
      title: new FormControl(this.selectedIndex !== null ? this.factories[selectedIndex].title : null, Validators.required),
      amount: new FormControl(this.selectedIndex !== null ? this.factories[selectedIndex].children.length : null, [Validators.min(0), Validators.max(15)]),
      min: new FormControl(this.selectedIndex !== null ? this.factories[selectedIndex].min : null, Validators.required),
      max: new FormControl(this.selectedIndex !== null ? this.factories[selectedIndex].max : null, Validators.required),
    }, { validators: this.rangeValidator });
    const modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  saveFactory(form: { title: any; min: any; max: any; amount: number; }) {

    this.modalService.dismissAll();

    let factory = {
      _id: undefined,
      title: form.title,
      min: form.min,
      max: form.max,
      children: []
    }

    for (let i = 0; i < form.amount; i++) {
      factory.children.push(this.random(form.min, form.max));
    }

    // update
    if (this.selectedIndex !== null) {
      factory._id = this.factories[this.selectedIndex]._id;
      this.factoryService.regenerateFactory(factory).subscribe();
      this.factories[this.selectedIndex] = factory;
    } else {  
      // Create
      this.factoryService.createFactory(factory).subscribe(_ => {
        this.factoryService.getFactories().subscribe(res => this.factories = res);
      });
    }
    this.selectedIndex = null;
  }

  editName(selectedindex: number) {
    this.toggleEditting(selectedindex, true);
  }

  saveName(selectedindex: number) {
    if (this.factories[selectedindex].title.length == 0) return;
    this.toggleEditting(selectedindex, false);

    // HTTP
    const factoryInfo = {
      _id:  this.factories[selectedindex]._id,
      title: this.factories[selectedindex].title
    }
    this.factoryService.renameFactory(factoryInfo).subscribe();
  }

  toggleEditting(selectedindex: number, isEditting: boolean) {
    document.getElementById("input_" + selectedindex).hidden = !isEditting;
    document.getElementById("done_" + selectedindex).hidden = !isEditting;
    document.getElementById("label_" + selectedindex).hidden = isEditting;
    document.getElementById("edit_" + selectedindex).hidden = isEditting;
  }
  delete(factory: any) {
    this.factories = this.factories.filter((obj: any) => obj !== factory);
    console.log(factory);
    // HTTP
    this.factoryService.deleteFactory(factory._id).subscribe();
  }

  random(min: number, max: number) {
    return Math.floor(Math.random() * max) + min;
  }
}
