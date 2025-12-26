import { useState, useRef, useEffect } from 'react'
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

const API_URL = 'http://localhost:8000'

function App() {
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
  const [detectedRegions, setDetectedRegions] = useState<any[]>([])
  const [autoMask, setAutoMask] = useState<string | null>(null)
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5)
  const [expandPixels, setExpandPixels] = useState(5)
  const [toolMode, setToolMode] = useState<'brush' | 'hand'>('brush')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Sync with history store
  useEffect(() => {
    if (historyImage !== image) {
      setImage(historyImage)
    }
  }, [historyImage])

  useEffect(() => {
    if (historyProcessedImage !== processedImage) {
      setProcessedImage(historyProcessedImage)
    }
  }, [historyProcessedImage])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo()) {
          handleUndo()
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        if (canRedo()) {
          handleRedo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canUndo, canRedo])

  const handleUndo = () => {
    if (undo()) {
      // History store will update, useEffect will sync
      if (canvas && historyImage) {
        canvas.clear()
        fabric.Image.fromURL(historyImage, (img: fabric.Image) => {
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
          canvas.renderAll()
        })
      }
    }
  }

  const handleRedo = () => {
    if (redo()) {
      // History store will update, useEffect will sync
      if (canvas && historyImage) {
        canvas.clear()
        fabric.Image.fromURL(historyImage, (img: fabric.Image) => {
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
          canvas.renderAll()
        })
      }
    }
  }

  const setupZoomControls = (fabricCanvas: fabric.Canvas): (() => void) => {
    // Pinch to zoom for all devices (touch and trackpad)
    let lastTouchDistance = 0
    let touches: Touch[] = []
    let trackpadPinchStart = 0
    
    // Handle trackpad pinch zoom
    let lastWheelTime = 0
    let wheelEventCount = 0
    let wheelEventBuffer: Array<{deltaX: number, deltaY: number, time: number}> = []
    
    const wheelHandler = (opt: any) => {
      const e = opt.e
      
      const now = Date.now()
      const timeDelta = now - lastWheelTime
      lastWheelTime = now
      
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
        const combinedDelta = Math.sqrt(absDeltaX * absDeltaX + absDeltaY * absDeltaY)
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
    const handleGestureStart = (e: any) => {
      e.preventDefault()
      trackpadPinchStart = fabricCanvas.getZoom()
    }
    
    const handleGestureChange = (e: any) => {
      e.preventDefault()
      if (e.scale !== undefined && e.scale !== 1) {
        const newZoom = Math.max(0.1, Math.min(5, trackpadPinchStart * e.scale))
        const rect = canvasElement.getBoundingClientRect()
        const centerX = e.clientX - rect.left
        const centerY = e.clientY - rect.top
        const point = new fabric.Point(centerX, centerY)
        fabricCanvas.zoomToPoint(point, newZoom)
      }
    }
    
    const handleGestureEnd = (e: any) => {
      e.preventDefault()
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
    if (canvasRef.current && image) {
      // Create canvas with viewport size - ensure it fits within container
      // Calculate available width: max-w-7xl container - sidebar (220px) - gap (24px) - padding (32px) - card padding (48px)
      // = ~1200px max container - 220px sidebar - 24px gap - 32px container padding - 48px card padding = ~876px
      // Use a safe maximum that fits in most screens
      const maxViewportWidth = 1000 // Reduced from 1200 to prevent overflow
      const maxViewportHeight = 800
      
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: maxViewportWidth,
        height: maxViewportHeight,
      })

      // Load image onto canvas
      fabric.Image.fromURL(image, (img: fabric.Image) => {
        // Store original dimensions
        const origWidth = img.width!
        const origHeight = img.height!
        setOriginalDimensions({ width: origWidth, height: origHeight })
        
        // Calculate scale to fit image exactly inside viewport (centered)
        // Scale to fit: use the smaller ratio to ensure image fits completely
        const scaleX = maxViewportWidth / origWidth
        const scaleY = maxViewportHeight / origHeight
        const scale = Math.min(scaleX, scaleY) // Ensures image fits completely
        
        // Set canvas to viewport size
        fabricCanvas.setWidth(maxViewportWidth)
        fabricCanvas.setHeight(maxViewportHeight)
        
        // Calculate centered position for scaled image
        const scaledWidth = origWidth * scale
        const scaledHeight = origHeight * scale
        const left = (maxViewportWidth - scaledWidth) / 2
        const top = (maxViewportHeight - scaledHeight) / 2
        
        // Ensure image is perfectly centered
        const centeredLeft = Math.round(left)
        const centeredTop = Math.round(top)
        
        // Set image as background, centered and scaled to fit exactly
        img.set({
          scaleX: scale,
          scaleY: scale,
          left: centeredLeft,
          top: centeredTop,
          originX: 'left',
          originY: 'top',
        })
        
        fabricCanvas.setBackgroundImage(img, () => {
          fabricCanvas.renderAll()
        }, {
          scaleX: scale,
          scaleY: scale,
          left: centeredLeft,
          top: centeredTop,
        })
        
        // Set initial zoom to 1 (no zoom) - image is already scaled to fit
        fabricCanvas.setZoom(1)
        fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0])
        
        fabricCanvas.renderAll()
        
        // Setup zoom controls (returns cleanup function)
        const cleanupZoom = setupZoomControls(fabricCanvas)
        
        setCanvas(fabricCanvas)

        return () => {
          if (cleanupZoom) cleanupZoom()
          fabricCanvas.dispose()
        }
      })

      // Configure brush for drawing mask
      fabricCanvas.freeDrawingBrush.width = brushSize
      fabricCanvas.freeDrawingBrush.color = 'rgba(255, 0, 0, 0.8)'
      fabricCanvas.isDrawingMode = toolMode === 'brush'
      
      // Enable canvas scrolling
      fabricCanvas.allowTouchScrolling = true
      
      // Set default cursor based on tool mode
      fabricCanvas.defaultCursor = toolMode === 'brush' ? 'crosshair' : 'move'
      
      // Pan handlers will be set up in the tool mode useEffect

      return () => {
        fabricCanvas.dispose()
      }
    }
  }, [image, toolMode]) // Added toolMode to dependencies
  
  // Update brush size and tool mode when they change
  useEffect(() => {
    if (canvas) {
      canvas.freeDrawingBrush.width = brushSize
      canvas.isDrawingMode = toolMode === 'brush'
      canvas.defaultCursor = toolMode === 'brush' ? 'crosshair' : 'grab'
      canvas.selection = toolMode === 'hand' ? false : true
      
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
      
      canvas.renderAll()
    }
  }, [brushSize, toolMode, canvas])

  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (file: File) => {
    // Validate file size (50MB limit)
    const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
    if (file.size > MAX_FILE_SIZE) {
      alert(`File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        // Don't set Content-Type header - let axios set it automatically with boundary
        timeout: 60000, // 60 second timeout
        maxContentLength: 100 * 1024 * 1024, // 100MB max response size
        maxBodyLength: 100 * 1024 * 1024, // 100MB max request size
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            console.log(`Upload progress: ${percentCompleted}%`)
          }
        },
      })
      const newImage = response.data.image
      setImage(newImage)
      setHistoryImage(newImage)
      setProcessedImage(null)
      setHistoryProcessedImage(null)
      saveState()
      setDetectedRegions([])
      setAutoMask(null)
      resetHistory()
      saveState()
    } catch (error: any) {
      console.error('Upload error:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      })
      
      if (error.code === 'ECONNABORTED') {
        alert('Upload timeout. Please try again with a smaller image.')
      } else if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Invalid file. Please upload a valid image.'
        alert(errorMsg)
      } else if (error.response?.status === 500) {
        const errorMsg = error.response?.data?.detail || 'Server error. Please try again.'
        alert(`Upload failed: ${errorMsg}`)
      } else if (error.message) {
        alert(`Upload failed: ${error.message}`)
      } else {
        alert('Failed to upload image. Please check the console for details and try again.')
      }
    } finally {
      setIsUploading(false)
    }
  }

  const getMaskFromCanvas = (): string | null => {
    if (!canvas || !image) return null
    
    // Create mask from manual drawing
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = originalDimensions.width
    tempCanvas.height = originalDimensions.height
    
    const tempFabricCanvas = new fabric.Canvas(tempCanvas)
    tempFabricCanvas.setWidth(originalDimensions.width)
    tempFabricCanvas.setHeight(originalDimensions.height)
    
    // Get canvas transform info
    const bgImage = canvas.backgroundImage as fabric.Image
    const canvasScale = bgImage?.scaleX || 1
    const canvasLeft = bgImage?.left || 0
    const canvasTop = bgImage?.top || 0
    
    // Copy only path objects (drawings) to temp canvas
    const objects = canvas.getObjects()
    const paths = objects.filter((obj: fabric.Object) => obj.type === 'path')
    
    if (paths.length === 0) {
      return null
    }
    
    paths.forEach((path: fabric.Object) => {
      const pathObj = fabric.util.object.clone(path)
      // Transform coordinates from canvas space to original image space
      const pathData = (pathObj as any).path
      if (pathData) {
        pathData.forEach((point: any[]) => {
          if (point[0] === 'M' || point[0] === 'L' || point[0] === 'C') {
            point[1] = (point[1] - canvasLeft) / canvasScale
            point[2] = (point[2] - canvasTop) / canvasScale
          }
        })
      }
      tempFabricCanvas.add(pathObj)
    })
    
    tempFabricCanvas.renderAll()
    return tempCanvas.toDataURL('image/png')
  }

  const handleAutoDetect = async () => {
    if (!image || !canvas) return

    // Get selected area mask from canvas
    const selectedMask = getMaskFromCanvas()
    
    if (!selectedMask) {
      alert('Please draw on the image to select an area for detection first.')
      return
    }

    setIsDetecting(true)
    try {
      const response = await axios.post(`${API_URL}/api/detect-text`, {
        image_base64: image,
        mask_base64: selectedMask, // Only detect in selected area
        confidence_threshold: confidenceThreshold,
        expand_pixels: expandPixels,
      })

      if (response.data.success) {
        setDetectedRegions(response.data.text_regions || [])
        setAutoMask(response.data.mask)
        
        // Load auto-detected mask onto canvas
        if (canvas && response.data.mask) {
          // Keep existing drawings and add detected mask
          fabric.Image.fromURL(response.data.mask, (maskImg: fabric.Image) => {
            maskImg.set({
              left: 0,
              top: 0,
              opacity: 0.5,
              selectable: false,
              evented: false,
            })
            canvas.add(maskImg)
            canvas.renderAll()
          })
        }
      }
    } catch (error) {
      console.error('Detection error:', error)
      alert('Text detection failed. You can still draw manually.')
    } finally {
      setIsDetecting(false)
    }
  }

  const handleProcess = async () => {
    if (!canvas || !image) return

    setIsProcessing(true)
    
    const processWithMask = async (maskDataUrl: string) => {
      try {
        const response = await axios.post(`${API_URL}/api/process`, {
          image_base64: image,
          mask_base64: maskDataUrl,
        })

        const resultImage = response.data.image
        setProcessedImage(resultImage)
        setHistoryProcessedImage(resultImage)
        saveState()
      } catch (error) {
        console.error('Processing error:', error)
        alert('Failed to process image')
      } finally {
        setIsProcessing(false)
      }
    }
    
    try {
      // Check if we have auto-detected mask
      if (autoMask) {
        // Use auto-detected mask directly
        await processWithMask(autoMask)
        return
      }
      
      // Create mask from manual drawing
      // Use original dimensions for mask, not canvas viewport size
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = originalDimensions.width
      tempCanvas.height = originalDimensions.height
      
      // Clone canvas to get only the drawing paths
      const tempFabricCanvas = new fabric.Canvas(tempCanvas)
      tempFabricCanvas.setWidth(originalDimensions.width)
      tempFabricCanvas.setHeight(originalDimensions.height)
      
      // Get canvas transform info
      const bgImage = canvas.backgroundImage as fabric.Image
      const canvasScale = (canvas as any).initialScale || 1
      const canvasLeft = bgImage?.left || 0
      const canvasTop = bgImage?.top || 0
      
      // Copy only path objects (drawings) to temp canvas
      const objects = canvas.getObjects()
      const paths = objects.filter((obj: fabric.Object) => obj.type === 'path')
      
      if (paths.length === 0) {
        alert('Please draw on the image or use auto-detect to mark areas for removal')
        setIsProcessing(false)
        return
      }
    
      paths.forEach((path: fabric.Object) => {
        const pathObj = fabric.util.object.clone(path)
        
        // Transform path coordinates from canvas viewport to original image coordinates
        if (pathObj.left !== undefined && pathObj.top !== undefined) {
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
        }
        
        tempFabricCanvas.add(pathObj)
      })
        
        tempFabricCanvas.renderAll()
        
        // Get mask data from temp canvas
        const maskDataUrl = tempCanvas.toDataURL('image/png')
      
      // Create proper mask: convert red drawings to black on white background
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
        // Draw mask image
        maskCtx.drawImage(maskImg, 0, 0, maskCanvas.width, maskCanvas.height)
        
        // Convert red areas to black (mask areas)
        const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
        const data = imageData.data
        
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
          } else {
            data[i] = 255     // R
            data[i + 1] = 255 // G
            data[i + 2] = 255 // B
            data[i + 3] = 255 // A
          }
        }
        
        maskCtx.putImageData(imageData, 0, 0)
        const finalMaskDataUrl = maskCanvas.toDataURL('image/png')
        
        // Process image
        await processWithMask(finalMaskDataUrl)
        
        // Cleanup
        tempFabricCanvas.dispose()
      }
      
      maskImg.src = maskDataUrl
    } catch (error) {
      console.error('Processing error:', error)
      alert('Failed to process image')
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!processedImage) return

    const link = document.createElement('a')
    link.href = processedImage
    link.download = 'vanish-ai-result.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const scrollToDemo = () => {
    const demoSection = document.getElementById('live-demo')
    demoSection?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleStartClick = () => {
    const demoSection = document.getElementById('live-demo')
    demoSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-void-black text-white w-full overflow-x-hidden">
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
            <div className="w-full max-w-7xl mx-auto px-4">
              <div className="grid md:grid-cols-[220px_1fr] gap-6 items-start w-full">
              {/* Tools Sidebar */}
              <div className="space-y-4">
                <div className="bg-graphite rounded-xl p-4 border border-electric-blue/20">
                  <h3 className="text-white font-semibold mb-4">TOOLS</h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-white hover:bg-electric-blue/20 ${
                        toolMode === 'brush' ? 'bg-electric-blue/20' : ''
                      }`}
                      title="Brush Tool"
                      onClick={() => setToolMode('brush')}
                    >
                      🖊 Brush
                    </Button>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-white hover:bg-electric-blue/20 ${
                        toolMode === 'hand' ? 'bg-electric-blue/20' : ''
                      }`}
                      title="Hand Tool - Drag/Pan"
                      onClick={() => setToolMode('hand')}
                    >
                      ✋ Hand
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-white hover:bg-electric-blue/20 disabled:opacity-50"
                      title="Rectangle Select"
                      disabled
                    >
                      <span>▢ Rectangle</span>
                      <span className="text-xs text-muted-gray">Coming Soon</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-white hover:bg-electric-blue/20 disabled:opacity-50"
                      title="Lasso Tool"
                      disabled
                    >
                      <span>✂ Lasso</span>
                      <span className="text-xs text-muted-gray">Coming Soon</span>
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
                <div className="bg-graphite rounded-xl shadow-lg p-6 border border-electric-blue/20 w-full min-w-0">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Select. Vanish.</h2>
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
                        className="border-graphite bg-transparent text-white hover:bg-graphite hover:text-white hover:border-electric-blue/50 transition-all hover:scale-105 active:scale-95"
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
                          canvas.clear()
                          if (image) {
                            fabric.Image.fromURL(image, (img: fabric.Image) => {
                              canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas))
                              canvas.renderAll()
                            })
                          }
                        }
                      }}
                    />
                  )}
                  
                  <div className="mt-4 flex justify-center">
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
                  <div className="bg-graphite rounded-xl shadow-lg p-6 border border-electric-blue/20">
                    <h2 className="text-xl font-semibold mb-4 text-white text-center">Result</h2>
                    <p className="text-muted-gray text-sm mb-4 text-center">Gone. Clean. Done.</p>
                    <div className="flex justify-center">
                      <img
                        src={processedImage}
                        alt="Processed"
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>
                    <div className="mt-4 flex justify-center">
                      <DownloadButton onClick={handleDownload} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
          
          {/* History Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-graphite border-t border-electric-blue/20 px-4 py-3 z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm text-muted-gray">
              <span className="text-white font-semibold">History:</span>
              <span>Original</span>
              <span>→</span>
              <span>Selection</span>
              <span>→</span>
              <span className={processedImage ? 'text-electric-blue' : ''}>
                {processedImage ? 'Vanished' : 'Ready'}
              </span>
            </div>
          </div>
          
          {/* Add bottom padding to prevent content from being hidden behind history bar */}
          <div className="h-16"></div>
        </>
      )}
    </div>
  )
}

export default App

