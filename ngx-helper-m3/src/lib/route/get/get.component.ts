import { Component, HostBinding, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { MatIcon } from '@angular/material/icon';

import { Feature, Map, View } from 'ol';
import { LineString, Point } from 'ol/geom';
import { Coordinate } from 'ol/coordinate';
import interactionDoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';

import { Helper, IGeoRouteLength } from '@webilix/helper-library';

import { INgxHelperRouteConfig, NgxHelperRoute } from '../ngx-helper-route.interface';

@Component({
    host: { selector: 'get', '(window:keydown)': 'checkEscape($event)' },
    imports: [DragDropModule, MatIcon, DecimalPipe],
    templateUrl: './get.component.html',
    styleUrl: './get.component.scss',
})
export class GetComponent implements OnInit {
    @HostBinding('className') protected className: string = 'ngx-helper-m3-route';

    public route!: NgxHelperRoute;
    public config?: Partial<INgxHelperRouteConfig>;
    public close!: (route?: NgxHelperRoute) => void;

    public distance!: IGeoRouteLength;
    private layers: VectorLayer[] = [];

    private map!: Map;

    ngOnInit(): void {
        const coordinates =
            this.route.length > 0
                ? [this.route[0].longitude, this.route[0].latitude]
                : this.config?.view
                ? [this.config.view.longitude, this.config.view.latitude]
                : [51.3380603, 35.6997382];

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

        this.addLayers();
    }

    addLayers(): void {
        this.layers.forEach((layer: VectorLayer) => this.map.removeLayer(layer));
        this.layers = [];

        this.distance = Helper.GEO.routeLength(this.route);
        if (this.route.length === 0) return;

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
            this.layers.push(layer);
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
            this.layers.push(layer);
        });
    }

    setCoordinates(event: MouseEvent): void {
        event.preventDefault();

        const coordinates: number[] = this.map.getEventCoordinate(event).map((c: number) => +c.toFixed(7));
        if (isNaN(coordinates[0]) || isNaN(coordinates[1])) return;

        this.route.push({ latitude: coordinates[1], longitude: coordinates[0] });
        this.addLayers();

        // ANIMATE
        if (!this.config?.disableAnimate) this.animate(this.route.length - 1);
    }

    selectRoute(): void {
        if (this.route.length < 2) return;
        this.close(this.route);
    }

    animate(index: number): void {
        if (!this.route[index]) return;

        const center: Coordinate = [this.route[index].longitude, this.route[index].latitude];
        this.map.getView().animate({ center, duration: 250 });
    }

    delete(index: number): void {
        if (!this.route[index]) return;

        this.route.splice(index, 1);
        this.addLayers();
    }

    drop(event: CdkDragDrop<any>): void {
        if (event.previousIndex === event.currentIndex) return;
        moveItemInArray(this.route, event.previousIndex, event.currentIndex);
        this.addLayers();
    }

    checkEscape(event: any): void {
        if (!(event instanceof KeyboardEvent)) return;

        if (event.code === 'Escape') {
            event.preventDefault();
            this.close();
        }
    }
}
