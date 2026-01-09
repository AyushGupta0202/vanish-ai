"""
Vanish AI Backend - FastAPI server for image inpainting
"""
import os
import io
import base64
from pathlib import Path
from typing import Optional
import numpy as np
from PIL import Image
import cv2
import torch
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import aiofiles

from app.services.inpainting import InpaintingService
from app.services.text_detection import TextDetectionService
from app.services.background_analysis import BackgroundAnalysisService
from app.services.smart_mask import SmartMaskService

app = FastAPI(title="Vanish AI API", version="2.0.0")

# CORS middleware for frontend and mobile apps
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for mobile apps and web
    allow_credentials=False,  # Must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services (lazy initialization for heavy services)
inpainting_service = None
text_detection_service = None
background_analysis_service = None
smart_mask_service = None

def get_inpainting_service():
    """Lazy initialization of inpainting service"""
    global inpainting_service
    if inpainting_service is None:
        inpainting_service = InpaintingService()
    return inpainting_service

def get_text_detection_service():
    """Lazy initialization of text detection service"""
    global text_detection_service
    if text_detection_service is None:
        text_detection_service = TextDetectionService()
    return text_detection_service

def get_background_analysis_service():
    """Lazy initialization of background analysis service"""
    global background_analysis_service
    if background_analysis_service is None:
        background_analysis_service = BackgroundAnalysisService()
    return background_analysis_service

def get_smart_mask_service():
    """Lazy initialization of smart mask service"""
    global smart_mask_service
    if smart_mask_service is None:
        smart_mask_service = SmartMaskService()
    return smart_mask_service

@app.on_event("startup")
async def startup_event():
    """Initialize services in background after server starts"""
    import asyncio
    async def init_services():
        print("Initializing services in background...")
        get_inpainting_service()
        get_background_analysis_service()
        get_smart_mask_service()
        print("Services initialized")
    asyncio.create_task(init_services())

class ProcessRequest(BaseModel):
    image_base64: str
    mask_base64: str

class DetectTextRequest(BaseModel):
    image_base64: str
    mask_base64: Optional[str] = None  # Only detect in selected area
    confidence_threshold: float = 0.5
    expand_pixels: int = 5

class AnalyzeBackgroundRequest(BaseModel):
    image_base64: str
    mask_base64: str

class GenerateSmartMaskRequest(BaseModel):
    image_base64: str
    detection_type: str = "text"  # "text", "manual", "both"
    manual_mask_base64: Optional[str] = None
    confidence_threshold: float = 0.5
    expand_pixels: int = 5

@app.get("/")
async def root():
    return {"message": "Vanish AI API", "status": "running"}

@app.get("/health")
async def health():
    inpainting = get_inpainting_service()
    text_service = get_text_detection_service()
    return {
        "status": "healthy",
        "model_loaded": inpainting.model_loaded,
        "device": str(inpainting.device),
        "text_detection_available": text_service.initialized
    }

@app.post("/api/process")
async def process_image(request: ProcessRequest):
    """
    Process image with mask for inpainting - only processes selected region
    """
    try:
        # Decode base64 images
        image_data = base64.b64decode(request.image_base64.split(',')[1])
        mask_data = base64.b64decode(request.mask_base64.split(',')[1])
        
        # Convert to PIL Images
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        mask = Image.open(io.BytesIO(mask_data)).convert('L')
        
        # Convert mask to numpy to find bounding box
        mask_array = np.array(mask)
        
        # Log basic mask info
        black_pixels = np.sum(mask_array < 128)
        print(f"Processing: {black_pixels} pixels to inpaint")
        
        # Find bounding box of mask (where mask is non-zero/black)
        # In mask: black (0) = area to inpaint, white (255) = keep
        # We want to find where mask is black (0) or low value
        mask_region = (mask_array < 128)  # Areas to process
        
        if not np.any(mask_region):
            # No mask region found, return original image
            buffered = io.BytesIO()
            image.save(buffered, format="PNG")
            img_base64 = base64.b64encode(buffered.getvalue()).decode()
            return {
                "success": True,
                "image": f"data:image/png;base64,{img_base64}",
                "message": "No mask region found"
            }
        
        # Get bounding box coordinates
        coords = np.column_stack(np.where(mask_region))
        y_min, x_min = coords.min(axis=0)
        y_max, x_max = coords.max(axis=0)
        
        # Add padding (10% of region size, minimum 20px)
        padding_x = max(20, int((x_max - x_min) * 0.1))
        padding_y = max(20, int((y_max - y_min) * 0.1))
        
        x_min = max(0, x_min - padding_x)
        y_min = max(0, y_min - padding_y)
        x_max = min(image.width, x_max + padding_x)
        y_max = min(image.height, y_max + padding_y)
        
        # Crop image and mask to region
        cropped_image = image.crop((x_min, y_min, x_max, y_max))
        cropped_mask = mask.crop((x_min, y_min, x_max, y_max))
        
        # Store original cropped size
        cropped_width = cropped_image.width
        cropped_height = cropped_image.height
        
        # Process only the cropped region
        inpainting = get_inpainting_service()
        result_cropped = await inpainting.process(cropped_image, cropped_mask)
        
        # Ensure result matches cropped size (inpainting might change dimensions)
        if result_cropped.size != (cropped_width, cropped_height):
            result_cropped = result_cropped.resize((cropped_width, cropped_height), Image.LANCZOS)
        
        # Paste result back into original image
        result_image = image.copy()
        result_image.paste(result_cropped, (x_min, y_min))
        
        # Convert result to base64
        buffered = io.BytesIO()
        result_image.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        return {
            "success": True,
            "image": f"data:image/png;base64,{img_base64}",
            "message": "Image processed successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload and validate image with optimization
    """
    try:
        print(f"Upload request received: {file.filename}, content_type: {file.content_type}")
        
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            print(f"Invalid content type: {file.content_type}")
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file with size limit (50MB)
        MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
        
        # Read file contents into memory
        contents = await file.read()
        print(f"File size: {len(contents)} bytes, content_type: {file.content_type}")
        
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail=f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB")
        
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="File is empty")
        
        # Create a new BytesIO object from the contents
        image_bytes = io.BytesIO(contents)
        
        # Open and validate image
        try:
            # Try to open the image
            image = Image.open(image_bytes)
            print(f"Image format detected: {image.format}, size: {image.width}x{image.height}, mode: {image.mode}")
            
            # Convert to RGB (handles RGBA, P, etc.)
            if image.mode != 'RGB':
                image = image.convert('RGB')
            print(f"Image converted to RGB: {image.width}x{image.height}")
        except Exception as img_error:
            import traceback
            error_details = traceback.format_exc()
            print(f"Error opening image: {str(img_error)}")
            print(f"Traceback: {error_details}")
            raise HTTPException(status_code=400, detail=f"Invalid image file. Please ensure it's a valid image format (JPEG, PNG, etc.). Error: {str(img_error)}")
        
        # Optimize: Resize if image is too large (max 4096px on longest side)
        MAX_DIMENSION = 4096
        original_size = (image.width, image.height)
        if max(image.width, image.height) > MAX_DIMENSION:
            ratio = MAX_DIMENSION / max(image.width, image.height)
            new_width = int(image.width * ratio)
            new_height = int(image.height * ratio)
            print(f"Resizing from {original_size} to ({new_width}, {new_height})")
            image = image.resize((new_width, new_height), Image.LANCZOS)
        
        # Convert to base64 with optimization
        buffered = io.BytesIO()
        
        try:
            # Use JPEG for better compression, quality 85 is a good balance
            image.save(buffered, format="JPEG", quality=85, optimize=True)
            img_base64 = base64.b64encode(buffered.getvalue()).decode()
            print(f"Image converted to base64, size: {len(img_base64)} chars")
        except Exception as save_error:
            print(f"Error saving image: {str(save_error)}")
            raise HTTPException(status_code=500, detail=f"Failed to process image: {str(save_error)}")
        
        return {
            "success": True,
            "image": f"data:image/jpeg;base64,{img_base64}",
            "width": image.width,
            "height": image.height
        }
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Unexpected error in upload: {str(e)}")
        print(f"Traceback: {error_trace}")
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")

@app.post("/api/detect-text")
async def detect_text(request: DetectTextRequest):
    """
    Automatically detect text regions in image (only in selected area if mask provided)
    """
    try:
        # Decode image
        image_data = base64.b64decode(request.image_base64.split(',')[1])
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        # Decode mask if provided (selected area)
        selected_mask = None
        if request.mask_base64:
            mask_data = base64.b64decode(request.mask_base64.split(',')[1])
            selected_mask = Image.open(io.BytesIO(mask_data)).convert('L')
        
        # Detect text only in selected area
        if selected_mask:
            text_service = get_text_detection_service()
            text_regions, mask = text_service.detect_and_mask_in_region(
                image,
                selected_mask,
                confidence_threshold=request.confidence_threshold,
                expand_pixels=request.expand_pixels
            )
        else:
            # No selected area - return empty (user must select area first)
            return {
                "success": False,
                "message": "Please select an area first by drawing on the image",
                "text_regions": [],
                "mask": None,
                "count": 0
            }
        
        # Convert mask to base64
        buffered = io.BytesIO()
        mask.save(buffered, format="PNG")
        mask_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        return {
            "success": True,
            "text_regions": text_regions,
            "mask": f"data:image/png;base64,{mask_base64}",
            "count": len(text_regions)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-background")
async def analyze_background(request: AnalyzeBackgroundRequest):
    """
    Analyze image background for intelligent inpainting
    """
    try:
        # Decode images
        image_data = base64.b64decode(request.image_base64.split(',')[1])
        mask_data = base64.b64decode(request.mask_base64.split(',')[1])
        
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        mask = Image.open(io.BytesIO(mask_data)).convert('L')
        
        # Convert mask to numpy
        mask_array = np.array(mask)
        
        # Analyze background
        bg_service = get_background_analysis_service()
        analysis = bg_service.analyze_background(image, mask_array)
        
        # Get expansion suggestion
        expansion = bg_service.suggest_mask_expansion(
            mask_array, analysis['background_type']
        )
        
        analysis['suggested_expansion'] = expansion
        
        return {
            "success": True,
            "analysis": analysis
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-smart-mask")
async def generate_smart_mask(request: GenerateSmartMaskRequest):
    """
    Generate smart mask combining auto-detection and manual input
    """
    try:
        # Decode image
        image_data = base64.b64decode(request.image_base64.split(',')[1])
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        masks = []
        detection_info = {}
        
        # Auto-detect text if requested
        if request.detection_type in ["text", "both"]:
            text_service = get_text_detection_service()
            text_regions, text_mask = text_service.detect_and_mask(
                image,
                confidence_threshold=request.confidence_threshold,
                expand_pixels=request.expand_pixels
            )
            masks.append(np.array(text_mask))
            detection_info['text_regions'] = text_regions
        
        # Add manual mask if provided
        if request.detection_type in ["manual", "both"] and request.manual_mask_base64:
            mask_data = base64.b64decode(request.manual_mask_base64.split(',')[1])
            manual_mask = Image.open(io.BytesIO(mask_data)).convert('L')
            masks.append(np.array(manual_mask))
        
        if not masks:
            raise HTTPException(status_code=400, detail="No mask generated")
        
        # Fuse masks
        mask_service = get_smart_mask_service()
        if len(masks) > 1:
            fused_mask = mask_service.fuse_masks(masks)
        else:
            fused_mask = masks[0]
        
        # Expand intelligently
        img_array = np.array(image)
        expanded_mask = mask_service.expand_mask_intelligently(
            fused_mask, img_array, request.expand_pixels
        )
        
        # Refine mask
        refined_mask = mask_service.refine_mask(expanded_mask, img_array)
        
        # Validate mask
        validation = mask_service.validate_mask(refined_mask, img_array)
        
        # Convert to PIL and base64
        mask_pil = Image.fromarray(refined_mask, mode='L')
        buffered = io.BytesIO()
        mask_pil.save(buffered, format="PNG")
        mask_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        return {
            "success": True,
            "mask": f"data:image/png;base64,{mask_base64}",
            "detection_info": detection_info,
            "validation": validation
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

