from db.database import db
from bson import ObjectId
from datetime import datetime
from typing import List, Dict
from .report_models import ReporteIndividual, ReporteGrupal

# Referencias a las colecciones relevantes
children_col = db["ninos"]
measurements_col = db["datos_antropometricos"]
classification_col = db["resultados_clasificacion"]

# Reporte individual completo
def generar_reporte_individual(child_id: str) -> ReporteIndividual:
    child_doc = children_col.find_one({"_id": ObjectId(child_id)})
    if not child_doc:
        raise ValueError("Niño no encontrado")

    # Obtener mediciones ordenadas por fecha
    mediciones_cursor = measurements_col.find({"child_id": ObjectId(child_id)}).sort("fecha_medicion", 1)
    mediciones = []
    for m in mediciones_cursor:
        mediciones.append({
            "peso": m.get("peso"),
            "talla": m.get("talla"),
            "imc": m.get("imc"),
            "fecha_medicion": m.get("fecha_medicion"),
        })

    # Obtener clasificaciones ordenadas por fecha
    clasificaciones_cursor = classification_col.find({"child_id": ObjectId(child_id)}).sort("fecha_resultado", 1)
    clasificaciones = []
    for c in clasificaciones_cursor:
        clasificaciones.append({
            "resultado": c.get("resultado"),
            "modelo": c.get("modelo"),
            "fecha_resultado": c.get("fecha_resultado"),
        })

    reporte = ReporteIndividual(
        child_id=str(child_doc["_id"]),
        nombre=child_doc.get("nombre"),
        apellido=child_doc.get("apellido"),
        fecha_nacimiento=child_doc.get("fecha_nacimiento"),
        sexo=child_doc.get("sexo"),
        mediciones=mediciones,
        clasificaciones=clasificaciones,
        recomendaciones=[]  # Aquí se pueden añadir recomendaciones específicas luego
    )
    return reporte

# Reporte grupal con estadísticas básicas
def generar_reporte_grupal() -> ReporteGrupal:
    pipeline = [
        {
            "$lookup": {
                "from": "datos_antropometricos",
                "localField": "_id",
                "foreignField": "child_id",
                "as": "mediciones"
            }
        },
        {
            "$unwind": "$mediciones"
        },
        {
            "$group": {
                "_id": "$sexo",
                "count": {"$sum": 1},
                "promedio_imc": {"$avg": "$mediciones.imc"}
            }
        }
    ]

    resultados = list(children_col.aggregate(pipeline))

    total_ninos = children_col.count_documents({})
    distribucion_estado = {}
    promedio_imc = None

    if resultados:
        for r in resultados:
            sexo = r["_id"]
            distribucion_estado[sexo] = r["count"]
            promedio_imc = r["promedio_imc"]  # Simple promedio global, puedes mejorarlo

    reporte = ReporteGrupal(
        total_niños=total_ninos,
        distribución_estado_nutricional=distribucion_estado,
        promedio_imc=promedio_imc,
        tendencias=None
    )
    return reporte
