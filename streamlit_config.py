"""
Streamlit Cloud Configuration
Author: Satyam Kumar
Description: Handles environment-specific configurations for Streamlit Cloud deployment
"""

import os
import sys

# Set environment variables for Streamlit Cloud
os.environ["OPENCV_VIDEOIO_DEBUG"] = "0"
os.environ["OPENCV_VIDEOIO_LOG_LEVEL"] = "OFF"

# Suppress OpenCV warnings on Streamlit Cloud
if "streamlit" in sys.modules:
    import warnings
    warnings.filterwarnings("ignore", category=DeprecationWarning)
