"""
Manual LaMa Model Download Script
Downloads the model manually to bypass SSL issues
"""
import os
import ssl
import urllib.request
from pathlib import Path
import certifi
import requests

def download_lama_model():
    """Download LaMa model manually with proper SSL handling"""
    model_url = "https://github.com/enesmsahin/simple-lama-inpainting/releases/download/v0.1.0/big-lama.pt"
    cache_dir = Path.home() / ".cache" / "torch" / "hub" / "checkpoints"
    cache_dir.mkdir(parents=True, exist_ok=True)
    model_path = cache_dir / "big-lama.pt"
    
    if model_path.exists():
        print(f"✅ Model already exists at: {model_path}")
        return str(model_path)
    
    print(f"Downloading LaMa model to: {model_path}")
    print("This may take a few minutes (model is ~45MB)...")
    
    try:
        # Method 1: Use requests with certifi
        cert_path = certifi.where()
        print(f"Using SSL certificates from: {cert_path}")
        
        response = requests.get(model_url, verify=cert_path, stream=True, timeout=30)
        response.raise_for_status()
        
        total_size = int(response.headers.get('content-length', 0))
        downloaded = 0
        
        with open(model_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
                    if total_size > 0:
                        percent = (downloaded / total_size) * 100
                        print(f"\rProgress: {percent:.1f}% ({downloaded}/{total_size} bytes)", end='', flush=True)
        
        print(f"\n✅ Model downloaded successfully to: {model_path}")
        print(f"File size: {model_path.stat().st_size / (1024*1024):.2f} MB")
        return str(model_path)
        
    except requests.exceptions.SSLError as ssl_error:
        print(f"\n❌ SSL Error: {ssl_error}")
        print("Trying fallback method (unverified SSL)...")
        try:
            # Fallback: unverified SSL (less secure but works)
            response = requests.get(model_url, verify=False, stream=True, timeout=30)
            response.raise_for_status()
            
            total_size = int(response.headers.get('content-length', 0))
            downloaded = 0
            
            with open(model_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
                        if total_size > 0:
                            percent = (downloaded / total_size) * 100
                            print(f"\rProgress: {percent:.1f}%", end='', flush=True)
            
            print(f"\n✅ Model downloaded (unverified SSL) to: {model_path}")
            return str(model_path)
        except Exception as fallback_error:
            print(f"\n❌ Fallback download also failed: {fallback_error}")
            print("\nManual download instructions:")
            print(f"1. Download from: {model_url}")
            print(f"2. Save to: {model_path}")
            return None
        
    except Exception as e:
        print(f"\n❌ Download failed: {e}")
        print("\nManual download instructions:")
        print(f"1. Download from: {model_url}")
        print(f"2. Save to: {model_path}")
        return None

if __name__ == "__main__":
    download_lama_model()

