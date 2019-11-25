import {HttpClient} from '@angular/common/http';
import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

/**
 * @title Table retrieving data through HTTP
 */
@Component({
  selector: 'table-http-example',
  styleUrls: ['table-http-example.css'],
  templateUrl: 'table-http-example.html',
})
export class TableHttpExample implements AfterViewInit {
  //displayedColumns: string[] = ['created', 'state', 'number', 'title'];
  exampleDatabase: ExampleHttpDatabase | null;
  data: Object[] = [];

  resultsLength = 0;
  isLoadingResults = true;

  //@ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  
  columns = [
    { columnDef: 'position', header: 'No.',    cell: (element: any) => `${element.position}` },
    { columnDef: 'name',     header: 'Name',   cell: (element: any) => `${element.name}`     },
    { columnDef: 'weight',   header: 'Weight', cell: (element: any) => `${element.weight}`   },
    { columnDef: 'symbol',   header: 'Symbol', cell: (element: any) => `${element.symbol}`   },
  ];

  /** Column definitions in order */
  displayedColumns = this.columns.map(x => x.columnDef);
  constructor(private _httpClient: HttpClient) {}

  ngAfterViewInit() {
  
    this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);
    this.exampleDatabase.getRepoIssues().subscribe(data => {
      this.isLoadingResults = false;
      this.resultsLength = data.length;
      this.columns = []
      console.log(Object.keys(data[0]))
      for (let entry of Object.keys(data[0])) {
        this.columns.push({columnDef: entry, header: entry,    cell: (element: any) => `${element[entry]}` })
      }
      this.displayedColumns = this.columns.map(x => x.columnDef);
      this.displayedColumns = Object.keys(data[0]);
      this.data = removeArraysFromObjs(data);
    })
    
    // this.paginator.page
    //   .pipe(
    //     startWith({}),
    //     switchMap(() => {
    //       this.isLoadingResults = true;
    //       return this.exampleDatabase!.getRepoIssues(
    //         );
    //     }),
    //     map(data => {
    //       // Flip flag to show that loading has finished.
    //       this.isLoadingResults = false;
    //       this.resultsLength = data.length;
    //       this.columns = []
    //       console.log(Object.keys(data[0]))
    //       for (let entry of Object.keys(data[0])) {
    //         this.columns.push({columnDef: entry, header: entry,    cell: (element: any) => `${element[entry]}` })
    //       }
    //       this.displayedColumns = this.columns.map(x => x.columnDef);
    //       this.displayedColumns = Object.keys(data[0]);
    //       return removeArraysFromObjs(data);
    //     }),
    //     catchError(() => {
    //       this.isLoadingResults = false;
    //       return observableOf([]);
    //     })
    //   ).subscribe(data => this.data = data);
  }
}

var removeArraysFromObjs = function(arr) {
  var no_arr_objs = []
  arr.forEach(function (elem) {
      no_arr_objs.push(removeArraysFromObj(elem));
  })
  return no_arr_objs
}

var removeArraysFromObj = function (obj) {
  var noArrayObj = {}
  for (var prop in obj) {
    if (!Array.isArray(obj[prop]))
    {
      noArrayObj[prop] = obj[prop]
    }
  }
  return noArrayObj
}
/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDatabase {
  constructor(private _httpClient: HttpClient) {}
  getRepoIssues(): Observable<any> {
    const href = 'https://api.github.com/search/issues';
    const requestUrl =
        `http://localhost:8080/getFile?bucket=test-json-comparator&file=fakeResponse1.json`;

    return this._httpClient.get(requestUrl);
  }
}