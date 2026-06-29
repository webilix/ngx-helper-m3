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
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { timer } from 'rxjs';

import { MatIcon } from '@angular/material/icon';

import { INgxHelperHttpDownloadConfig } from '../ngx-helper-http.interface';

@Component({
    host: { selector: 'download' },
    imports: [MatIcon],
    templateUrl: './download.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './download.component.scss',
})
export class DownloadComponent implements AfterViewInit {
    @HostBinding('className') protected className: string = 'ngx-helper-m3-http';
    @HostBinding('style.left') protected left: string = 'calc(-250px - 1rem)';
    @HostBinding('style.bottom') public bottom: string = '1rem';

    @Input({ required: true }) id!: string;
    @Input({ required: true }) path!: string;
    @Input({ required: true }) title!: string;
    @Input({ required: true }) config!: Partial<INgxHelperHttpDownloadConfig>;
    @Input({ required: true }) onSuccess!: (arrayBuffer: ArrayBuffer) => void;
    @Input({ required: true }) onError!: () => void;
    @Input({ required: true }) close!: () => void;

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
        setTimeout(this.download.bind(this), 1);
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
                        this.progress.update(() => (progress <= 100 ? progress : 100));
                        break;

                    case HttpEventType.Response:
                        this.progress.update(() => 100);
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
