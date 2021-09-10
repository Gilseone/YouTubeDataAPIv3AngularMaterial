import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { YoutubeService } from '../services/youtube.service';

export interface VideoData {
  thumb: string;
  title: string;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  displayedColumns: string[] = ['thumb', 'title'];
  dataSource: MatTableDataSource<VideoData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private unsubscribe$: Subject<any> = new Subject();

  constructor(private youTubeService: YoutubeService) {}

  ngOnInit() {
    var videos: VideoData[] = [];

    this.youTubeService
      .getVideosForChanel('UCU5JicSrEM5A63jkJ2QvGYw', 300)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(lista => {
        for (let element of lista['items']) {
          videos.push({
            thumb: element.snippet.thumbnails.medium.url,
            
            title: element.snippet.title
          });
        }

        console.log(lista['items']);

        this.dataSource = new MatTableDataSource(videos);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  ngAfterViewInit() {
    this.paginator.pageIndex = 0;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
