from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ComplaintAnalysisRequest(BaseModel):
    description: str
    disputeType: str
    khasraGataNumber: str | None = None

@app.post("/api/ml/ocr")
async def process_ocr(file: UploadFile = File(...), demo: str = Form("false")):
    import random
    
    fields_to_extract = [
        {"key": "ownerName", "label": "Owner Name", "weight": 1.5},
        {"key": "fatherHusbandName", "label": "Father's/Husband's Name", "weight": 1.0},
        {"key": "khasraGataNumber", "label": "Khasra/Gata Number", "weight": 1.5},
        {"key": "khataNumber", "label": "Khata Number", "weight": 1.5},
        {"key": "village", "label": "Village", "weight": 1.2},
        {"key": "tehsil", "label": "Tehsil", "weight": 1.0},
        {"key": "district", "label": "District", "weight": 1.0},
        {"key": "landArea", "label": "Land Area", "weight": 1.2},
        {"key": "landType", "label": "Land Type", "weight": 0.5},
        {"key": "mutationNumber", "label": "Mutation Number", "weight": 0.8},
        {"key": "registrationNumber", "label": "Registration Number", "weight": 0.8},
        {"key": "registrationDate", "label": "Registration Date", "weight": 0.5},
    ]

    demo_values = {
        "ownerName": "Ram Kumar",
        "fatherHusbandName": "Shyam Kumar",
        "khasraGataNumber": "145",
        "khataNumber": "42",
        "village": "Kakori",
        "tehsil": "Sadar",
        "district": "Lucknow",
        "landArea": "2.5 Hectares",
        "landType": "Agricultural",
        "mutationNumber": "MUT-9912",
        "registrationNumber": "REG-LUC-88221",
        "registrationDate": "15/03/2024",
    }

    dummy_values = {
        "ownerName": "Scanned Owner",
        "fatherHusbandName": "Scanned Father",
        "khasraGataNumber": str(random.randint(100, 999)),
        "khataNumber": str(random.randint(10, 200)),
        "village": random.choice(["Chinhat", "Malihabad", "Gomti Nagar", "Aliganj"]),
        "tehsil": random.choice(["Sadar", "Mohanlalganj", "Bakshi Ka Talab"]),
        "district": random.choice(["Lucknow", "Kanpur Nagar", "Varanasi", "Agra"]),
        "landArea": f"{random.uniform(0.5, 10):.2f} Hectares",
        "landType": random.choice(["Agricultural", "Residential", "Commercial"]),
        "mutationNumber": f"MUT-{random.randint(1000, 9999)}",
        "registrationNumber": f"REG-UP-{random.randint(10000, 99999)}",
        "registrationDate": f"{random.randint(1,28)}/{random.randint(1,12)}/{random.randint(2018,2026)}",
    }

    values = demo_values if demo == "true" else dummy_values
    
    extracted_fields = {}
    total_weight = 0
    weighted_sum = 0

    for f in fields_to_extract:
        if demo == "true":
            base_conf = random.uniform(85, 99)
        else:
            # Simulate some fields being low confidence (realistic OCR behavior)
            if f["key"] in ["ownerName", "fatherHusbandName"]:
                base_conf = random.uniform(55, 95)  # Names are harder for OCR
            elif f["key"] in ["landArea", "registrationDate"]:
                base_conf = random.uniform(50, 92)  # Numbers with units can be tricky
            else:
                base_conf = random.uniform(65, 98)
        
        conf_score = round(base_conf, 1)
        
        extracted_fields[f["key"]] = {
            "value": values[f["key"]],
            "confidence": conf_score
        }
        
        weighted_sum += conf_score * f["weight"]
        total_weight += f["weight"]

    overall_confidence = round(weighted_sum / total_weight, 1) if total_weight > 0 else 0

    return {
        "success": True,
        "text": "DEMO TEXT" if demo == "true" else "Extracted OCR text from uploaded document...",
        "fields": extracted_fields,
        "overallConfidence": overall_confidence
    }

@app.post("/api/ml/analyze")
async def analyze_complaint(request: ComplaintAnalysisRequest):
    desc = request.description.lower()
    
    summary = f"The citizen is reporting a {request.disputeType} regarding Khasra/Gata No. {request.khasraGataNumber or 'unknown'}."
    
    detected_conflicts = []
    risk_level = "Low"
    recommended_action = "Standard Review"

    if "acre" in desc or "area" in desc or "hectare" in desc:
        detected_conflicts.append("Possible area mismatch between physical boundary and digital record.")
        risk_level = "Medium"
        recommended_action = "Field Verification by Lekhpal / Patwari"

    if "fake" in desc or "fraud" in desc or "sold" in desc:
        detected_conflicts.append("Potential fraudulent transaction or duplicate ownership claim.")
        risk_level = "High"
        recommended_action = "Revenue Officer Review & Legal Verification"

    if request.disputeType == "Boundary Dispute":
        detected_conflicts.append("Physical boundary encroachment suspected.")
        risk_level = "Medium"
        recommended_action = "GIS Parcel Boundary Validation & Field Measurement"

    if request.disputeType == "Duplicate Ownership":
        detected_conflicts.append("Multiple ownership claims detected for the same Khasra.")
        risk_level = "High"
        recommended_action = "Cross-reference Registry records and verify chain of ownership"

    if not detected_conflicts:
        detected_conflicts.append("No critical inconsistencies detected in text.")

    return {
        "success": True,
        "analysis": {
            "summary": summary,
            "detectedConflicts": detected_conflicts,
            "riskLevel": risk_level,
            "recommendedAction": recommended_action
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
