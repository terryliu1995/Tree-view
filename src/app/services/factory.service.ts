import { Injectable } from '@angular/core';
import { Factory } from '../entity/factory';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FactoryService {

  constructor(private http: HttpClient) { }

  //Create Factory
  getFactories() {
    return this.http.get("/api/factory");
  }

  //Create Factory
  createFactory(factoryInfo) {
    return this.http.post("/api/factory", factoryInfo);
  }

  //Rename Factory
  renameFactory(factoryInfo) {
    return this.http.patch("/api/factory", factoryInfo);
  }

  //Regenerate Factory
  regenerateFactory(factoryInfo) {
    return this.http.put("/api/factory", factoryInfo);
  }

  //Delete Factory
  deleteFactory(_id) {
    return this.http.delete("/api/factory/" + _id);
  }

}

export const ANONYMOUS_FACTORY: Factory = {
  _id: undefined,
  title: '',
  min: 0,
  max: 0,
  children: []
}