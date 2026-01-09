import { useState, useRef, useEffect, useCallback } from 'react'
import { fabric } from 'fabric'
import axios from 'axios'
import CanvasEditor from './components/CanvasEditor'
import ProcessButton from './components/ProcessButton'
import DownloadButton from './components/DownloadButton'
import BrushControls from './components/BrushControls'
import AutoDetectButton from './components/AutoDetectButton'
import DetectionResults from './components/DetectionResults'
import DetectionSettings from './components/DetectionSettings'
import HistoryControls from './components/HistoryControls'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import HowItWorks from './components/HowItWorks'
import WhyVanish from './components/WhyVanish'
import LiveDemo from './components/LiveDemo'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import { Button } from './components/ui/button'
import { useHistoryStore } from './store/historyStore'
import AuroraBackdrop from './components/AuroraBackdrop'
import { aurora } from './styles/aurora'

const API_URL = 'http://localhost:8000'

type DetectionRegion = {
  bbox: number[][]
  bbox_rect: number[]
  text: string
  confidence: number
}

type AxiosishError = {
  message?: string
  code?: string
  response?: {
    data?: unknown
    status?: number
  }
}

function App() {
  console.log('[App] Component rendering')
  
  const {
    image: historyImage,
    processedImage: historyProcessedImage,
    setImage: setHistoryImage,
    setProcessedImage: setHistoryProcessedImage,
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetHistory,
  } = useHistoryStore()

  const [image, setImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })
  const [brushSize, setBrushSize] = useState(20)
  const [detectedRegions, setDetectedRegions] = useState<DetectionRegion[]>([])
  const [autoMask, setAutoMask] = useState<string | null>(null)
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5)
  const [expandPixels, setExpandPixels] = useState(5)
  const [toolMode, setToolMode] = useState<'brush' | 'hand'>('brush')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasInitializingRef = useRef(false)
  const canvasImageRef = useRef<string | null>(null) // Track which image the canvas was created for

  // Log state changes
  useEffect(() => {
    console.log('[App] State update:', {
      hasImage: !!image,
      imageLength: image?.length || 0,
      hasProcessedImage: !!processedImage,
      hasCanvas: !!canvas,
      isProcessing,
      isDetecting,
      brushSize,
      toolMode,
      detectedRegionsCount: detectedRegions.length,
      hasAutoMask: !!autoMask,
      canvasRefExists: !!canvasRef.current,
      canvasInitializing: canvasInitializingRef.current,
      canvasImageRef: canvasImageRef.current?.substring(0, 30) || null,
    })
  }, [image, processedImage, canvas, isProcessing, isDetecting, brushSize, toolMode, detectedRegions.length, autoMask])

  // Component mount/unmount logging
  useEffect(() => {
    console.log('[App] Component mounted')
    return () => {
      console.log('[App] Component unmounting')
    }
  }, [])

  // Helper function to safely check if canvas is valid and render
  const safeRenderCanvas = useCallback((fabricCanvas: fabric.Canvas, context?: string) => {
    try {
      const canvasElement = fabricCanvas.getElement()
      if (!canvasElement || !canvasElement.parentNode) {
        console.log(`[Canvas] Canvas element not ready or disposed${context ? ` (${context})` : ''}, skipping render`)
        return false
      }
      
      const ctx = fabricCanvas.getContext()
      if (!ctx) {
        console.log(`[Canvas] Canvas context not available${context ? ` (${context})` : ''}, skipping render`)
        return false
      }
      
      fabricCanvas.renderAll()
      return true
    } catch (e) {
      console.error(`[Canvas] Error rendering canvas${context ? ` (${context})` : ''}:`, e)
      return false
    }
  }, [])

  // Sync with history store
  useEffect(() => {
    console.log('[App] History sync effect - historyImage:', historyImage?.substring(0, 30) || null, 'current image:', image?.substring(0, 30) || null)
    if (historyImage !== image) {
      // Prevent overwriting a non-null image with null (defensive fix)
      if (!historyImage && image) {
        console.log('[App] BLOCKED: History sync would overwrite non-null image with null, skipping')
        return
      }
      console.log('[App] Syncing historyImage to local image state')
      setImage(historyImage)
    }
  }, [historyImage, image])

  useEffect(() => {
    console.log('[App] History sync effect - historyProcessedImage:', historyProcessedImage?.substring(0, 30) || null, 'current processedImage:', processedImage?.substring(0, 30) || null)
    if (historyProcessedImage !== processedImage) {
      console.log('[App] Syncing historyProcessedImage to local processedImage state')
      setProcessedImage(historyProcessedImage)
    }
  }, [historyProcessedImage, processedImage])

  const handleUndo = useCallback(() => {
    console.log('[App] handleUndo called', { hasCanvas: !!canvas, hasHistoryImage: !!historyImage, canUndo: canUndo() })
    if (undo()) {
      console.log('[App] Undo successful, updating canvas')
      // History store will update, useEffect will sync
      if (canvas && historyImage) {
        const canvasElement = canvas.getElement()
        if (!canvasElement || !canvasElement.parentNode) {
          console.log('[Canvas] Canvas not ready for undo')
          return
        }
        console.log('[Canvas] Clearing canvas for undo')
        canvas.clear()
        fabric.Image.fromURL(historyImage, (img: fabric.Image) => {
          console.log('[Canvas] Undo image loaded', { width: img.width, height: img.height })
          const element = canvas.getElement()
          if (element && element.parentNode) {
            canvas.setBackgroundImage(img, () => {
              console.log('[Canvas] Undo background image set')
              safeRenderCanvas(canvas, 'undo-setBackgroundImage')
            })
            safeRenderCanvas(canvas, 'undo')
          } else {
            console.log('[Canvas] Canvas element invalid during undo image load')
          }
        })
      } else {
        console.log('[App] Cannot undo - missing canvas or historyImage')
      }
    } else {
      console.log('[App] Undo failed - cannot undo')
    }
  }, [undo, canvas, historyImage, safeRenderCanvas, canUndo])

  const handleRedo = useCallback(() => {
    console.log('[App] handleRedo called', { hasCanvas: !!canvas, hasHistoryImage: !!historyImage, canRedo: canRedo() })
    if (redo()) {
      console.log('[App] Redo successful, updating canvas')
      // History store will update, useEffect will sync
      if (canvas && historyImage) {
        const canvasElement = canvas.getElement()
        if (!canvasElement || !canvasElement.parentNode) {
          console.log('[Canvas] Canvas not ready for redo')
          return
        }
        console.log('[Canvas] Clearing canvas for redo')
        canvas.clear()
        fabric.Image.fromURL(historyImage, (img: fabric.Image) => {
          console.log('[Canvas] Redo image loaded', { width: img.width, height: img.height })
          const element = canvas.getElement()
          if (element && element.parentNode) {
            canvas.setBackgroundImage(img, () => {
              console.log('[Canvas] Redo background image set')
              safeRenderCanvas(canvas, 'redo-setBackgroundImage')
            })
            safeRenderCanvas(canvas, 'redo')
          } else {
            console.log('[Canvas] Canvas element invalid during redo image load')
          }
        })
      } else {
        console.log('[App] Cannot redo - missing canvas or historyImage')
      }
    } else {
      console.log('[App] Redo failed - cannot redo')
    }
  }, [redo, canvas, historyImage, safeRenderCanvas, canRedo])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    console.log('[App] Setting up keyboard shortcuts', { canUndo: canUndo(), canRedo: canRedo() })
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        console.log('[App] Undo keyboard shortcut pressed')
        e.preventDefault()
        if (canUndo()) {
          handleUndo()
        } else {
          console.log('[App] Undo shortcut pressed but cannot undo')
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        console.log('[App] Redo keyboard shortcut pressed')
        e.preventDefault()
        if (canRedo()) {
          handleRedo()
        } else {
          console.log('[App] Redo shortcut pressed but cannot redo')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      console.log('[App] Removing keyboard shortcuts')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [canUndo, canRedo, handleUndo, handleRedo])

  const setupZoomControls = (fabricCanvas: fabric.Canvas): (() => void) => {
    // Pinch to zoom for all devices (touch and trackpad)
    let lastTouchDistance = 0
    let touches: Touch[] = []
    let trackpadPinchStart = 0
    
    // Handle trackpad pinch zoom
    let wheelEventBuffer: Array<{deltaX: number, deltaY: number, time: number}> = []
    
    const wheelHandler = (opt: unknown) => {
      const e = (opt as { e: WheelEvent }).e
      
      const now = Date.now()
      
      // Track wheel events for pattern detection
      wheelEventBuffer.push({
        deltaX: Math.abs(e.deltaX || 0),
        deltaY: Math.abs(e.deltaY || 0),
        time: now
      })
      
      // Keep only recent events (last 200ms)
      wheelEventBuffer = wheelEventBuffer.filter(ev => now - ev.time < 200)
      
      // Explicit pinch gesture: ctrl/cmd + wheel (always zoom)
      const isExplicitPinch = e.ctrlKey || e.metaKey
      
      if (isExplicitPinch) {
        e.preventDefault()
        e.stopPropagation()
        
        // Trackpad pinch zoom
        const delta = e.deltaY
        const currentZoom = fabricCanvas.getZoom()
        
        // Calculate zoom change - use smaller increments for smoother zoom
        const zoomFactor = delta > 0 ? 0.95 : 1.05
        const newZoom = Math.max(0.1, Math.min(5, currentZoom * zoomFactor))
        
        // Get mouse position for zoom center
        const point = new fabric.Point(e.offsetX, e.offsetY)
        
        // Zoom to point
        fabricCanvas.zoomToPoint(point, newZoom)
        return
      }
      
      // Detect trackpad pinch without modifier: very small deltas with similar X/Y magnitudes
      // Pinch gestures typically have both deltaX and deltaY with similar small magnitudes
      // Scroll gestures typically have larger deltaY and smaller deltaX
      const absDeltaX = Math.abs(e.deltaX || 0)
      const absDeltaY = Math.abs(e.deltaY || 0)
      const maxDelta = Math.max(absDeltaX, absDeltaY)
      const minDelta = Math.min(absDeltaX, absDeltaY)
      
      // Pinch detection: very small deltas (< 10) with both X and Y present
      // AND the ratio between max/min is not too large (pinch has similar X/Y)
      const isPinchGesture = maxDelta < 10 && 
                             absDeltaX > 0 && 
                             absDeltaY > 0 &&
                             (minDelta / maxDelta) > 0.3 && // Both deltas are similar
                             wheelEventBuffer.length >= 2 // Multiple rapid events
      
      if (isPinchGesture) {
        e.preventDefault()
        e.stopPropagation()
        
        // Use combined delta for zoom
        const delta = e.deltaY || e.deltaX || 0
        const currentZoom = fabricCanvas.getZoom()
        
        // Calculate zoom change
        const zoomFactor = delta > 0 ? 0.95 : 1.05
        const newZoom = Math.max(0.1, Math.min(5, currentZoom * zoomFactor))
        
        // Get mouse position for zoom center
        const point = new fabric.Point(e.offsetX, e.offsetY)
        
        // Zoom to point
        fabricCanvas.zoomToPoint(point, newZoom)
        return
      }
      
      // Regular scroll - don't prevent default, allow scrolling
      // Don't zoom on regular scroll
    }
    fabricCanvas.on('mouse:wheel', wheelHandler)
    
    // Enhanced touch gesture handling for pinch zoom (works on all devices)
    const handleTouchStart = (e: TouchEvent) => {
      touches = Array.from(e.touches)
      if (touches.length === 2) {
        const touch1 = touches[0]
        const touch2 = touches[1]
        lastTouchDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
      }
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      touches = Array.from(e.touches)
      
      if (touches.length === 2) {
        e.preventDefault() // Prevent scrolling while pinching
        const touch1 = touches[0]
        const touch2 = touches[1]
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        )
        
        if (lastTouchDistance === 0) {
          lastTouchDistance = distance
          return
        }
        
        const scaleChange = distance / lastTouchDistance
        const currentZoom = fabricCanvas.getZoom()
        const newZoom = Math.max(0.1, Math.min(5, currentZoom * scaleChange))
        
        // Calculate center point between two touches
        const canvasElement = fabricCanvas.getElement()
        const rect = canvasElement.getBoundingClientRect()
        const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left
        const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top
        
        // Zoom to the center point
        const point = new fabric.Point(centerX, centerY)
        fabricCanvas.zoomToPoint(point, newZoom)
        
        lastTouchDistance = distance
      } else {
        lastTouchDistance = 0
      }
    }
    
    const handleTouchEnd = () => {
      touches = []
      lastTouchDistance = 0
    }
    
    // Attach native touch event listeners to canvas element
    const canvasElement = fabricCanvas.getElement()
    canvasElement.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvasElement.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvasElement.addEventListener('touchend', handleTouchEnd, { passive: false })
    canvasElement.addEventListener('touchcancel', handleTouchEnd, { passive: false })
    
    // Handle gesture events for trackpad (Safari/Chrome)
    const handleGestureStart = (e: unknown) => {
      const ge = e as { preventDefault: () => void }
      ge.preventDefault()
      trackpadPinchStart = fabricCanvas.getZoom()
    }
    
    const handleGestureChange = (e: unknown) => {
      const ge = e as { preventDefault: () => void; scale?: number; clientX?: number; clientY?: number }
      ge.preventDefault()
      if (ge.scale !== undefined && ge.scale !== 1 && ge.clientX !== undefined && ge.clientY !== undefined) {
        const newZoom = Math.max(0.1, Math.min(5, trackpadPinchStart * ge.scale))
        const rect = canvasElement.getBoundingClientRect()
        const centerX = ge.clientX - rect.left
        const centerY = ge.clientY - rect.top
        const point = new fabric.Point(centerX, centerY)
        fabricCanvas.zoomToPoint(point, newZoom)
      }
    }
    
    const handleGestureEnd = (e: unknown) => {
      const ge = e as { preventDefault: () => void }
      ge.preventDefault()
      trackpadPinchStart = 0
    }
    
    // Add gesture event listeners for trackpad support
    canvasElement.addEventListener('gesturestart', handleGestureStart)
    canvasElement.addEventListener('gesturechange', handleGestureChange)
    canvasElement.addEventListener('gestureend', handleGestureEnd)
    
    // Cleanup function
    return () => {
      fabricCanvas.off('mouse:wheel', wheelHandler)
      canvasElement.removeEventListener('touchstart', handleTouchStart)
      canvasElement.removeEventListener('touchmove', handleTouchMove)
      canvasElement.removeEventListener('touchend', handleTouchEnd)
      canvasElement.removeEventListener('touchcancel', handleTouchEnd)
      canvasElement.removeEventListener('gesturestart', handleGestureStart)
      canvasElement.removeEventListener('gesturechange', handleGestureChange)
      canvasElement.removeEventListener('gestureend', handleGestureEnd)
    }
  }

  useEffect(() => {
    console.log('[Canvas] Effect running', {
      hasCanvasRef: !!canvasRef.current,
      hasImage: !!image,
      imageLength: image?.length || 0,
      hasCanvas: !!canvas,
      canvasImageRef: canvasImageRef.current?.substring(0, 30) || null,
      isInitializing: canvasInitializingRef.current,
      imagesMatch: canvasImageRef.current === image,
    })
    
    // Only create canvas when we have both ref and image
    if (!canvasRef.current || !image) {
      console.log('[Canvas] Missing ref or image', { 
        hasRef: !!canvasRef.current, 
        hasImage: !!image,
        hasCanvas: !!canvas,
      })
      // If we have a canvas but no image/ref, dispose it
      if (canvas) {
        console.log('[Canvas] No image or ref, disposing existing canvas')
        try {
          const canvasElement = canvas.getElement()
          if (canvasElement && canvasElement.parentNode) {
            canvas.dispose()
            console.log('[Canvas] Canvas disposed successfully')
          } else {
            console.log('[Canvas] Canvas element already removed')
          }
        } catch (e) {
          console.error('[Canvas] Error disposing canvas:', e)
        }
        setCanvas(null)
        canvasImageRef.current = null
      }
      return
    }

    // Check if we already have a canvas for this image
    if (canvas && canvasImageRef.current === image) {
      console.log('[Canvas] Canvas already exists for this image, skipping initialization', {
        canvasImageRef: canvasImageRef.current?.substring(0, 30),
        currentImage: image.substring(0, 30),
      })
      return
    }

    // Prevent multiple initializations
    if (canvasInitializingRef.current) {
      console.log('[Canvas] Already initializing, skipping duplicate initialization')
      return
    }

    console.log('[Canvas] Starting initialization', {
      imageLength: image.length,
      imagePreview: image.substring(0, 50),
      canvasRefExists: !!canvasRef.current,
    })
    canvasInitializingRef.current = true
    canvasImageRef.current = image // Store which image we're creating canvas for
    console.log('[Canvas] Set initialization flags', {
      canvasImageRef: canvasImageRef.current?.substring(0, 30),
    })
    
    // Create canvas with viewport size - ensure it fits within container
    const maxViewportWidth = 1000
    const maxViewportHeight = 800
    
    // Dispose previous canvas if it exists
    if (canvas) {
      console.log('[Canvas] Disposing previous canvas before creating new one')
      try {
        const canvasElement = canvas.getElement()
        if (canvasElement && canvasElement.parentNode) {
          canvas.dispose()
        }
      } catch (e) {
        console.error('[Canvas] Error disposing previous canvas:', e)
      }
    }
    
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: maxViewportWidth,
      height: maxViewportHeight,
    })
    
    console.log('[Canvas] Fabric canvas created', { element: fabricCanvas.getElement() })

    let isDisposed = false
    let cleanupZoom: (() => void) | null = null

    // Load image onto canvas
    fabric.Image.fromURL(image, (img: fabric.Image) => {
      // Check if canvas was disposed while image was loading
      if (isDisposed) {
        console.log('[Canvas] Canvas was disposed while image was loading, aborting')
        return
      }
      
      // Check if canvas element still exists (not disposed)
      const canvasElement = fabricCanvas.getElement()
      if (!canvasElement || !canvasElement.parentNode) {
        console.log('[Canvas] Canvas element disposed before image loaded, aborting')
        return
      }
      
      console.log('[Canvas] Image loaded, setting up canvas', { 
        width: img.width, 
        height: img.height,
        isDisposed,
        elementExists: !!canvasElement,
        elementInDOM: !!canvasElement?.parentNode,
      })
      
      // Store original dimensions
      const origWidth = img.width!
      const origHeight = img.height!
      console.log('[Canvas] Setting original dimensions', { width: origWidth, height: origHeight })
      setOriginalDimensions({ width: origWidth, height: origHeight })
      
      // Calculate scale to fit image exactly inside viewport (centered)
      const scaleX = maxViewportWidth / origWidth
      const scaleY = maxViewportHeight / origHeight
      const scale = Math.min(scaleX, scaleY)
      console.log('[Canvas] Calculated scale', { scaleX, scaleY, scale, maxViewportWidth, maxViewportHeight })
      
      // Set canvas to viewport size
      fabricCanvas.setWidth(maxViewportWidth)
      fabricCanvas.setHeight(maxViewportHeight)
      console.log('[Canvas] Canvas size set', { width: maxViewportWidth, height: maxViewportHeight })
      
      // Calculate centered position for scaled image
      const scaledWidth = origWidth * scale
      const scaledHeight = origHeight * scale
      const left = (maxViewportWidth - scaledWidth) / 2
      const top = (maxViewportHeight - scaledHeight) / 2
      
      const centeredLeft = Math.round(left)
      const centeredTop = Math.round(top)
      console.log('[Canvas] Calculated centered position', { 
        scaledWidth, 
        scaledHeight, 
        left, 
        top, 
        centeredLeft, 
        centeredTop,
      })
      
      // Set image as background
      img.set({
        scaleX: scale,
        scaleY: scale,
        left: centeredLeft,
        top: centeredTop,
        originX: 'left',
        originY: 'top',
      })
      
      fabricCanvas.setBackgroundImage(img, () => {
        if (isDisposed) return
        const element = fabricCanvas.getElement()
        if (element && element.parentNode) {
          try {
            fabricCanvas.renderAll()
          } catch (e) {
            console.error('[Canvas] Error rendering in setBackgroundImage callback:', e)
          }
        }
      }, {
        scaleX: scale,
        scaleY: scale,
        left: centeredLeft,
        top: centeredTop,
      })
      
      // Set initial zoom
      fabricCanvas.setZoom(1)
      fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0])
      
      // Final render
      const element = fabricCanvas.getElement()
      if (element && element.parentNode && !isDisposed) {
        try {
          fabricCanvas.renderAll()
          console.log('[Canvas] Canvas initialized and rendered successfully')
        } catch (e) {
          console.error('[Canvas] Error in final renderAll:', e)
        }
      }
      
      // Setup zoom controls
      console.log('[Canvas] Setting up zoom controls')
      cleanupZoom = setupZoomControls(fabricCanvas)
      console.log('[Canvas] Zoom controls setup complete')
      
      // Set canvas state if still valid
      const finalElement = fabricCanvas.getElement()
      const finalElementInDOM = finalElement?.parentNode
      console.log('[Canvas] Checking if canvas is valid for state setting', {
        isDisposed,
        hasElement: !!finalElement,
        elementInDOM: !!finalElementInDOM,
        element: finalElement,
      })
      
      if (!isDisposed && finalElement && finalElementInDOM) {
        // Reset initialization flag before setting state to allow future updates
        console.log('[Canvas] Canvas is valid, setting state')
        canvasInitializingRef.current = false
        console.log('[Canvas] Calling setCanvas with fabricCanvas')
        setCanvas(fabricCanvas)
        console.log('[Canvas] Canvas state set successfully', {
          canvasSet: true,
          canvasImageRef: canvasImageRef.current?.substring(0, 30),
        })
      } else {
        console.log('[Canvas] Canvas element invalid, not setting state', {
          isDisposed,
          hasElement: !!finalElement,
          elementInDOM: !!finalElementInDOM,
        })
        canvasInitializingRef.current = false
        // Dispose the invalid canvas
        try {
          fabricCanvas.dispose()
          console.log('[Canvas] Disposed invalid canvas')
        } catch (e) {
          console.error('[Canvas] Error disposing invalid canvas:', e)
        }
      }
    })
    
    console.log('[Canvas] Image.fromURL called, waiting for image to load')

    // Configure brush (width will be updated in separate effect when canvas is set)
    fabricCanvas.freeDrawingBrush.color = 'rgba(255, 0, 0, 0.8)'
    fabricCanvas.freeDrawingBrush.width = brushSize
    fabricCanvas.isDrawingMode = toolMode === 'brush'
    fabricCanvas.allowTouchScrolling = true
    fabricCanvas.defaultCursor = toolMode === 'brush' ? 'crosshair' : 'move'

    // Cleanup function
    return () => {
      const imageForThisCanvas = canvasImageRef.current
      const currentImage = image
      console.log('[Canvas] ========== CLEANUP FUNCTION CALLED ==========')
      console.log('[Canvas] Cleanup context:', {
        canvasImageRef: imageForThisCanvas?.substring(0, 30) || null,
        currentImage: currentImage?.substring(0, 30) || null,
        imagesMatch: imageForThisCanvas === currentImage,
        isDisposed,
        hasCleanupZoom: !!cleanupZoom,
        fabricCanvasElement: fabricCanvas.getElement(),
        fabricCanvasElementInDOM: !!fabricCanvas.getElement()?.parentNode,
      })
      
      // Only dispose if the image actually changed (not just a re-render or React StrictMode)
      // If the canvas was created for a different image, we need to dispose it
      if (imageForThisCanvas && imageForThisCanvas === currentImage) {
        // Image hasn't changed, this is likely React StrictMode or a re-render
        // Don't dispose the canvas, just mark as not initializing
        console.log('[Canvas] ✓ Image unchanged, skipping cleanup (likely React StrictMode or re-render)')
        isDisposed = true
        canvasInitializingRef.current = false
        console.log('[Canvas] Cleanup complete (skipped disposal)')
        return
      }
      
      // Image changed or component unmounting - dispose the canvas
      console.log('[Canvas] ✗ Image changed or unmounting, disposing canvas')
      isDisposed = true
      canvasInitializingRef.current = false
      
      if (cleanupZoom) {
        console.log('[Canvas] Cleaning up zoom controls')
        try {
          cleanupZoom()
          console.log('[Canvas] Zoom controls cleaned up')
        } catch (e) {
          console.error('[Canvas] Error in cleanupZoom:', e)
        }
      } else {
        console.log('[Canvas] No zoom controls to clean up')
      }
      
      try {
        const canvasElement = fabricCanvas.getElement()
        console.log('[Canvas] Attempting to dispose canvas', {
          hasElement: !!canvasElement,
          elementInDOM: !!canvasElement?.parentNode,
        })
        if (canvasElement && canvasElement.parentNode) {
          fabricCanvas.dispose()
          console.log('[Canvas] ✓ Canvas disposed successfully')
        } else {
          console.log('[Canvas] Canvas element already removed, skipping dispose')
        }
      } catch (e) {
        console.error('[Canvas] ✗ Error disposing canvas in cleanup:', e)
        console.error('[Canvas] Error details:', {
          message: (e as { message?: string })?.message,
          stack: (e as { stack?: string })?.stack,
        })
      }
      
      // Only clear state if this canvas is the current one
      console.log('[Canvas] Updating canvas state in cleanup')
      setCanvas((prevCanvas) => {
        const isCurrentCanvas = prevCanvas === fabricCanvas
        console.log('[Canvas] State update callback', {
          isCurrentCanvas,
          hasPrevCanvas: !!prevCanvas,
          prevCanvasMatches: prevCanvas === fabricCanvas,
        })
        if (isCurrentCanvas) {
          console.log('[Canvas] ✓ Clearing canvas state in cleanup')
          canvasImageRef.current = null
          return null
        }
        console.log('[Canvas] Not clearing state (different canvas)')
        return prevCanvas
      })
      console.log('[Canvas] ========== CLEANUP FUNCTION COMPLETE ==========')
    }
  }, [image]) // Only recreate canvas when image changes
  
  // Update brush size and tool mode when they change
  useEffect(() => {
    console.log('[App] Brush/tool effect running', { hasCanvas: !!canvas, brushSize, toolMode })
    if (canvas) {
      // Check if canvas element exists and is not disposed
      const canvasElement = canvas.getElement()
      if (!canvasElement || !canvasElement.parentNode) {
        console.log('[Canvas] Canvas element not ready or disposed, skipping render')
        return
      }
      
      // Check if canvas context is valid
      try {
        const ctx = canvas.getContext()
        if (!ctx) {
          console.log('[Canvas] Canvas context not available, skipping render')
          return
        }
      } catch (e) {
        console.log('[Canvas] Error getting canvas context:', e)
        return
      }
      
      console.log('[Canvas] Updating brush size and tool mode', { 
        brushSize, 
        toolMode,
        previousBrushWidth: canvas.freeDrawingBrush.width,
        previousIsDrawingMode: canvas.isDrawingMode,
      })
      canvas.freeDrawingBrush.width = brushSize
      canvas.isDrawingMode = toolMode === 'brush'
      canvas.defaultCursor = toolMode === 'brush' ? 'crosshair' : 'grab'
      canvas.selection = toolMode === 'hand' ? false : true
      console.log('[Canvas] Brush/tool updated', {
        newBrushWidth: canvas.freeDrawingBrush.width,
        newIsDrawingMode: canvas.isDrawingMode,
        newCursor: canvas.defaultCursor,
        newSelection: canvas.selection,
      })
      
      // Remove existing pan handlers
      canvas.off('mouse:down')
      canvas.off('mouse:move')
      canvas.off('mouse:up')
      
      if (toolMode === 'hand') {
        // Enable panning in hand mode
        let isDragging = false
        let lastPosX = 0
        let lastPosY = 0
        
        canvas.on('mouse:down', (opt) => {
          const evt = opt.e
          isDragging = true
          canvas.selection = false
          lastPosX = evt.clientX
          lastPosY = evt.clientY
          canvas.defaultCursor = 'grabbing'
        })
        
        canvas.on('mouse:move', (opt) => {
          if (isDragging) {
            const e = opt.e
            const vpt = canvas.viewportTransform!
            vpt[4] += e.clientX - lastPosX
            vpt[5] += e.clientY - lastPosY
            canvas.requestRenderAll()
            lastPosX = e.clientX
            lastPosY = e.clientY
          }
        })
        
        canvas.on('mouse:up', () => {
          canvas.setViewportTransform(canvas.viewportTransform!)
          isDragging = false
          canvas.defaultCursor = 'grab'
        })
      }
      
      safeRenderCanvas(canvas, 'brush-tool-update')
    }
  }, [brushSize, toolMode, canvas])

  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (file: File) => {
    console.log('[Upload] handleImageUpload called', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileSizeMB: (file.size / (1024 * 1024)).toFixed(2),
    })
    
    // Validate file size (50MB limit)
    const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
    if (file.size > MAX_FILE_SIZE) {
      console.error('[Upload] File too large', { fileSize: file.size, maxSize: MAX_FILE_SIZE })
      alert(`File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('[Upload] Invalid file type', { fileType: file.type })
      alert('Please upload a valid image file')
      return
    }

    console.log('[Upload] File validation passed, starting upload')
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      console.log('[Upload] Sending POST request to', `${API_URL}/api/upload`)
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        // Don't set Content-Type header - let axios set it automatically with boundary
        timeout: 60000, // 60 second timeout
        maxContentLength: 100 * 1024 * 1024, // 100MB max response size
        maxBodyLength: 100 * 1024 * 1024, // 100MB max request size
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            console.log(`[Upload] Upload progress: ${percentCompleted}%`, {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
            })
          }
        },
      })
      console.log('[Upload] Upload successful', {
        responseStatus: response.status,
        hasImage: !!response.data.image,
        imageLength: response.data.image?.length || 0,
      })
      
      const newImage = response.data.image
      console.log('[Upload] Resetting history FIRST (before setting image)')
      resetHistory()
      console.log('[Upload] Setting image state', { imageLength: newImage?.length || 0 })
      setImage(newImage)
      console.log('[Upload] Setting history image')
      setHistoryImage(newImage)
      console.log('[Upload] Clearing processed image')
      setProcessedImage(null)
      setHistoryProcessedImage(null)
      console.log('[Upload] Clearing detected regions and auto mask')
      setDetectedRegions([])
      setAutoMask(null)
      console.log('[Upload] Saving state')
      saveState()
      console.log('[Upload] Upload complete, image should trigger canvas initialization')
    } catch (error: unknown) {
      const err = error as AxiosishError
      console.error('[Upload] Upload error occurred:', error)
      console.error('[Upload] Error details:', {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status,
        responseData: err.response?.data,
      })
      
      if (err.code === 'ECONNABORTED') {
        console.error('[Upload] Upload timeout')
        alert('Upload timeout. Please try again with a smaller image.')
      } else if (err.response?.status === 400) {
        const data = err.response?.data as { detail?: string; message?: string } | undefined
        const errorMsg = data?.detail || data?.message || 'Invalid file. Please upload a valid image.'
        console.error('[Upload] Bad request (400)', { errorMsg, data })
        alert(errorMsg)
      } else if (err.response?.status === 500) {
        const data = err.response?.data as { detail?: string } | undefined
        const errorMsg = data?.detail || 'Server error. Please try again.'
        console.error('[Upload] Server error (500)', { errorMsg, data })
        alert(`Upload failed: ${errorMsg}`)
      } else if (err.message) {
        console.error('[Upload] Error with message', { message: err.message })
        alert(`Upload failed: ${err.message}`)
      } else {
        console.error('[Upload] Unknown error')
        alert('Failed to upload image. Please check the console for details and try again.')
      }
    } finally {
      console.log('[Upload] Upload process finished, setting isUploading to false')
      setIsUploading(false)
    }
  }

  const getMaskFromCanvas = (): string | null => {
    console.log('[Mask] getMaskFromCanvas called', { hasCanvas: !!canvas, hasImage: !!image, originalDimensions })
    
    if (!canvas || !image) {
      console.log('[Mask] Cannot get mask - missing canvas or image')
      return null
    }
    
    // Create mask from manual drawing
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = originalDimensions.width
    tempCanvas.height = originalDimensions.height
    console.log('[Mask] Created temp canvas', { width: tempCanvas.width, height: tempCanvas.height })
    
    const tempFabricCanvas = new fabric.Canvas(tempCanvas)
    tempFabricCanvas.setWidth(originalDimensions.width)
    tempFabricCanvas.setHeight(originalDimensions.height)
    
    // Get canvas transform info
    const bgImage = canvas.backgroundImage as fabric.Image
    const canvasScale = bgImage?.scaleX || 1
    const canvasLeft = bgImage?.left || 0
    const canvasTop = bgImage?.top || 0
    console.log('[Mask] Canvas transform info', { canvasScale, canvasLeft, canvasTop })
    
    // Copy only path objects (drawings) to temp canvas
    const objects = canvas.getObjects()
    const paths = objects.filter((obj: fabric.Object) => obj.type === 'path')
    console.log('[Mask] Found paths', { totalObjects: objects.length, pathCount: paths.length })
    
    if (paths.length === 0) {
      console.log('[Mask] No paths found, returning null')
      return null
    }
    
    paths.forEach((path: fabric.Object, index: number) => {
      const pathObj = fabric.util.object.clone(path)
      // Transform coordinates from canvas space to original image space
      const pathData = (pathObj as { path?: Array<(string | number)[]> }).path
      if (pathData) {
        pathData.forEach((point) => {
          if ((point[0] === 'M' || point[0] === 'L' || point[0] === 'C') && typeof point[1] === 'number' && typeof point[2] === 'number') {
            point[1] = (point[1] - canvasLeft) / canvasScale
            point[2] = (point[2] - canvasTop) / canvasScale
          }
        })
      }
      tempFabricCanvas.add(pathObj)
      console.log(`[Mask] Added path ${index + 1}/${paths.length}`)
    })
    
    tempFabricCanvas.renderAll()
    const maskDataUrl = tempCanvas.toDataURL('image/png')
    console.log('[Mask] Mask generated', { dataUrlLength: maskDataUrl.length })
    return maskDataUrl
  }

  const handleAutoDetect = async () => {
    console.log('[AutoDetect] handleAutoDetect called', { hasImage: !!image, hasCanvas: !!canvas, confidenceThreshold, expandPixels })
    
    if (!image || !canvas) {
      console.log('[AutoDetect] Cannot detect - missing image or canvas')
      return
    }

    // Get selected area mask from canvas
    const selectedMask = getMaskFromCanvas()
    
    if (!selectedMask) {
      console.log('[AutoDetect] No mask found, user needs to draw first')
      alert('Please draw on the image to select an area for detection first.')
      return
    }

    console.log('[AutoDetect] Starting detection', { maskLength: selectedMask.length })
    setIsDetecting(true)
    try {
      console.log('[AutoDetect] Sending POST request to', `${API_URL}/api/detect-text`)
      const response = await axios.post(`${API_URL}/api/detect-text`, {
        image_base64: image,
        mask_base64: selectedMask, // Only detect in selected area
        confidence_threshold: confidenceThreshold,
        expand_pixels: expandPixels,
      })

      console.log('[AutoDetect] Detection response received', {
        success: response.data.success,
        regionsCount: response.data.text_regions?.length || 0,
        hasMask: !!response.data.mask,
      })

      if (response.data.success) {
        const regions = response.data.text_regions || []
        console.log('[AutoDetect] Setting detected regions', { count: regions.length })
        setDetectedRegions(regions)
        console.log('[AutoDetect] Setting auto mask', { hasMask: !!response.data.mask })
        setAutoMask(response.data.mask)
        
        // Load auto-detected mask onto canvas
        if (canvas && response.data.mask) {
          console.log('[AutoDetect] Loading mask image onto canvas')
          // Keep existing drawings and add detected mask
          fabric.Image.fromURL(response.data.mask, (maskImg: fabric.Image) => {
            console.log('[AutoDetect] Mask image loaded', { width: maskImg.width, height: maskImg.height })
            maskImg.set({
              left: 0,
              top: 0,
              opacity: 0.5,
              selectable: false,
              evented: false,
            })
            canvas.add(maskImg)
            console.log('[AutoDetect] Mask added to canvas, rendering')
            safeRenderCanvas(canvas, 'auto-detect-mask')
          })
        }
      } else {
        console.log('[AutoDetect] Detection was not successful')
      }
    } catch (error) {
      console.error('[AutoDetect] Detection error:', error)
      console.error('[AutoDetect] Error details:', {
        message: (error as { message?: string })?.message,
        response: (error as { response?: { status?: number; data?: unknown } })?.response,
      })
      alert('Text detection failed. You can still draw manually.')
    } finally {
      console.log('[AutoDetect] Detection process finished, setting isDetecting to false')
      setIsDetecting(false)
    }
  }

  const handleProcess = async () => {
    console.log('[Process] handleProcess called', { 
      hasCanvas: !!canvas, 
      hasImage: !!image,
      hasAutoMask: !!autoMask,
      originalDimensions,
    })
    
    if (!canvas || !image) {
      console.log('[Process] Cannot process - missing canvas or image')
      return
    }

    console.log('[Process] Starting processing')
    setIsProcessing(true)
    
    const processWithMask = async (maskDataUrl: string) => {
      console.log('[Process] processWithMask called', { maskLength: maskDataUrl.length })
      try {
        console.log('[Process] Sending POST request to', `${API_URL}/api/process`)
        const response = await axios.post(`${API_URL}/api/process`, {
          image_base64: image,
          mask_base64: maskDataUrl,
        })

        console.log('[Process] Processing response received', {
          status: response.status,
          hasImage: !!response.data.image,
          imageLength: response.data.image?.length || 0,
        })

        const resultImage = response.data.image
        console.log('[Process] Setting processed image')
        setProcessedImage(resultImage)
        console.log('[Process] Setting history processed image')
        setHistoryProcessedImage(resultImage)
        console.log('[Process] Saving state')
        saveState()
        console.log('[Process] Processing complete')
      } catch (error) {
        console.error('[Process] Processing error:', error)
        console.error('[Process] Error details:', {
          message: (error as { message?: string })?.message,
          response: (error as { response?: { status?: number; data?: unknown } })?.response,
        })
        alert('Failed to process image')
      } finally {
        console.log('[Process] Processing finished, setting isProcessing to false')
        setIsProcessing(false)
      }
    }
    
    try {
      // Check if we have auto-detected mask
      if (autoMask) {
        console.log('[Process] Using auto-detected mask')
        // Use auto-detected mask directly
        await processWithMask(autoMask)
        return
      }
      
      console.log('[Process] No auto mask, creating mask from manual drawing')
      
      // Create mask from manual drawing
      // Use original dimensions for mask, not canvas viewport size
      console.log('[Process] Creating temp canvas for mask', { width: originalDimensions.width, height: originalDimensions.height })
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = originalDimensions.width
      tempCanvas.height = originalDimensions.height
      
      // Clone canvas to get only the drawing paths
      const tempFabricCanvas = new fabric.Canvas(tempCanvas)
      tempFabricCanvas.setWidth(originalDimensions.width)
      tempFabricCanvas.setHeight(originalDimensions.height)
      
      // Get canvas transform info
      const bgImage = canvas.backgroundImage as fabric.Image
      const canvasScale = bgImage?.scaleX || 1
      const canvasLeft = bgImage?.left || 0
      const canvasTop = bgImage?.top || 0
      console.log('[Process] Canvas transform info', { canvasScale, canvasLeft, canvasTop })
      
      // Copy only path objects (drawings) to temp canvas
      const objects = canvas.getObjects()
      const paths = objects.filter((obj: fabric.Object) => obj.type === 'path')
      console.log('[Process] Found paths', { totalObjects: objects.length, pathCount: paths.length })
      
      if (paths.length === 0) {
        console.log('[Process] No paths found, cannot process')
        alert('Please draw on the image or use auto-detect to mark areas for removal')
        setIsProcessing(false)
        return
      }
    
      console.log('[Process] Transforming and adding paths to temp canvas')
      paths.forEach((path: fabric.Object, index: number) => {
        const pathObj = fabric.util.object.clone(path)
        
        // Transform path coordinates from canvas viewport to original image coordinates
        if (pathObj.left !== undefined && pathObj.top !== undefined) {
          const oldLeft = pathObj.left
          const oldTop = pathObj.top
          // Adjust for canvas offset and scale
          pathObj.left = ((pathObj.left - canvasLeft) / canvasScale)
          pathObj.top = ((pathObj.top - canvasTop) / canvasScale)
          
          // Scale path itself
          if (pathObj.scaleX !== undefined) {
            pathObj.scaleX = (pathObj.scaleX || 1) / canvasScale
          }
          if (pathObj.scaleY !== undefined) {
            pathObj.scaleY = (pathObj.scaleY || 1) / canvasScale
          }
          console.log(`[Process] Transformed path ${index + 1}`, { oldLeft, oldTop, newLeft: pathObj.left, newTop: pathObj.top })
        }
        
        tempFabricCanvas.add(pathObj)
      })
        
      console.log('[Process] Rendering temp canvas')
      tempFabricCanvas.renderAll()
        
      // Get mask data from temp canvas
      const maskDataUrl = tempCanvas.toDataURL('image/png')
      console.log('[Process] Initial mask data URL created', { length: maskDataUrl.length })
      
      // Create proper mask: convert red drawings to black on white background
      console.log('[Process] Creating final mask canvas')
      const maskCanvas = document.createElement('canvas')
      maskCanvas.width = originalDimensions.width
      maskCanvas.height = originalDimensions.height
      const maskCtx = maskCanvas.getContext('2d')!
      
      // Fill with white (areas to keep)
      maskCtx.fillStyle = 'white'
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)
      
      // Draw mask image scaled to original dimensions
      const maskImg = new Image()
      maskImg.onload = async () => {
        console.log('[Process] Mask image loaded, drawing and converting')
        // Draw mask image
        maskCtx.drawImage(maskImg, 0, 0, maskCanvas.width, maskCanvas.height)
        
        // Convert red areas to black (mask areas)
        const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
        console.log('[Process] Processing image data', { width: imageData.width, height: imageData.height, dataLength: imageData.data.length })
        const data = imageData.data
        
        let redPixelCount = 0
        let whitePixelCount = 0
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          
          // If pixel is red (drawn area), make it black
          // Otherwise make it white
          if (r > 200 && g < 100 && b < 100) {
            data[i] = 0     // R
            data[i + 1] = 0 // G
            data[i + 2] = 0 // B
            data[i + 3] = 255 // A
            redPixelCount++
          } else {
            data[i] = 255     // R
            data[i + 1] = 255 // G
            data[i + 2] = 255 // B
            data[i + 3] = 255 // A
            whitePixelCount++
          }
        }
        
        console.log('[Process] Pixel conversion complete', { redPixels: redPixelCount, whitePixels: whitePixelCount })
        maskCtx.putImageData(imageData, 0, 0)
        const finalMaskDataUrl = maskCanvas.toDataURL('image/png')
        console.log('[Process] Final mask created', { length: finalMaskDataUrl.length })
        
        // Process image
        console.log('[Process] Calling processWithMask with final mask')
        await processWithMask(finalMaskDataUrl)
        
        // Cleanup
        console.log('[Process] Cleaning up temp canvas')
        tempFabricCanvas.dispose()
      }
      
      maskImg.onerror = (error) => {
        console.error('[Process] Error loading mask image:', error)
        setIsProcessing(false)
      }
      
      console.log('[Process] Setting mask image source')
      maskImg.src = maskDataUrl
    } catch (error) {
      console.error('[Process] Processing error in try block:', error)
      console.error('[Process] Error details:', {
        message: (error as { message?: string })?.message,
        stack: (error as { stack?: string })?.stack,
      })
      alert('Failed to process image')
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    console.log('[Download] handleDownload called', { hasProcessedImage: !!processedImage })
    if (!processedImage) {
      console.log('[Download] No processed image to download')
      return
    }

    console.log('[Download] Creating download link')
    const link = document.createElement('a')
    link.href = processedImage
    link.download = 'vanish-ai-result.png'
    document.body.appendChild(link)
    console.log('[Download] Triggering download')
    link.click()
    document.body.removeChild(link)
    console.log('[Download] Download triggered')
  }

  const scrollToDemo = () => {
    console.log('[App] scrollToDemo called')
    const demoSection = document.getElementById('live-demo')
    if (demoSection) {
      console.log('[App] Scrolling to demo section')
      demoSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      console.log('[App] Demo section not found')
    }
  }

  const handleStartClick = () => {
    console.log('[App] handleStartClick called')
    const demoSection = document.getElementById('live-demo')
    if (demoSection) {
      console.log('[App] Scrolling to demo section')
      demoSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      console.log('[App] Demo section not found')
    }
  }

  return (
    <div className={aurora.page}>
      <AuroraBackdrop />
      <div className="relative z-10 w-full overflow-x-hidden">
      <Header showEditorActions={!!image} onExport={handleDownload} />
      
      {!image ? (
        <>
          {/* Landing Page */}
          <HeroSection onTryClick={scrollToDemo} />
          <HowItWorks />
          <WhyVanish />
          <div id="live-demo">
            <LiveDemo
              onUpload={handleImageUpload}
              image={image}
              processedImage={processedImage}
              onProcess={handleProcess}
              isProcessing={isProcessing}
              isUploading={isUploading}
            />
          </div>
          <CTASection onStartClick={handleStartClick} />
          <Footer />
        </>
      ) : (
        <>
          {/* Editor View */}
          <div className="w-full min-h-[calc(100vh-64px)] py-8">
            <div className={aurora.container}>
              <div className="grid md:grid-cols-[220px_1fr] gap-6 items-start w-full">
              {/* Tools Sidebar */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-white/12 bg-white/7 backdrop-blur-xl ring-1 ring-white/8 p-4">
                  <h3 className="text-white/92 font-semibold mb-4 tracking-[0.10em] text-xs">TOOLS</h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        toolMode === 'brush' ? 'bg-white/12 text-white/92 ring-1 ring-white/16' : ''
                      }`}
                      title="Brush Tool"
                      onClick={() => {
                        console.log('[App] Tool mode changed to brush', { previousMode: toolMode })
                        setToolMode('brush')
                      }}
                    >
                      🖊 Brush
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${
                        toolMode === 'hand' ? 'bg-white/12 text-white/92 ring-1 ring-white/16' : ''
                      }`}
                      title="Hand Tool - Drag/Pan"
                      onClick={() => {
                        console.log('[App] Tool mode changed to hand', { previousMode: toolMode })
                        setToolMode('hand')
                      }}
                    >
                      ✋ Hand
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-between disabled:opacity-50"
                      title="Rectangle Select"
                      disabled
                    >
                      <span>▢ Rectangle</span>
                      <span className="text-xs text-white/52">Coming Soon</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-between disabled:opacity-50"
                      title="Lasso Tool"
                      disabled
                    >
                      <span>✂ Lasso</span>
                      <span className="text-xs text-white/52">Coming Soon</span>
                    </Button>
                    <HistoryControls />
                  </div>
                </div>
                
                <DetectionSettings
                  confidenceThreshold={confidenceThreshold}
                  expandPixels={expandPixels}
                  onConfidenceChange={setConfidenceThreshold}
                  onExpandChange={setExpandPixels}
                />
                
                <BrushControls brushSize={brushSize} onBrushSizeChange={setBrushSize} />
              </div>

              {/* Main Canvas Area */}
              <div className="space-y-6 flex flex-col min-w-0 w-full">
                <div className="rounded-2xl border border-white/12 bg-white/7 backdrop-blur-xl ring-1 ring-white/8 p-6 w-full min-w-0">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white/92">Select. Vanish.</h2>
                    <div className="flex gap-2 items-center">
                      <AutoDetectButton
                        onDetect={handleAutoDetect}
                        isDetecting={isDetecting}
                        disabled={isProcessing}
                      />
                      <Button
                        onClick={() => {
                          // Trigger file input click
                          const fileInput = document.createElement('input')
                          fileInput.type = 'file'
                          fileInput.accept = 'image/*'
                          fileInput.onchange = (e: Event) => {
                            const target = e.target as HTMLInputElement
                            const file = target.files?.[0]
                            if (file) {
                              handleImageUpload(file)
                            }
                          }
                          fileInput.click()
                        }}
                        variant="outline"
                        className="border-white/16 bg-white/7 text-white/90 hover:bg-white/10"
                      >
                        New Image
                      </Button>
                    </div>
                  </div>
                  
                  {detectedRegions.length > 0 && (
                    <DetectionResults
                      regions={detectedRegions}
                      onClear={() => {
                        setDetectedRegions([])
                        setAutoMask(null)
                        if (canvas) {
                          const canvasElement = canvas.getElement()
                          if (canvasElement && canvasElement.parentNode) {
                            canvas.clear()
                            if (image) {
                              fabric.Image.fromURL(image, (img: fabric.Image) => {
                                const element = canvas.getElement()
                                if (element && element.parentNode) {
                                  canvas.setBackgroundImage(img, () => {
                                    safeRenderCanvas(canvas, 'clear-detection-setBackgroundImage')
                                  })
                                  safeRenderCanvas(canvas, 'clear-detection')
                                }
                              })
                            }
                          }
                        }
                      }}
                    />
                  )}
                  
                  <div className="mt-6 flex justify-center">
                    <CanvasEditor canvasRef={canvasRef} />
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <ProcessButton
                      onClick={handleProcess}
                      disabled={isProcessing || (detectedRegions.length === 0 && !canvas)}
                      isProcessing={isProcessing}
                    />
                  </div>
                </div>

                {processedImage && (
                  <div className="rounded-2xl border border-white/12 bg-white/7 backdrop-blur-xl ring-1 ring-white/8 p-6">
                    <h2 className="text-xl font-semibold mb-6 text-white/92 text-center">Result</h2>
                    <p className="text-white/56 text-sm mb-6 text-center">Gone. Clean. Done.</p>
                    <div className="flex justify-center">
                      <img
                        src={processedImage}
                        alt="Processed"
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>
                    <div className="mt-6 flex justify-center">
                      <DownloadButton onClick={handleDownload} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
          
          {/* History Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-ink-base/70 border-t border-white/10 px-4 py-2.5 z-40 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm text-white/56">
              <span className="text-white/92 font-semibold">History:</span>
              <span>Original</span>
              <span>→</span>
              <span>Selection</span>
              <span>→</span>
              <span className={processedImage ? 'text-aurora-cyan' : ''}>
                {processedImage ? 'Vanished' : 'Ready'}
              </span>
            </div>
          </div>
          
          {/* Add bottom padding to prevent content from being hidden behind history bar */}
          <div className="h-16"></div>
        </>
      )}
      </div>
    </div>
  )
}

export default App

