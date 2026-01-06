import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { Feature, Map, View } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatIcon } from '@angular/material/icon';

import { INgxHelperCoordinates, INgxHelperCoordinatesConfig } from '../ngx-helper-coordinates.interface';

@Component({
    host: { selector: 'show', '(window:keydown)': 'checkEscape($event)' },
    imports: [ClipboardModule, MatIcon],
    templateUrl: './show.component.html',
    styleUrl: './show.component.scss',
})
export class ShowComponent implements OnInit {
    @HostBinding('className') protected className: string = 'ngx-helper-m3-coordinates';

    @Input({ required: true }) coordinates!: INgxHelperCoordinates;
    @Input({ required: true }) config?: Partial<Omit<INgxHelperCoordinatesConfig, 'view'>>;
    @Input({ required: true }) close!: () => void;

    protected copied?: 'LATITUDE' | 'LONGITUDE';

    private copyTimeout: any;
    private map!: Map;

    ngOnInit(): void {
        const coordinate: Coordinate = [this.coordinates.longitude, this.coordinates.latitude];
        const point = new Point(coordinate);

        const zoom: number = this.config?.zoom || 15;
        const size: number = this.config?.size || 8;
        const color: string = this.config?.color || 'rgb(42, 101, 126)';

        this.map = new Map({
            view: new View({ center: coordinate, zoom, projection: 'EPSG:4326' }),
            layers: [
                new TileLayer({ source: new OSM() }),
                new VectorLayer({
                    source: new VectorSource({ features: [new Feature(point)] }),
                    style: {
                        'circle-fill-color': color,
                        'circle-radius': size,
                        'circle-stroke-color': '#FFF',
                        'circle-stroke-width': 1,
                    },
                }),
            ],
            target: 'ngx-helper-m3-coordinates-map',
        });
    }

    setCopy(type: 'LATITUDE' | 'LONGITUDE'): void {
        if (this.copyTimeout) clearTimeout(this.copyTimeout);

        this.copied = type;
        this.copyTimeout = setTimeout(() => (this.copied = undefined), 1000);
    }

    checkEscape(event: any): void {
        if (!(event instanceof KeyboardEvent)) return;

        if (event.code === 'Escape') {
            event.preventDefault();
            this.close();
        }
    }
}
