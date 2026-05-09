import cv2
import os

def detect_manipulation(image_path):
    image = cv2.imread(image_path)

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    edges = cv2.Canny(gray, 100, 200)

    suspicious_regions = int(edges.sum())

    heatmap = cv2.applyColorMap(edges, cv2.COLORMAP_JET)

    blended = cv2.addWeighted(image, 0.7, heatmap, 0.3, 0)

    heatmap_path = image_path.replace("uploads/", "uploads/heatmap_")

    cv2.imwrite(heatmap_path, blended)

    return {
        "edge_density": suspicious_regions,
        "possible_edit": bool(suspicious_regions > 100000),
        "heatmap_url": f"http://127.0.0.1:8000/{heatmap_path}"
    }