import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { Subject, Observable, of } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
})
export class MoviesComponent implements OnInit {
  movies: any;
  p: number = 1;
  inputs$ = new Subject<any>();
  filterKey: any;
  items: any[] = [];
  filteredItems: any;
  constructor(private _auth: AuthService, private _router: Router) {}
  ngOnInit(): void {
    this.filterKey = '';
    console.log(this.filteredItems);
    this._auth.getallmovies().subscribe(
      (res) => (this.movies = res),
      (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this._router.navigate(['/login']);
          }
        }
      }
    );

    this.getFilteredData(this.inputs$).subscribe((result) => {
      this.filteredItems = result;
      console.log(this.filteredItems);
    });
  }

  onFilterKeyChange(key: any) {
    this.filterKey = key;
    this.inputs$.next({ filterKey: this.filterKey });
    console.log(this.filterKey);
  }

  getFilteredData(inputs: Observable<any>) {
    return inputs.pipe(
      debounceTime(250),
      distinctUntilChanged((p, q) => p.filterKey === q.filterKey),
      switchMap((input) => {
        let key = input.filterKey.trim();
        console.log(key);

        // Filter the data.
        let result = this.movies.results.filter((item: any) =>
          item.title.toLowerCase().includes(key.toLowerCase())
        );
        return of(result);
      })
    );
  }
}
