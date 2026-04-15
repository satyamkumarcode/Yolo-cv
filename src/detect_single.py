"""
Single Image Detection Script
Author: Satyam Kumar
Email: satyamkumarcode@gmail.com
Description: Detects objects in a single uploaded image using YOLOv11
"""

import sys
import json
from pathlib import Path
from inference import YOLOv11Inference

def detect_single_image(image_path, model_path='yolo11m.pt'):
    """
    Run detection on a single image and return results.
    """
    try:
        # Initialize the model
        detector = YOLOv11Inference(model_path)
        
        # Run detection
        result = detector.process_image(image_path)
        
        # Format the output
        output = {
            'success': True,
            'image_path': str(image_path),
            'total_objects': result['total_objects'],
            'unique_classes': result['unique_class'],
            'class_counts': result['class_counts'],
            'detections': result['detections']
        }
        
        return output
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'image_path': str(image_path)
        }

if __name__ == '__main__':
    import sys
    import io
    sys.stdout = io.StringIO()  # Suppress all output except final JSON
    final_output = None
    try:
        if len(sys.argv) < 2:
            final_output = {'error': 'No arguments provided'}
        else:
            args = json.loads(sys.argv[1])
            image_path = args.get('imagePath')
            model_path = args.get('modelPath', 'yolo11m.pt')
            if not image_path:
                final_output = {'error': 'No image path provided'}
            else:
                result = detect_single_image(image_path, model_path)
                final_output = result
    except json.JSONDecodeError as e:
        final_output = {'error': f'Invalid JSON: {str(e)}'}
    except Exception as e:
        final_output = {'error': str(e)}
    finally:
        sys.stdout = sys.__stdout__
        print(json.dumps(final_output))
