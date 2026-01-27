"""
Directory Processing Script for Backend
Processes a directory of images using YOLOv11
"""
import json
import sys
import os
from pathlib import Path
import io
import contextlib

# Get the absolute path to the src directory
src_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, src_dir)

# Suppress YOLO warnings and other output
import warnings
warnings.filterwarnings('ignore')
os.environ['YOLO_VERBOSE'] = 'False'

# Now import the inference module
from inference import YOLOv11Inference

def main():
    try:
        # Parse input from Node.js
        input_data = json.loads(sys.argv[1])
        image_dir = input_data.get('imageDir')
        model_path = input_data.get('modelPath', 'yolo11m.pt')
        max_images = input_data.get('maxImages')  # Optional limit for testing

        if not image_dir:
            raise ValueError("Image directory path required")

        # Get absolute path for image directory
        abs_image_dir = os.path.abspath(image_dir)
        
        if not os.path.exists(abs_image_dir):
            raise ValueError(f"Image directory not found: {abs_image_dir}")

        # Save original stdout/stderr
        original_stdout = sys.stdout
        original_stderr = sys.stderr
        
        # Log start to stderr (so backend can see it)
        print("STARTING_PROCESSING", file=original_stderr)
        original_stderr.flush()
        
        # Process directory with suppressed output
        with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            inferencer = YOLOv11Inference(model_path)
            
            # Get image paths
            patterns = [f"*{ext}" for ext in [".jpg", ".jpeg", ".png"]]
            image_paths = []
            for pattern in patterns:
                image_paths.extend(Path(abs_image_dir).glob(pattern))
            
            # Limit images if specified
            if max_images:
                image_paths = image_paths[:max_images]
            
            metadata = []
            for img_path in image_paths:
                try:
                    metadata.append(inferencer.process_image(img_path))
                except Exception as e:
                    pass

        print("PROCESSING_COMPLETE", file=original_stderr)
        original_stderr.flush()
        
        # Return ONLY JSON - no other output (using original stdout)
        print(json.dumps(metadata), file=original_stdout)
        original_stdout.flush()

    except Exception as e:
        # Only output error as JSON to stderr
        original_stderr = sys.stderr
        print(json.dumps({'error': str(e)}), file=original_stderr)
        original_stderr.flush()
        sys.exit(1)

if __name__ == '__main__':
    main()
