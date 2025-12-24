"""
Background Analysis Service
Intelligently analyzes image background for better inpainting
"""
import numpy as np
from PIL import Image
import cv2
from sklearn.cluster import KMeans
from typing import Dict, List, Tuple, Optional

class BackgroundAnalysisService:
    """
    Service for analyzing image background characteristics
    """
    
    def analyze_background(self, image: Image.Image, mask: np.ndarray) -> Dict:
        """
        Analyze background characteristics
        
        Args:
            image: PIL Image (RGB)
            mask: Numpy array mask (0 = keep, 255 = remove)
        
        Returns:
            Dictionary with background analysis results
        """
        img_array = np.array(image)
        
        # Get background regions (areas not in mask)
        background_mask = (mask == 0).astype(np.uint8)
        background_pixels = img_array[background_mask > 0]
        
        if len(background_pixels) == 0:
            return {
                'dominant_colors': [],
                'background_type': 'unknown',
                'texture_info': {},
                'suggestions': []
            }
        
        # Analyze dominant colors
        dominant_colors = self._get_dominant_colors(background_pixels)
        
        # Analyze texture
        texture_info = self._analyze_texture(img_array, background_mask)
        
        # Determine background type
        background_type = self._classify_background(dominant_colors, texture_info)
        
        # Generate suggestions
        suggestions = self._generate_suggestions(background_type, texture_info)
        
        return {
            'dominant_colors': dominant_colors,
            'background_type': background_type,
            'texture_info': texture_info,
            'suggestions': suggestions
        }
    
    def _get_dominant_colors(self, pixels: np.ndarray, n_colors: int = 5) -> List[Dict]:
        """Extract dominant colors using K-means clustering"""
        if len(pixels) < n_colors:
            n_colors = len(pixels)
        
        if n_colors == 0:
            return []
        
        # Sample pixels for faster processing
        sample_size = min(10000, len(pixels))
        sampled_pixels = pixels[np.random.choice(len(pixels), sample_size, replace=False)]
        
        # Reshape for KMeans
        pixels_reshaped = sampled_pixels.reshape(-1, 3)
        
        # K-means clustering
        kmeans = KMeans(n_clusters=n_colors, random_state=42, n_init=10)
        kmeans.fit(pixels_reshaped)
        
        # Get cluster centers (dominant colors)
        colors = kmeans.cluster_centers_.astype(int)
        labels = kmeans.labels_
        
        # Calculate proportions
        unique, counts = np.unique(labels, return_counts=True)
        proportions = counts / len(labels)
        
        # Sort by proportion
        sorted_indices = np.argsort(proportions)[::-1]
        
        dominant_colors = []
        for idx in sorted_indices:
            dominant_colors.append({
                'rgb': colors[idx].tolist(),
                'proportion': float(proportions[idx])
            })
        
        return dominant_colors
    
    def _analyze_texture(self, image: np.ndarray, background_mask: np.ndarray) -> Dict:
        """Analyze texture characteristics of background"""
        # Extract background region
        background_region = image * background_mask[:, :, np.newaxis]
        
        # Convert to grayscale
        gray = cv2.cvtColor(background_region.astype(np.uint8), cv2.COLOR_RGB2GRAY)
        
        # Calculate texture metrics
        # 1. Variance (texture complexity)
        variance = float(np.var(gray[background_mask > 0]))
        
        # 2. Edge density
        edges = cv2.Canny(gray, 50, 150)
        edge_density = float(np.sum(edges > 0) / np.sum(background_mask > 0)) if np.sum(background_mask > 0) > 0 else 0
        
        # 3. Local binary pattern (simplified)
        # Calculate gradient magnitude
        grad_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        grad_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        gradient_magnitude = np.sqrt(grad_x**2 + grad_y**2)
        avg_gradient = float(np.mean(gradient_magnitude[background_mask > 0]))
        
        return {
            'variance': variance,
            'edge_density': edge_density,
            'gradient_magnitude': avg_gradient,
            'is_smooth': variance < 500 and edge_density < 0.1,
            'is_textured': variance > 1000 or edge_density > 0.2
        }
    
    def _classify_background(self, dominant_colors: List[Dict], texture_info: Dict) -> str:
        """Classify background type"""
        if not dominant_colors:
            return 'unknown'
        
        # Check if background is mostly uniform
        if len(dominant_colors) == 1 or dominant_colors[0]['proportion'] > 0.7:
            if texture_info.get('is_smooth', False):
                return 'solid_smooth'
            else:
                return 'solid_textured'
        
        # Check for gradient
        if texture_info.get('is_smooth', False) and len(dominant_colors) > 1:
            return 'gradient'
        
        # Check for pattern
        if texture_info.get('is_textured', False):
            return 'patterned'
        
        return 'complex'
    
    def _generate_suggestions(self, background_type: str, texture_info: Dict) -> List[str]:
        """Generate suggestions based on background analysis"""
        suggestions = []
        
        if background_type == 'solid_smooth':
            suggestions.append("Background is uniform - inpainting should blend seamlessly")
            suggestions.append("Consider using smaller mask expansion for precise removal")
        
        elif background_type == 'gradient':
            suggestions.append("Background has gradient - ensure mask covers full gradient region")
            suggestions.append("Use edge-aware mask expansion")
        
        elif background_type == 'patterned':
            suggestions.append("Background has texture/pattern - may need larger inpainting radius")
            suggestions.append("Consider manual refinement for best results")
        
        elif background_type == 'complex':
            suggestions.append("Complex background detected - LaMa model recommended")
            suggestions.append("May require multiple passes for optimal results")
        
        return suggestions
    
    def suggest_mask_expansion(self, mask: np.ndarray, background_type: str) -> int:
        """Suggest optimal mask expansion based on background"""
        base_expansion = 3
        
        if background_type == 'solid_smooth':
            return base_expansion
        elif background_type == 'gradient':
            return base_expansion + 2
        elif background_type == 'patterned':
            return base_expansion + 5
        else:
            return base_expansion + 3

