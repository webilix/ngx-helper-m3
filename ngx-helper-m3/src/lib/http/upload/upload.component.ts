import {
    AfterViewInit,
    Component,
    HostBinding,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    WritableSignal,
    signal,
} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { timer } from 'rxjs';

import { MatIcon } from '@angular/material/icon';

import { INgxHelperHttpUploadConfig } from '../ngx-helper-http.interface';

@Component({
    host: { selector: 'upload' },
    imports: [MatIcon],
    templateUrl: './upload.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './upload.component.scss',
})
export class UploadComponent<R, E> implements AfterViewInit {
    @HostBinding('className') protected className: string = 'ngx-helper-m3-http';
    @HostBinding('style.left') protected left: string = 'calc(-250px - 1rem)';
    @HostBinding('style.bottom') bottom: string = '1rem';

    @Input({ required: true }) id!: string;
    @Input({ required: true }) file!: File;
    @Input({ required: true }) url!: string;
    @Input({ required: true }) config!: Partial<INgxHelperHttpUploadConfig>;
    @Input({ required: true }) close!: (type: 'RESPONSE' | 'ERROR', result: any, status: HttpStatusCode) => void;

    protected progress: WritableSignal<number> = signal(0);

    constructor(
        private readonly httpClient: HttpClient,
        private readonly changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngAfterViewInit(): void {
        timer(0).subscribe(() => {
            this.left = '1rem';
            this.changeDetectorRef.markForCheck();
        });
        setTimeout(this.upload.bind(this), 100000);
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
                        this.progress.update(() => (progress > 100 ? 100 : +progress.toFixed(2)));
                        break;

                    case HttpEventType.Response:
                        this.progress.update(() => 100);
                        this.close('RESPONSE', event.body, event.status);
                        break;
                }
            },
            error: (error: HttpErrorResponse) => this.close('ERROR', error.error, error.status),
        });
    }
}
