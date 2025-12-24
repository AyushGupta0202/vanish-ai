"""
Text Detection Service using PaddleOCR
Automatically detects and masks text regions in images
"""
import numpy as np
from PIL import Image
import cv2
from typing import List, Dict, Tuple, Optional

try:
    from paddleocr import PaddleOCR
    PADDLEOCR_AVAILABLE = True
except ImportError:
    PADDLEOCR_AVAILABLE = False
    print("Warning: PaddleOCR not available. Install with: pip install paddleocr")

class TextDetectionService:
    """
    Service for automatic text detection and mask generation
    """
    
    def __init__(self):
        self.ocr = None
        self.initialized = False
        self._initialize()
    
    def _initialize(self):
        """Initialize PaddleOCR with robust error handling"""
        if PADDLEOCR_AVAILABLE:
            try:
                print("Initializing PaddleOCR...")
                import os
                import ssl
                import certifi
                
                # Fix SSL for model download
                cert_path = certifi.where()
                os.environ['REQUESTS_CA_BUNDLE'] = cert_path
                os.environ['SSL_CERT_FILE'] = cert_path
                os.environ['CURL_CA_BUNDLE'] = cert_path
                os.environ['DISABLE_MODEL_SOURCE_CHECK'] = 'True'
                
                # Disable SSL verification warnings
                import urllib3
                urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
                
                # Try to initialize with multiple fallback options
                try:
                    # First try: Full initialization with angle classification
                    self.ocr = PaddleOCR(
                        use_angle_cls=True,
                        lang='en',
                        show_log=False,
                        use_gpu=False,  # Use CPU for compatibility
                        enable_mkldnn=False  # Disable MKLDNN for compatibility
                    )
                    self.initialized = True
                    print("✅ PaddleOCR initialized successfully")
                except Exception as e1:
                    print(f"First initialization attempt failed: {e1}")
                    try:
                        # Second try: Without angle classification
                        self.ocr = PaddleOCR(
                            use_angle_cls=False,
                            lang='en',
                            show_log=False,
                            use_gpu=False
                        )
                        self.initialized = True
                        print("✅ PaddleOCR initialized (without angle classification)")
                    except Exception as e2:
                        print(f"Second initialization attempt failed: {e2}")
                        # Third try: Minimal configuration
                        try:
                            self.ocr = PaddleOCR(lang='en', show_log=False)
                            self.initialized = True
                            print("✅ PaddleOCR initialized (minimal config)")
                        except Exception as e3:
                            print(f"All PaddleOCR initialization attempts failed: {e3}")
                            print("PaddleOCR will not be available. Manual drawing mode still works.")
                            self.initialized = False
            except Exception as e:
                print(f"Error initializing PaddleOCR: {e}")
                print("PaddleOCR will not be available. Manual drawing mode still works.")
                self.initialized = False
        else:
            print("PaddleOCR not available")
            self.initialized = False
    
    def detect_text_regions(self, image: Image.Image, confidence_threshold: float = 0.5) -> List[Dict]:
        """
        Detect text regions in image
        
        Args:
            image: PIL Image (RGB)
            confidence_threshold: Minimum confidence for detection (0.0-1.0)
        
        Returns:
            List of detected text regions with bbox, text, and confidence
        """
        if not self.initialized or self.ocr is None:
            return []
        
        try:
            # Convert PIL to numpy array
            img_array = np.array(image)
            
            # PaddleOCR expects BGR format
            if len(img_array.shape) == 3:
                img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
            else:
                img_bgr = img_array
            
            # Run OCR
            result = self.ocr.ocr(img_bgr, cls=True)
            
            # Parse results
            text_regions = []
            if result and result[0]:
                for line in result[0]:
                    if line:
                        bbox, (text, confidence) = line
                        
                        # Filter by confidence
                        if confidence >= confidence_threshold:
                            # Convert bbox to format: [[x1,y1], [x2,y2], [x3,y3], [x4,y4]]
                            bbox_points = np.array(bbox, dtype=np.int32)
                            
                            # Get bounding box coordinates
                            x_coords = [point[0] for point in bbox_points]
                            y_coords = [point[1] for point in bbox_points]
                            
                            x_min, x_max = min(x_coords), max(x_coords)
                            y_min, y_max = min(y_coords), max(y_coords)
                            
                            text_regions.append({
                                'bbox': bbox_points.tolist(),
                                'bbox_rect': [x_min, y_min, x_max, y_max],
                                'text': text,
                                'confidence': float(confidence)
                            })
            
            return text_regions
            
        except Exception as e:
            print(f"Error detecting text: {e}")
            return []
    
    def generate_text_mask(self, image: Image.Image, text_regions: List[Dict], 
                          expand_pixels: int = 5) -> Image.Image:
        """
        Generate mask from text regions
        
        Args:
            image: PIL Image (RGB)
            text_regions: List of detected text regions
            expand_pixels: Pixels to expand mask around text
        
        Returns:
            PIL Image mask (L mode) - white areas are text to remove
        """
        # Create blank mask
        mask = np.zeros((image.height, image.width), dtype=np.uint8)
        
        for region in text_regions:
            bbox_points = np.array(region['bbox'], dtype=np.int32)
            
            # Fill polygon with white (255)
            cv2.fillPoly(mask, [bbox_points], 255)
        
        # Expand mask slightly for better coverage
        if expand_pixels > 0:
            kernel = np.ones((expand_pixels * 2 + 1, expand_pixels * 2 + 1), np.uint8)
            mask = cv2.dilate(mask, kernel, iterations=1)
        
        # Smooth mask edges
        mask = cv2.GaussianBlur(mask, (5, 5), 1.5)
        mask = (mask > 127).astype(np.uint8) * 255
        
        return Image.fromarray(mask, mode='L')
    
    def detect_and_mask(self, image: Image.Image, confidence_threshold: float = 0.5,
                       expand_pixels: int = 5) -> Tuple[List[Dict], Image.Image]:
        """
        Detect text and generate mask in one call
        
        Args:
            image: PIL Image (RGB)
            confidence_threshold: Minimum confidence for detection
            expand_pixels: Pixels to expand mask
        
        Returns:
            Tuple of (text_regions, mask_image)
        """
        text_regions = self.detect_text_regions(image, confidence_threshold)
        mask = self.generate_text_mask(image, text_regions, expand_pixels)
        
        return text_regions, mask
    
    def detect_and_mask_in_region(self, image: Image.Image, region_mask: Image.Image,
                                  confidence_threshold: float = 0.5,
                                  expand_pixels: int = 5) -> Tuple[List[Dict], Image.Image]:
        """
        Detect text only within the selected region mask
        
        Args:
            image: PIL Image (RGB)
            region_mask: PIL Image (L mode) - white areas are where to detect
            confidence_threshold: Minimum confidence for detection
            expand_pixels: Pixels to expand mask
        
        Returns:
            Tuple of (text_regions, mask_image)
        """
        if not self.initialized or self.ocr is None:
            return [], Image.new('L', image.size, 0)
        
        try:
            # Convert masks to numpy
            region_mask_array = np.array(region_mask)
            
            # Only process if there's a selected area
            if np.sum(region_mask_array > 0) == 0:
                return [], Image.new('L', image.size, 0)
            
            # Crop image to selected region for faster processing
            coords = np.column_stack(np.where(region_mask_array > 0))
            if len(coords) == 0:
                return [], Image.new('L', image.size, 0)
            
            y_min, x_min = coords.min(axis=0)
            y_max, x_max = coords.max(axis=0)
            
            # Add padding
            padding = 50
            x_min = max(0, x_min - padding)
            y_min = max(0, y_min - padding)
            x_max = min(image.width, x_max + padding)
            y_max = min(image.height, y_max + padding)
            
            # Crop image and mask
            cropped_image = image.crop((x_min, y_min, x_max, y_max))
            cropped_region_mask = region_mask.crop((x_min, y_min, x_max, y_max))
            
            # Detect text in cropped region
            img_array = np.array(cropped_image)
            if len(img_array.shape) == 3:
                img_bgr = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
            else:
                img_bgr = img_array
            
            result = self.ocr.ocr(img_bgr, cls=True)
            
            # Parse results and filter by region mask
            text_regions = []
            if result and result[0]:
                for line in result[0]:
                    if line:
                        bbox, (text, confidence) = line
                        
                        if confidence >= confidence_threshold:
                            bbox_points = np.array(bbox, dtype=np.int32)
                            
                            # Adjust bbox coordinates to full image space
                            bbox_points[:, 0] += x_min
                            bbox_points[:, 1] += y_min
                            
                            # Check if bbox overlaps with selected region
                            x_coords = [point[0] for point in bbox_points]
                            y_coords = [point[1] for point in bbox_points]
                            
                            x_min_bbox, x_max_bbox = min(x_coords), max(x_coords)
                            y_min_bbox, y_max_bbox = min(y_coords), max(y_coords)
                            
                            # Check overlap with region mask
                            bbox_mask = np.zeros_like(region_mask_array)
                            cv2.fillPoly(bbox_mask, [bbox_points], 255)
                            overlap = np.sum((bbox_mask > 0) & (region_mask_array > 0))
                            total_bbox = np.sum(bbox_mask > 0)
                            
                            # Only include if significant overlap with selected region
                            if total_bbox > 0 and overlap / total_bbox > 0.3:
                                text_regions.append({
                                    'bbox': bbox_points.tolist(),
                                    'bbox_rect': [x_min_bbox, y_min_bbox, x_max_bbox, y_max_bbox],
                                    'text': text,
                                    'confidence': float(confidence)
                                })
            
            # Generate mask from filtered regions
            mask = self.generate_text_mask(image, text_regions, expand_pixels)
            
            return text_regions, mask
            
        except Exception as e:
            print(f"Error detecting text in region: {e}")
            return [], Image.new('L', image.size, 0)

