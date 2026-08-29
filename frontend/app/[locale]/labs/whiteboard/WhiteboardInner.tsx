'use client';

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

export default function WhiteboardInner({
  isRtl,
  strokeColor,
  strokeWidth,
  activeTool,
  setActiveTool,
  handleClearRef
}: {
  isRtl: boolean,
  strokeColor: string,
  strokeWidth: number,
  activeTool: string,
  setActiveTool: (tool: string) => void,
  handleClearRef: any
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  
  const activeToolRef = useRef(activeTool);
  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: activeTool === 'draw' || activeTool === 'erase',
      width: width,
      height: height,
      backgroundColor: '#ffffff'
    });
    
    fabricCanvas.freeDrawingBrush.color = strokeColor;
    fabricCanvas.freeDrawingBrush.width = strokeWidth;

    setCanvas(fabricCanvas);

    fabricCanvas.on('mouse:wheel', function(opt) {
      var delta = opt.e.deltaY;
      var zoom = fabricCanvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.05) zoom = 0.05;
      fabricCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;

    fabricCanvas.on('mouse:down', function(opt) {
      var evt = opt.e as any;
      if (activeToolRef.current === 'pan' || evt.altKey) {
        isDragging = true;
        fabricCanvas.selection = false;
        lastPosX = evt.clientX || (evt.touches && evt.touches[0].clientX);
        lastPosY = evt.clientY || (evt.touches && evt.touches[0].clientY);
      }
    });

    fabricCanvas.on('mouse:move', function(opt) {
      if (isDragging) {
        var evt = opt.e as any;
        var clientX = evt.clientX || (evt.touches && evt.touches[0].clientX);
        var clientY = evt.clientY || (evt.touches && evt.touches[0].clientY);
        
        var vpt = fabricCanvas.viewportTransform;
        if (vpt) {
          vpt[4] += clientX - lastPosX;
          vpt[5] += clientY - lastPosY;
          fabricCanvas.requestRenderAll();
        }
        
        lastPosX = clientX;
        lastPosY = clientY;
      }
    });

    fabricCanvas.on('mouse:up', function(opt) {
      if (fabricCanvas.viewportTransform) {
        fabricCanvas.setViewportTransform(fabricCanvas.viewportTransform);
      }
      isDragging = false;
      fabricCanvas.selection = true;
    });

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          fabricCanvas.setWidth(entry.contentRect.width);
          fabricCanvas.setHeight(entry.contentRect.height);
          fabricCanvas.renderAll();
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      fabricCanvas.dispose();
    };
  }, []);

  // Sync tools
  useEffect(() => {
    if (!canvas) return;

    if (activeTool === 'draw') {
      canvas.isDrawingMode = true;
      canvas.defaultCursor = 'crosshair';
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = strokeColor;
        canvas.freeDrawingBrush.width = strokeWidth;
      }
    } else if (activeTool === 'erase') {
      canvas.isDrawingMode = true;
      canvas.defaultCursor = 'cell';
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = '#ffffff';
        canvas.freeDrawingBrush.width = 30;
      }
    } else if (activeTool === 'pan') {
      canvas.isDrawingMode = false;
      canvas.defaultCursor = 'grab';
    } else {
      canvas.isDrawingMode = false;
      canvas.defaultCursor = 'default';
    }
  }, [canvas, activeTool, strokeColor, strokeWidth]);

  // Expose shape/text addition to parent
  useEffect(() => {
    if (!canvas) return;
    
    handleClearRef.current = {
      clear: () => {
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        canvas.renderAll();
      },
      addShape: (type: string) => {
        setActiveTool('select');
        let shape;
        const center = canvas.getVpCenter();
        const opts = { 
          left: center.x - 50, 
          top: center.y - 50, 
          fill: 'transparent', 
          stroke: strokeColor, 
          strokeWidth: 3, 
          cornerColor: '#0ea5e9', 
          borderColor: '#0ea5e9' 
        };
        
        if (type === 'rect') {
          shape = new fabric.Rect({ ...opts, width: 100, height: 100 });
        } else if (type === 'circle') {
          shape = new fabric.Circle({ ...opts, radius: 50 });
        } else if (type === 'triangle') {
          shape = new fabric.Triangle({ ...opts, width: 100, height: 100 });
        }
        
        if (shape) {
          canvas.add(shape);
          canvas.setActiveObject(shape);
          canvas.renderAll();
        }
      },
      addText: () => {
        setActiveTool('select');
        const center = canvas.getVpCenter();
        const text = new fabric.Textbox(isRtl ? 'اكتب هنا...' : 'Type here...', {
          left: center.x - 75,
          top: center.y - 20,
          width: 150,
          fontSize: 28,
          fill: strokeColor,
          fontFamily: 'system-ui, sans-serif',
          textAlign: isRtl ? 'right' : 'left',
          cornerColor: '#0ea5e9',
          borderColor: '#0ea5e9',
          editingBorderColor: '#0ea5e9',
          padding: 5
        });
        
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        text.selectAll();
        canvas.renderAll();
      },
      resetZoom: () => {
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        canvas.renderAll();
      }
    };
  }, [canvas, strokeColor, isRtl, setActiveTool, handleClearRef]);

  return (
    <div ref={containerRef} className="flex-1 w-full h-full relative overflow-hidden" style={{ minHeight: '80vh' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}