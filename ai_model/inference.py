import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image
import numpy as np
import os

class MammographyModel(nn.Module):
    def __init__(self):
        super(MammographyModel, self).__init__()
        # Load pretrained model
        self.model = torch.hub.load('pytorch/vision:v0.10.0', 'resnet50', pretrained=True)
        # Modify last layer for binary classification
        self.model.fc = nn.Linear(2048, 2)
        
    def forward(self, x):
        return self.model(x)

class InferenceEngine:
    def __init__(self, model_path=None):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = MammographyModel().to(self.device)
        
        if model_path and os.path.exists(model_path):
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))
        
        self.model.eval()
        
        # Define image transforms
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
    
    def predict(self, image_path):
        """
        Make prediction on a single image
        Returns:
            dict: {
                "label": str,
                "confidence": float,
                "heatmap": str
            }
        """
        try:
            # Load and preprocess image
            image = Image.open(image_path).convert('RGB')
            image_tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            # Get prediction
            with torch.no_grad():
                output = self.model(image_tensor)
                probabilities = torch.softmax(output, dim=1)
                confidence, predicted = torch.max(probabilities, 1)
                
            # Generate heatmap (placeholder for now)
            heatmap_path = self._generate_heatmap(image_path)
            
            return {
                "label": "rupture" if predicted.item() == 1 else "normal",
                "confidence": confidence.item(),
                "heatmap": heatmap_path
            }
            
        except Exception as e:
            print(f"Error during prediction: {str(e)}")
            return None
    
    def _generate_heatmap(self, image_path):
        """
        Generate GradCAM heatmap for the image
        Returns path to saved heatmap
        """
        # Placeholder implementation
        # TODO: Implement actual GradCAM
        heatmap_dir = "static/heatmaps"
        os.makedirs(heatmap_dir, exist_ok=True)
        
        # Generate a dummy heatmap for now
        heatmap_path = os.path.join(heatmap_dir, f"heatmap_{os.path.basename(image_path)}")
        # TODO: Implement actual heatmap generation
        return heatmap_path

# Example usage
if __name__ == "__main__":
    engine = InferenceEngine()
    result = engine.predict("path/to/image.dcm")
    print(result) 