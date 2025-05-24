from db.database import db
from bson import ObjectId
from datetime import datetime, date
from typing import List, Dict, Optional
from .report_models import (
    ReporteIndividual, ReporteGrupal, ReporteSeguimiento,
    MedicionReporte, ClasificacionReporte, 
    EstadisticasNutricionales, EstadisticasSexo,
    ReportFilter
)
import logging

logger = logging.getLogger(__name__)

# Referencias a las colecciones (usando nombres correctos de tu base de datos)
children_col = db["children"]
measurements_col = db["anthropometric_data"]
classification_col = db["classification_results"]


def calcular_edad(fecha_nacimiento: date) -> int:
    """Calcula la edad en años"""
    today = date.today()
    return today.year - fecha_nacimiento.year - ((today.month, today.day) < (fecha_nacimiento.month, fecha_nacimiento.day))


def determinar_tendencia_imc(mediciones: List[MedicionReporte]) -> Optional[str]:
    """Determina la tendencia del IMC basado en las últimas mediciones"""
    if len(mediciones) < 2:
        return None
    
    # Comparar las últimas 3 mediciones si están disponibles
    recent_measurements = mediciones[-3:] if len(mediciones) >= 3 else mediciones
    
    if len(recent_measurements) < 2:
        return None
    
    first_imc = recent_measurements[0].imc
    last_imc = recent_measurements[-1].imc
    
    difference = last_imc - first_imc
    
    if difference > 0.5:
        return "empeorando"
    elif difference < -0.5:
        return "mejorando"
    else:
        return "estable"


def generar_reporte_individual(child_id: str) -> ReporteIndividual:
    """Genera un reporte completo para un niño específico"""
    try:
        # Buscar el niño
        child_doc = children_col.find_one({"_id": ObjectId(child_id)})
        if not child_doc:
            raise ValueError(f"Niño con ID {child_id} no encontrado")

        # Obtener mediciones ordenadas por fecha
        mediciones_cursor = measurements_col.find(
            {"child_id": ObjectId(child_id)}
        ).sort("fecha_medicion", 1)
        
        mediciones = []
        for m in mediciones_cursor:
            mediciones.append(MedicionReporte(
                peso=m["peso"],
                talla=m["talla"],
                imc=m["imc"],
                fecha_medicion=m["fecha_medicion"]
            ))

        # Obtener clasificaciones ordenadas por fecha
        clasificaciones_cursor = classification_col.find(
            {"child_id": ObjectId(child_id)}
        ).sort("fecha_resultado", -1)  # Más reciente primero
        
        clasificaciones = []
        ultima_clasificacion = None
        
        for i, c in enumerate(clasificaciones_cursor):
            clasificacion = ClasificacionReporte(
                resultado=c["resultado"],
                modelo=c["modelo"],
                fecha_resultado=c["fecha_resultado"],
                confidence_score=c.get("confidence_score")
            )
            clasificaciones.append(clasificacion)
            
            # La primera es la más reciente
            if i == 0:
                ultima_clasificacion = c["resultado"]

        # Calcular edad actual
        edad_actual = calcular_edad(child_doc["fecha_nacimiento"])
        
        # Determinar tendencia del IMC
        tendencia_imc = determinar_tendencia_imc(mediciones)

        reporte = ReporteIndividual(
            child_id=str(child_doc["_id"]),
            nombre=child_doc["nombre"],
            apellido=child_doc["apellido"],
            fecha_nacimiento=child_doc["fecha_nacimiento"],
            sexo=child_doc["sexo"],
            edad_actual=edad_actual,
            institucion=child_doc.get("institucion"),
            barrio=child_doc.get("barrio"),
            mediciones=mediciones,
            clasificaciones=clasificaciones,
            ultima_clasificacion=ultima_clasificacion,
            tendencia_imc=tendencia_imc
        )
        
        logger.info(f"Reporte individual generado para niño {child_id}")
        return reporte

    except Exception as e:
        logger.error(f"Error generando reporte individual para {child_id}: {e}")
        raise


def _build_match_filter(filtros: Optional[ReportFilter]) -> dict:
    match_filter = {}
    if not filtros:
        return match_filter
    if filtros.sexo:
        match_filter["sexo"] = filtros.sexo
    if filtros.institucion:
        match_filter["institucion"] = filtros.institucion
    if filtros.barrio:
        match_filter["barrio"] = filtros.barrio
    if filtros.rango_edad_min is not None or filtros.rango_edad_max is not None:
        today = date.today()
        if filtros.rango_edad_max is not None:
            min_birth_date = date(today.year - filtros.rango_edad_max - 1, today.month, today.day)
            match_filter["fecha_nacimiento"] = {"$gte": min_birth_date}
        if filtros.rango_edad_min is not None:
            max_birth_date = date(today.year - filtros.rango_edad_min, today.month, today.day)
            if "fecha_nacimiento" in match_filter:
                match_filter["fecha_nacimiento"]["$lte"] = max_birth_date
            else:
                match_filter["fecha_nacimiento"] = {"$lte": max_birth_date}
    return match_filter

def _get_estadisticas_sexo(match_filter: dict, total_ninos: int) -> EstadisticasSexo:
    pipeline_sexo = [
        {"$match": match_filter},
        {"$group": {"_id": "$sexo", "count": {"$sum": 1}}}
    ]
    sexo_results = list(children_col.aggregate(pipeline_sexo))
    estadisticas_sexo = EstadisticasSexo(total=total_ninos)
    for result in sexo_results:
        if result["_id"] == "M":
            estadisticas_sexo.masculino = result["count"]
        elif result["_id"] == "F":
            estadisticas_sexo.femenino = result["count"]
    return estadisticas_sexo

def _get_estadisticas_nutricionales(match_filter: dict) -> EstadisticasNutricionales:
    pipeline_nutricional = [
        {"$match": match_filter},
        {
            "$lookup": {
                "from": "classification_results",
                "localField": "_id",
                "foreignField": "child_id",
                "as": "clasificaciones"
            }
        },
        {"$match": {"clasificaciones": {"$ne": []}}},
        {
            "$addFields": {
                "ultima_clasificacion": {
                    "$arrayElemAt": [
                        {
                            "$sortArray": {
                                "input": "$clasificaciones",
                                "sortBy": {"fecha_resultado": -1}
                            }
                        },
                        0
                    ]
                }
            }
        },
        {
            "$group": {
                "_id": "$ultima_clasificacion.resultado",
                "count": {"$sum": 1}
            }
        }
    ]
    nutricional_results = list(children_col.aggregate(pipeline_nutricional))
    estadisticas_nutricionales = EstadisticasNutricionales()
    for result in nutricional_results:
        estado = result["_id"]
        count = result["count"]
        estadisticas_nutricionales.total += count
        if estado == "normal":
            estadisticas_nutricionales.normal = count
        elif estado == "riesgo_desnutricion":
            estadisticas_nutricionales.riesgo_desnutricion = count
        elif estado == "desnutricion_aguda_moderada":
            estadisticas_nutricionales.desnutricion_aguda_moderada = count
        elif estado == "desnutricion_aguda_severa":
            estadisticas_nutricionales.desnutricion_aguda_severa = count
        elif estado == "sobrepeso":
            estadisticas_nutricionales.sobrepeso = count
        elif estado == "obesidad":
            estadisticas_nutricionales.obesidad = count
    return estadisticas_nutricionales

def _get_promedios(match_filter: dict):
    pipeline_imc = [
        {"$match": match_filter},
        {
            "$lookup": {
                "from": "anthropometric_data",
                "localField": "_id",
                "foreignField": "child_id",
                "as": "mediciones"
            }
        },
        {"$match": {"mediciones": {"$ne": []}}},
        {"$unwind": "$mediciones"},
        {
            "$group": {
                "_id": "$_id",
                "ultimo_imc": {"$last": "$mediciones.imc"},
                "edad": {
                    "$first": {
                        "$subtract": [
                            {"$year": "$$NOW"},
                            {"$year": "$fecha_nacimiento"}
                        ]
                    }
                }
            }
        },
        {
            "$group": {
                "_id": None,
                "promedio_imc": {"$avg": "$ultimo_imc"},
                "promedio_edad": {"$avg": "$edad"}
            }
        }
    ]
    imc_results = list(children_col.aggregate(pipeline_imc))
    promedio_imc_general = None
    promedio_edad = None
    if imc_results:
        promedio_imc_general = round(imc_results[0]["promedio_imc"], 2) if imc_results[0]["promedio_imc"] else None
        promedio_edad = round(imc_results[0]["promedio_edad"], 1) if imc_results[0]["promedio_edad"] else None
    return promedio_imc_general, promedio_edad

def _get_instituciones_representadas(match_filter: dict):
    instituciones = children_col.distinct("institucion", match_filter)
    return [i for i in instituciones if i is not None]

def generar_reporte_grupal(filtros: Optional[ReportFilter] = None) -> ReporteGrupal:
    """Genera un reporte grupal con estadísticas generales"""
    try:
        match_filter = _build_match_filter(filtros)
        total_ninos = children_col.count_documents(match_filter)
        estadisticas_sexo = _get_estadisticas_sexo(match_filter, total_ninos)
        estadisticas_nutricionales = _get_estadisticas_nutricionales(match_filter)
        promedio_imc_general, promedio_edad = _get_promedios(match_filter)
        instituciones_representadas = _get_instituciones_representadas(match_filter)
        reporte = ReporteGrupal(
            total_ninos=total_ninos,
            estadisticas_nutricionales=estadisticas_nutricionales,
            estadisticas_sexo=estadisticas_sexo,
            promedio_imc_general=promedio_imc_general,
            promedio_edad=promedio_edad,
            instituciones_representadas=instituciones_representadas
        )
        logger.info(f"Reporte grupal generado con {total_ninos} niños")
        return reporte
    except Exception as e:
        logger.error(f"Error generando reporte grupal: {e}")
        raise


def generar_reporte_seguimiento(child_id: str) -> ReporteSeguimiento:
    """Genera un reporte de seguimiento para un niño específico"""
    try:
        # Buscar el niño
        child_doc = children_col.find_one({"_id": ObjectId(child_id)})
        if not child_doc:
            raise ValueError(f"Niño con ID {child_id} no encontrado")

        # Obtener mediciones ordenadas por fecha
        mediciones_cursor = measurements_col.find(
            {"child_id": ObjectId(child_id)}
        ).sort("fecha_medicion", 1)
        
        mediciones = list(mediciones_cursor)
        total_mediciones = len(mediciones)
        
        primera_medicion = None
        ultima_medicion = None
        cambio_peso = None
        cambio_talla = None
        cambio_imc = None
        meses_seguimiento = None

        if total_mediciones > 0:
            primera_medicion = mediciones[0]["fecha_medicion"]
            ultima_medicion = mediciones[-1]["fecha_medicion"]
            
            if total_mediciones > 1:
                cambio_peso = round(mediciones[-1]["peso"] - mediciones[0]["peso"], 2)
                cambio_talla = round(mediciones[-1]["talla"] - mediciones[0]["talla"], 2)
                cambio_imc = round(mediciones[-1]["imc"] - mediciones[0]["imc"], 2)
                
                # Calcular meses de seguimiento
                delta = ultima_medicion - primera_medicion
                meses_seguimiento = round(delta.days / 30.44, 1)  # Promedio de días por mes

        reporte = ReporteSeguimiento(
            child_id=str(child_doc["_id"]),
            nombre=child_doc["nombre"],
            apellido=child_doc["apellido"],
            total_mediciones=total_mediciones,
            primera_medicion=primera_medicion,
            ultima_medicion=ultima_medicion,
            cambio_peso=cambio_peso,
            cambio_talla=cambio_talla,
            cambio_imc=cambio_imc,
            meses_seguimiento=meses_seguimiento
        )
        
        logger.info(f"Reporte de seguimiento generado para niño {child_id}")
        return reporte

    except Exception as e:
        logger.error(f"Error generando reporte de seguimiento para {child_id}: {e}")
        raise