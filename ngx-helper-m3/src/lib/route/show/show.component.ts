import { Component, HostBinding, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { MatIcon } from '@angular/material/icon';

import { Feature, Map, View } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { LineString, Point } from 'ol/geom';
import interactionDoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

import { Helper, IGeoRouteLength } from '@webilix/helper-library';

import { INgxHelperRouteConfig, NgxHelperRoute } from '../ngx-helper-route.interface';

@Component({
    host: { selector: 'show', '(window:keydown)': 'checkKey($event)' },
    imports: [ClipboardModule, MatIcon, DecimalPipe],
    templateUrl: './show.component.html',
    styleUrl: './show.component.scss',
})
export class ShowComponent implements OnInit {
    @HostBinding('className') protected className: string = 'ngx-helper-m3-route';

    public route!: NgxHelperRoute;
    public config?: Partial<INgxHelperRouteConfig>;
    public close!: () => void;

    public distance!: IGeoRouteLength;
    public copied?: number;
    public index: number = 0;
    private layers: VectorLayer[] = [];

    private copyTimeout?: any;
    private map!: Map;

    ngOnInit(): void {
        this.distance = Helper.GEO.routeLength(this.route);
        const coordinates: Coordinate = [this.route[0].longitude, this.route[0].latitude];
        const zoom: number = this.config?.zoom || 15;

        this.map = new Map({
            view: new View({ center: coordinates, zoom, projection: 'EPSG:4326' }),
            layers: [new TileLayer({ source: new OSM() })],
            target: 'ngx-helper-m3-route-map',
        });

        this.map
            .getInteractions()
            .getArray()
            .forEach((interaction) => {
                if (interaction instanceof interactionDoubleClickZoom) this.map.removeInteraction(interaction);
            });

        // ADD LINES
        this.route.forEach((coordinates, index: number) => {
            if (index == 0) return;
            const color: string = this.config?.circle?.color || 'rgb(42, 101, 126)';

            const from: number[] = [this.route[index - 1].longitude, this.route[index - 1].latitude];
            const to: number[] = [coordinates.longitude, coordinates.latitude];
            const feature: Feature<LineString> = new Feature<LineString>({ geometry: new LineString([from, to]) });
            const layer: VectorLayer = new VectorLayer({
                source: new VectorSource({ features: [feature] }),
                style: {
                    'stroke-line-dash': [3, 3, 3],
                    'stroke-color': color,
                    'stroke-width': 2,
                },
            });
            this.map.addLayer(layer);
        });

        // ADD CIRCLES
        this.route.forEach((coordinates, index: number) => {
            const circle = {
                size: this.config?.circle?.size || 10,
                color: this.config?.circle?.color || 'rgb(42, 101, 126)',
            };

            const text = {
                size: this.config?.text?.size || 13,
                font: this.config?.text?.font || 'Yekan',
                color: this.config?.text?.color || 'rgb(255, 255, 255)',
            };

            const point = new Point([coordinates.longitude, coordinates.latitude]);
            const layer = new VectorLayer({
                source: new VectorSource({ features: [new Feature(point)] }),
                style: {
                    // CIRCLE
                    'circle-fill-color': circle.color,
                    'circle-radius': circle.size,
                    'circle-stroke-color': '#FFF',
                    'circle-stroke-width': 1,
                    // TEXT
                    'text-value': (index + 1).toString(),
                    'text-font': `${text.size}px ${text.font}`,
                    'text-fill-color': text.color,
                    'text-offset-y': 1,
                    'text-stroke-color': circle.color,
                    'text-stroke-width': 2,
                },
            });
            this.map.addLayer(layer);
        });

        this.addLayers();
    }

    addLayers(): void {
        this.layers.forEach((layer: VectorLayer) => this.map.removeLayer(layer));
        this.layers = [];

        // ADD CIRCLES
        this.route.forEach((coordinates, index: number) => {
            if (index !== this.index) return;

            const circle = {
                size: this.config?.circle?.size || 10,
                color: this.config?.circle?.color || 'rgb(42, 101, 126)',
            };

            const text = {
                size: this.config?.text?.size || 13,
                font: this.config?.text?.font || 'Yekan',
                color: this.config?.text?.color || 'rgb(255, 255, 255)',
            };

            const point = new Point([coordinates.longitude, coordinates.latitude]);
            const layer = new VectorLayer({
                source: new VectorSource({ features: [new Feature(point)] }),
                style: {
                    // CIRCLE
                    'circle-fill-color': circle.color,
                    'circle-radius': circle.size * 1.4,
                    'circle-stroke-color': '#FFF',
                    'circle-stroke-width': 1,
                    // TEXT
                    'text-value': (index + 1).toString(),
                    'text-font': `${text.size * 1.2}px ${text.font}`,
                    'text-fill-color': text.color,
                    'text-offset-y': 1,
                    'text-stroke-color': circle.color,
                    'text-stroke-width': 2,
                },
            });
            this.map.addLayer(layer);
            this.layers.push(layer);
        });
    }

    animate(index: number): void {
        if (!this.route[index]) return;

        this.index = index;
        this.addLayers();

        const center: Coordinate = [this.route[index].longitude, this.route[index].latitude];
        this.map.getView().animate({ center, duration: 250 });
    }

    setCopy(index: number): void {
        if (this.copyTimeout) clearTimeout(this.copyTimeout);

        this.copied = index;
        this.copyTimeout = setTimeout(() => (this.copied = undefined), 1000);
    }

    checkKey(event: any): void {
        if (!(event instanceof KeyboardEvent)) return;

        if (event.code === 'Escape') {
            event.preventDefault();
            this.close();
        }

        if (this.index !== undefined) {
            const change: number = event.code === 'ArrowUp' ? -1 : event.code === 'ArrowDown' ? 1 : 0;
            if (change !== 0) {
                event.preventDefault();
                this.animate(this.index + change);
            }
        }
    }
}
