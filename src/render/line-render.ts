import { ILayer, LineLayer } from '@antv/l7';
import { featureCollection } from '@turf/turf';
import { debounce } from 'lodash';
import { LayerEvent, RenderEvent, SceneEvent } from '../constant';
import {
  ILayerMouseEvent,
  ILineFeature,
  ILineStyle,
  ISceneMouseEvent,
} from '../typings';
import { LayerRender } from './layer-render';

export class LineRender extends LayerRender<ILineFeature, ILineStyle> {
  getLayers(): ILayer[] {
    const { normal, hover, active, style, options } = this.style;

    const layer = new LineLayer(options ?? {})
      .source(featureCollection([]))
      .size('isHover*isActive', (isHover: boolean, isActive: boolean) => {
        return isActive ? active.size : isHover ? hover.size : normal.size;
      })
      .color('isHover*isActive', (isHover: boolean, isActive: boolean) => {
        return isActive ? active.color : isHover ? hover.color : normal.color;
      })
      .shape('line')
      .style(style);

    return [layer];
  }

  onMouseMove = (e: ILayerMouseEvent<ILineFeature>) => {
    this.emit(RenderEvent.mousemove, e);
  };

  onMouseOut = (e: ILayerMouseEvent<ILineFeature>) => {
    this.emit(RenderEvent.mouseout, e);
  };

  onMouseDown = (e: ILayerMouseEvent<ILineFeature>) => {
    this.emit(RenderEvent.dragstart, e);
  };

  onDragging = (e: ILayerMouseEvent<ILineFeature>) => {
    this.emit(RenderEvent.dragging, e);
  };

  onDragEnd = debounce((e: ISceneMouseEvent) => {
    this.emit(RenderEvent.dragend, e);
  }, 0);

  onUnClick = (e: ILayerMouseEvent<ILineFeature>) => {
    this.emit(RenderEvent.unclick, e);
  };

  enableHover = () => {
    this.disableHover();
    this.layers[0]?.on(LayerEvent.mousemove, this.onMouseMove);
    this.layers[0]?.on(LayerEvent.mouseout, this.onMouseOut);
  };

  disableHover = () => {
    this.layers[0]?.off(LayerEvent.mousemove, this.onMouseMove);
    this.layers[0]?.off(LayerEvent.mouseout, this.onMouseOut);
  };

  enableDrag() {
    this.disableDrag();
    this.layers[0].on(LayerEvent.mousedown, this.onMouseDown);
    this.scene.on(SceneEvent.dragging, this.onDragging);
    this.scene.on(SceneEvent.mouseup, this.onDragEnd);
    this.scene.on(SceneEvent.dragend, this.onDragEnd);
  }

  disableDrag() {
    this.layers[0].off(LayerEvent.mousedown, this.onMouseDown);
    this.scene.off(SceneEvent.dragging, this.onDragging);
    this.scene.off(SceneEvent.mouseup, this.onDragEnd);
    this.scene.off(SceneEvent.dragend, this.onDragEnd);
  }

  enableUnClick() {
    this.disableUnClick();
    this.layers[0].on(LayerEvent.unclick, this.onUnClick);
  }

  disableUnClick() {
    this.layers[0].off(LayerEvent.unclick, this.onUnClick);
  }
}
