'use client';

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import jsPDF from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

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
      backgroundColor: '#ffffff',
      preserveObjectStacking: true
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

  // Expose methods to parent
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
      addImage: (dataUrl: string) => {
        fabric.Image.fromURL(dataUrl, (img) => {
          setActiveTool('select');
          const center = canvas.getVpCenter();
          
          if (img.width && img.height) {
            const maxW = window.innerWidth * 0.8;
            const maxH = window.innerHeight * 0.8;
            let scale = 1;
            if (img.width > maxW) scale = maxW / img.width;
            if (img.height > maxH && maxH / img.height < scale) scale = maxH / img.height;
            img.scale(scale);
          }
          
          img.set({
            left: center.x - ((img.width || 0) * (img.scaleX || 1)) / 2,
            top: center.y - ((img.height || 0) * (img.scaleY || 1)) / 2,
            cornerColor: '#0ea5e9',
            borderColor: '#0ea5e9',
          });
          
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        });
      },
      addPDF: async (file: File) => {
        try {
          setActiveTool('select');
          
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          
          let currentTop = canvas.getVpCenter().y - (window.innerHeight / 2) + 50;
          
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.5 });
            
            const tempCanvas = document.createElement('canvas');
            const context = tempCanvas.getContext('2d');
            if (!context) continue;
            
            tempCanvas.height = viewport.height;
            tempCanvas.width = viewport.width;
            
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            
            const dataUrl = tempCanvas.toDataURL('image/png');
            
            await new Promise((resolve) => {
              fabric.Image.fromURL(dataUrl, (img) => {
                const center = canvas.getVpCenter();
                img.set({
                  left: center.x - ((img.width || 0) * (img.scaleX || 1)) / 2,
                  top: currentTop,
                  cornerColor: '#0ea5e9',
                  borderColor: '#0ea5e9',
                });
                
                canvas.add(img);
                currentTop += (img.height || 0) + 50;
                resolve(null);
              });
            });
          }
          canvas.renderAll();
        } catch (error) {
          console.error("PDF upload failed", error);
          alert(isRtl ? 'فشل تحميل الـ PDF!' : 'Failed to load PDF!');
        }
      },
      exportPDF: () => {
        const objects = canvas.getObjects();
        if (objects.length === 0) {
           alert(isRtl ? "اللوحة فارغة!" : "Canvas is empty!");
           return;
        }
        
        // Save current viewport
        const originalVpt = [...(canvas.viewportTransform || [1,0,0,1,0,0])];
        const originalWidth = canvas.getWidth();
        const originalHeight = canvas.getHeight();
        
        // Reset viewport so bounding boxes are absolute
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        canvas.renderAll();
        
        // Measure exact boundaries of all drawings
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        objects.forEach(obj => {
           const br = obj.getBoundingRect(true, true);
           if (br.left < minX) minX = br.left;
           if (br.top < minY) minY = br.top;
           if (br.left + br.width > maxX) maxX = br.left + br.width;
           if (br.top + br.height > maxY) maxY = br.top + br.height;
        });
        
        // Prevent infinite bugs if math fails
        if (minX === Infinity) {
          minX = 0; minY = 0; maxX = 800; maxY = 600;
        }

        const padding = 50;
        minX -= padding;
        minY -= padding;
        let width = maxX - minX + (padding * 2);
        let height = maxY - minY + (padding * 2);
        
        // Avoid 0 sizes
        if (width <= 0) width = 800;
        if (height <= 0) height = 600;
        
        // Resize canvas temporarily to frame the exact bounding box
        canvas.setViewportTransform([1, 0, 0, 1, -minX, -minY]);
        canvas.setWidth(width);
        canvas.setHeight(height);
        canvas.backgroundColor = '#ffffff';
        canvas.renderAll();
        
        // Capture image with high quality. 
        // Note: multiplier > 1 on a massive canvas can crash the browser, so we keep it at 1 for infinite boards.
        const maxDim = Math.max(width, height);
        const multiplier = maxDim > 3000 ? 1 : 2; 

        const dataUrl = canvas.toDataURL({ 
          format: 'jpeg', 
          quality: 0.85,
          multiplier: multiplier
        });
        
        // Restore user's view
        canvas.setViewportTransform(originalVpt);
        canvas.setWidth(originalWidth);
        canvas.setHeight(originalHeight);
        canvas.renderAll();
        
        // Generate PDF
        const doc = new jsPDF({
          orientation: width > height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [width, height]
        });
        
        doc.addImage(dataUrl, 'JPEG', 0, 0, width, height);
        doc.save('TawjihiHub-Whiteboard.pdf');
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