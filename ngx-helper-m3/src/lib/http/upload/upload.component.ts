import { AfterViewInit, Component, HostBinding } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders, HttpStatusCode } from '@angular/common/http';

import { MatIcon } from '@angular/material/icon';

import { INgxHelperHttpUploadConfig } from '../ngx-helper-http.interface';

@Component({
    host: { selector: 'upload' },
    imports: [MatIcon],
    templateUrl: './upload.component.html',
    styleUrl: './upload.component.scss',
    animations: [
        trigger('host', [
            transition(':enter', [
                style({ left: 'calc(-250px - 1rem)' }),
                animate('100ms ease-in-out', style({ left: '1rem' })),
            ]),
        ]),
    ],
})
export class UploadComponent<R, E> implements AfterViewInit {
    @HostBinding('@host') private host: boolean = true;
    @HostBinding('className') private className: string = 'ngx-helper-m3-http';
    @HostBinding('style.bottom') bottom: string = '1rem';

    public id!: string;
    public file!: File;
    public url!: string;
    public config!: Partial<INgxHelperHttpUploadConfig>;
    public close!: (type: 'RESPONSE' | 'ERROR', result: any, status: HttpStatusCode) => void;

    public progress: number = 0;

    constructor(private readonly httpClient: HttpClient) {}

    ngAfterViewInit(): void {
        setTimeout(this.upload.bind(this), 0);
    }

    upload(): void {
        const formData: FormData = new FormData();
        formData.append('file', this.file);

        const body: { [key: string]: any } = this.config.body || {};
        Object.keys(body).forEach((k: string) => formData.append(k, body[k]));

        let headers: HttpHeaders = new HttpHeaders();
        const header: { [key: string]: any } = this.config.header || {};
        Object.keys(header).forEach((key: string) => (headers = headers.set(key, header[key])));

        let request;
        switch (this.config.method || 'POST') {
            case 'POST':
                request = this.httpClient.post<R>(this.url, formData, { headers, reportProgress: true, observe: 'events' });
                break;
            case 'PUT':
                request = this.httpClient.put<R>(this.url, formData, { headers, reportProgress: true, observe: 'events' });
                break;
            case 'PATCH':
                request = this.httpClient.patch<R>(this.url, formData, { headers, reportProgress: true, observe: 'events' });
                break;
        }

        request.subscribe({
            next: (event: HttpEvent<R>) => {
                switch (event.type) {
                    case HttpEventType.UploadProgress:
                        if (!event.loaded || !event.total) return;
                        const progress: number = (event.loaded / event.total) * 100;
                        this.progress = progress > 100 ? 100 : +progress.toFixed(2);
                        break;

                    case HttpEventType.Response:
                        this.progress = 100;
                        this.close('RESPONSE', event.body, event.status);
                        break;
                }
            },
            error: (error: HttpErrorResponse) => this.close('ERROR', error.error, error.status),
        });
    }
}
