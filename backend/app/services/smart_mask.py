"""
Smart Mask Generation Service
Intelligently combines and refines masks for optimal inpainting
"""
import numpy as np
from PIL import Image
import cv2
from typing import Optional, List, Dict

class SmartMaskService:
    """
    Service for generating and refining masks intelligently
    """
    
    def fuse_masks(self, masks: List[np.ndarray], weights: Optional[List[float]] = None) -> np.ndarray:
        """
        Fuse multiple masks together
        
        Args:
            masks: List of mask arrays (0 = keep, 255 = remove)
            weights: Optional weights for each mask (default: equal)
        
        Returns:
            Fused mask array
        """
        if not masks:
            return np.zeros((100, 100), dtype=np.uint8)
        
        if weights is None:
            weights = [1.0 / len(masks)] * len(masks)
        
        # Normalize weights
        weight_sum = sum(weights)
        weights = [w / weight_sum for w in weights]
        
        # Combine masks
        fused = np.zeros_like(masks[0], dtype=np.float32)
        for mask, weight in zip(masks, weights):
            fused += mask.astype(np.float32) * weight
        
        # Threshold
        fused = np.clip(fused, 0, 255).astype(np.uint8)
        fused = (fused > 127).astype(np.uint8) * 255
        
        return fused
    
    def expand_mask_intelligently(self, mask: np.ndarray, image: np.ndarray, 
                                 expansion_pixels: int = 5) -> np.ndarray:
        """
        Expand mask intelligently based on image content
        
        Args:
            mask: Binary mask (0 = keep, 255 = remove)
            image: Original image array
            expansion_pixels: Base expansion in pixels
        
        Returns:
            Expanded mask
        """
        expanded = mask.copy()
        
        # Detect edges in image
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        else:
            gray = image
        
        # Use Canny edge detection
        edges = cv2.Canny(gray, 50, 150)
        
        # Create distance transform from mask boundary
        mask_inv = 255 - mask
        dist_transform = cv2.distanceTransform(mask_inv, cv2.DIST_L2, 5)
        
        # Expand mask but stop at edges
        kernel_size = expansion_pixels * 2 + 1
        kernel = np.ones((kernel_size, kernel_size), np.uint8)
        
        # Dilate mask
        dilated = cv2.dilate(mask, kernel, iterations=1)
        
        # Remove expansion where edges exist (preserve object boundaries)
        edge_mask = (edges > 0).astype(np.uint8) * 255
        edge_dilated = cv2.dilate(edge_mask, np.ones((3, 3), np.uint8), iterations=1)
        
        # Combine: expanded mask minus edge regions
        expanded = np.maximum(dilated, mask)
        expanded = np.minimum(expanded, 255 - edge_dilated)
        
        # Smooth boundaries
        expanded = cv2.GaussianBlur(expanded.astype(np.float32), (5, 5), 1.5)
        expanded = (expanded > 127).astype(np.uint8) * 255
        
        return expanded
    
    def refine_mask(self, mask: np.ndarray, image: np.ndarray) -> np.ndarray:
        """
        Refine mask using image analysis
        
        Args:
            mask: Binary mask
            image: Original image
        
        Returns:
            Refined mask
        """
        refined = mask.copy()
        
        # Remove small isolated regions
        num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(refined, connectivity=8)
        
        # Filter small components
        min_area = (image.shape[0] * image.shape[1]) // 1000  # 0.1% of image
        for i in range(1, num_labels):
            if stats[i, cv2.CC_STAT_AREA] < min_area:
                refined[labels == i] = 0
        
        # Fill small holes
        mask_inv = 255 - refined
        num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(mask_inv, connectivity=8)
        
        for i in range(1, num_labels):
            if stats[i, cv2.CC_STAT_AREA] < min_area:
                refined[labels == i] = 255
        
        return refined
    
    def validate_mask(self, mask: np.ndarray, image: np.ndarray) -> Dict:
        """
        Validate mask quality
        
        Args:
            mask: Binary mask
            image: Original image
        
        Returns:
            Validation results dictionary
        """
        mask_area = np.sum(mask > 0)
        total_area = mask.shape[0] * mask.shape[1]
        mask_ratio = mask_area / total_area if total_area > 0 else 0
        
        # Check mask size
        is_too_large = mask_ratio > 0.5
        is_too_small = mask_ratio < 0.001
        
        # Check mask connectivity
        num_components, _, stats, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)
        has_multiple_regions = num_components > 2  # Background + mask regions
        
        # Check edge quality
        edges = cv2.Canny(mask, 50, 150)
        edge_density = np.sum(edges > 0) / total_area if total_area > 0 else 0
        
        warnings = []
        if is_too_large:
            warnings.append("Mask covers more than 50% of image - may affect quality")
        if is_too_small:
            warnings.append("Mask is very small - ensure it covers target area")
        if has_multiple_regions:
            warnings.append("Multiple disconnected regions detected")
        if edge_density > 0.1:
            warnings.append("Mask has complex edges - may need refinement")
        
        return {
            'is_valid': len(warnings) == 0,
            'mask_ratio': float(mask_ratio),
            'num_regions': int(num_components - 1),  # Exclude background
            'warnings': warnings,
            'recommendations': self._get_recommendations(mask_ratio, num_components)
        }
    
    def _get_recommendations(self, mask_ratio: float, num_regions: int) -> List[str]:
        """Get recommendations based on mask characteristics"""
        recommendations = []
        
        if mask_ratio > 0.3:
            recommendations.append("Consider processing in multiple passes for large masks")
        
        if num_regions > 5:
            recommendations.append("Many regions detected - consider combining nearby regions")
        
        if mask_ratio < 0.01:
            recommendations.append("Small mask - ensure precise coverage of target area")
        
        return recommendations

