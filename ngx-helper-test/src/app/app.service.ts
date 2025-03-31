import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppService {
    private _header?: string;
    get header(): string | undefined {
        return this._header;
    }

    private headerChanged: Subject<string | undefined> = new Subject<string | undefined>();
    get onHeaderChanged(): Observable<string | undefined> {
        return this.headerChanged.asObservable();
    }

    constructor() {}

    setHeader(header?: string) {
        this._header = header;
        this.headerChanged.next(this._header);
    }
}
