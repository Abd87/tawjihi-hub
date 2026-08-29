'use client';

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { MousePointer2, Pen, Eraser, Square, Circle, Triangle, Trash2 } from 'lucide-react';

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

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // We must ensure the container has height before initializing
    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      width: width,
      height: height,
      backgroundColor: '#ffffff'
    });

    setCanvas(fabricCanvas);

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
      canvas.freeDrawingBrush.color = strokeColor;
      canvas.freeDrawingBrush.width = strokeWidth;
    } else if (activeTool === 'erase') {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = '#ffffff';
      canvas.freeDrawingBrush.width = 30;
    } else {
      canvas.isDrawingMode = false;
    }
  }, [canvas, activeTool, strokeColor, strokeWidth]);

  // Expose shape addition to parent via window or ref
  useEffect(() => {
    if (!canvas) return;
    
    // We attach it to a ref passed from parent so parent can call it
    handleClearRef.current = {
      clear: () => {
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
      },
      addShape: (type: string) => {
        setActiveTool('select');
        let shape;
        const opts = { left: 100, top: 100, fill: 'transparent', stroke: strokeColor, strokeWidth: 3, cornerColor: '#0ea5e9', borderColor: '#0ea5e9' };
        
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
      }
    };
  }, [canvas, strokeColor, setActiveTool, handleClearRef]);

  return (
    <div ref={containerRef} className="flex-1 w-full h-full relative overflow-hidden" style={{ minHeight: '80vh' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}