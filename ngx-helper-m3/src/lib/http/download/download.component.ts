import { AfterViewInit, Component, HostBinding } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';

import { MatIcon } from '@angular/material/icon';

import { NgxHelperToastService } from '../../toast/ngx-helper-toast.service';

import { INgxHelperHttpDownloadConfig } from '../ngx-helper-http.interface';

@Component({
    host: { selector: 'download' },
    imports: [MatIcon],
    templateUrl: './download.component.html',
    styleUrl: './download.component.scss',
    animations: [
        trigger('host', [
            transition(':enter', [
                style({ left: 'calc(-250px - 1rem)' }),
                animate('100ms ease-in-out', style({ left: '1rem' })),
            ]),
        ]),
    ],
})
export class DownloadComponent implements AfterViewInit {
    @HostBinding('@host') protected host: boolean = true;
    @HostBinding('className') protected className: string = 'ngx-helper-m3-http';
    @HostBinding('style.bottom') bottom: string = '1rem';

    public id!: string;
    public path!: string;
    public title!: string;
    public config!: Partial<INgxHelperHttpDownloadConfig>;
    public onSuccess!: (arrayBuffer: ArrayBuffer) => void;
    public onError!: () => void;
    public close!: () => void;

    public progress: number = 0;

    constructor(private readonly httpClient: HttpClient, private readonly ngxHelperToastService: NgxHelperToastService) {}

    ngAfterViewInit(): void {
        setTimeout(this.download.bind(this), 0);
    }

    download(): void {
        let headers: HttpHeaders = new HttpHeaders();
        const header: { [key: string]: any } = this.config.header || {};
        Object.keys(header).forEach((key: string) => (headers = headers.set(key, header[key])));

        let request;
        switch (this.config.method || 'GET') {
            case 'GET':
                request = this.httpClient.get(this.path, {
                    headers,
                    reportProgress: true,
                    observe: 'events',
                    responseType: 'arraybuffer',
                });
                break;
            case 'POST':
                request = this.httpClient.post(this.path, {
                    headers,
                    reportProgress: true,
                    observe: 'events',
                    responseType: 'arraybuffer',
                });
                break;
            case 'PUT':
                request = this.httpClient.put(this.path, {
                    headers,
                    reportProgress: true,
                    observe: 'events',
                    responseType: 'arraybuffer',
                });
                break;
            case 'PATCH':
                request = this.httpClient.patch(this.path, {
                    headers,
                    reportProgress: true,
                    observe: 'events',
                    responseType: 'arraybuffer',
                });
                break;
        }

        request.subscribe({
            next: (event: any) => {
                switch (event.type) {
                    case HttpEventType.DownloadProgress:
                        const progress: number =
                            event.loaded && event.total ? Math.ceil((event.loaded / event.total) * 1000) / 10 : 0;
                        this.progress = progress <= 100 ? progress : 100;
                        break;

                    case HttpEventType.Response:
                        this.progress = 100;
                        this.onSuccess(event.body);
                        this.close();
                        break;
                }
            },
            error: () => {
                this.onError();
                this.close();
            },
        });
    }
}
