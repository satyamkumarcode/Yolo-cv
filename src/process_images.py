"""
Image Processing Script for Backend
Processes uploaded images using YOLOv11
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
from utils import get_unique_classes_counts

def main():
    try:
        # Parse input from Node.js
        input_data = json.loads(sys.argv[1])
        files = input_data.get('files', [])
        model_path = input_data.get('modelPath', 'yolo11m.pt')

        # Save original stdout/stderr
        original_stdout = sys.stdout
        original_stderr = sys.stderr

        # Process images with suppressed output
        with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            inferencer = YOLOv11Inference(model_path)
            metadata = []

            for file_path in files:
                try:
                    result = inferencer.process_image(file_path)
                    metadata.append(result)
                except Exception as e:
                    pass

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
