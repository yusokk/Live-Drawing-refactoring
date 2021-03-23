import React, { useEffect } from 'react';
import { mouseDown, mouseMove, mouseUp, key } from '../../../functions/draw';
import '../index.css';
import { useCanvasCtxDispatch } from '../DrawContext';

interface Layer {
  name: string;
  id: string;
  buttonId: string;
}

interface LayerComponentProps {
  activeTool: string;
  color: string;
  lineWidth: number;
  eraserWidth: number;
  layers: Layer[];
  canvas: HTMLCanvasElement;
  layerCount: number;
  // canvasCtx: any;
  activeLayer: any;
  setLayers: any;
  setCanvas: any;
  setLayerCount: any;
  setActiveLayer: any;
  // setCanvasCtx: any;
}

function LayerComponent({
  activeTool,
  color,
  lineWidth,
  eraserWidth,
  layers,
  canvas,
  layerCount,
  activeLayer,
  setLayers,
  setCanvas,
  setLayerCount,
  setActiveLayer,
}: LayerComponentProps) {
  // const [canvasCtx, setCanvasCtx] = useContext(CanvasCtxContext);
  const canvasCtxDispatch = useCanvasCtxDispatch();

  async function createLayer() {
    console.log('create layer');

    const newLayer: Layer = {
      name: `layer-${layerCount}`,
      id: `layer-id-${layerCount}`,
      buttonId: `layer-id-${layerCount}-button`,
    };

    // 새로 만들어진 layer를 activeLayer로 바꾸기
    if (activeLayer === null) {
      await setActiveLayer(newLayer);
    }
    setLayers([...layers, newLayer]);
    setLayerCount(layerCount + 1);
    // resize();
  }

  function deleteLayer() {
    console.log('delete layer');
    if (layers.length === 1) return;

    let index = 0;
    layers.forEach((layer, i) => {
      if (layer.name === activeLayer.name) {
        index = i;
      }
    });
    layers.splice(index, 1);
    setLayers(layers);

    if (index === layers.length && index >= 1) {
      index -= 1;
    }
    selectActiveLayer(layers[index]);
  }

  function selectActiveLayer(layer: Layer) {
    console.log('select active layer');

    const newCanvas: any = document.getElementById(layer.id);
    canvasCtxDispatch({ type: 'SET_CTX', ctx: newCanvas.getContext('2d') });
    setActiveLayer(layer);
  }

  useEffect(() => {
    createLayer();
  }, []);

  useEffect(() => {
    if (layers.length !== 0) {
      selectActiveLayer(layers[layers.length - 1]);
    }
  }, [layers]);

  return (
    <>
      <div>
        <button className='button layer_space' onClick={createLayer}>
          make layer
        </button>
        <button className='button' onClick={deleteLayer}>
          delete layer
        </button>
        <div id='layerButtonContainer'>
          {layers.map((layer) => {
            return (
              <span
                key={layer.name}
                id={layer.buttonId}
                className={`layer_space ${
                  activeLayer.name === layer.name ? 'active-layer' : ''
                }`}
                onClick={() => selectActiveLayer(layer)}
              >
                {layer.name}
              </span>
            );
          })}
        </div>
      </div>
      <div id='canvasContainer' className='spacer app relative'>
        {layers.map((layer) => {
          return (
            <canvas
              key={layer.name}
              id={layer.id}
              className={'layer'}
              width={window.innerWidth}
              height={window.innerHeight}
              onMouseDown={(e) => mouseDown(e)}
              onMouseMove={(e) =>
                mouseMove(e, activeTool, color, lineWidth, eraserWidth)
              }
              onMouseUp={() => mouseUp()}
              onKeyDown={key}
            />
          );
        })}
      </div>
    </>
  );
}

export default LayerComponent;
