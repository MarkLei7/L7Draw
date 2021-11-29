import React from 'react';
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import { DrawControl } from '@antv/l7-draw';

export default () => {
  React.useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        style: 'light',
        center: [116.30470275878906, 39.88352811449648],
        zoom: 10,
      }),
    });
    scene.on('loaded', () => {
      const drawControl = new DrawControl(scene, {
        position: 'topright',
        layout: 'horizontal', // horizontal vertical
        controls: {
          boxSelect: true,
        },
      });

      scene.addControl(drawControl);
      drawControl.on('draw.boxselect', e => {
        console.log('update', e);
      });
    });
  }, []);

  return (
    <div
      style={{
        height: '400px',
        position: 'relative',
      }}
      id="map"
    ></div>
  );
};
