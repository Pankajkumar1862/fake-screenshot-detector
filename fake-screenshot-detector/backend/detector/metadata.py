
import exifread

def analyze_metadata(image_path):
    with open(image_path, 'rb') as f:
        tags = exifread.process_file(f)

    suspicious = False

    software = tags.get('Image Software')

    if software:
        suspicious = True

    return {
        "editing_software": str(software),
        "suspicious": suspicious
    }