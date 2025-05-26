import pandas as pd
from .model_loader import load_model, load_label_encoder
from .ai_models import EstadoNutricionalInput

model = load_model()
label_encoder = load_label_encoder()

def predecir_estado_nutricional(data_dict: dict):
    """
    data_dict: diccionario con la misma estructura de columnas que el modelo espera
    """

    # Convertir a DataFrame
    df = pd.DataFrame([data_dict])

    # Predecir
    prediction_encoded = model.predict(df)[0]

    # Decodificar etiqueta
    prediction_label = label_encoder.inverse_transform([prediction_encoded])[0]

    return prediction_label

def preprocess_input(data: EstadoNutricionalInput) -> dict:
    """
    Recibe la instancia validada de EstadoNutricionalInput,
    convierte los campos booleanos o ints 0/1 a enteros 0/1,
    y retorna un dict listo para usar con el modelo.
    """
    # Campos binarios que pueden ser bool o int
    binarios = [
        'enfermedades', 'medicamentos', 'alergias', 'antecedentes_familiares',
        'consumo_frutas', 'consumo_verduras', 'actividad_fisica'
    ]

    data_dict = data.model_dump()

    for campo in binarios:
        val = data_dict[campo]
        if isinstance(val, bool):
            data_dict[campo] = int(val)  # False->0, True->1
        elif isinstance(val, int):
            # Asumimos que ya está bien (0 o 1)
            if val not in (0,1):
                raise ValueError(f"El campo {campo} debe ser 0 o 1 si es int")
        else:
            raise ValueError(f"El campo {campo} debe ser int o bool")

    # Otros campos se quedan igual
    return data_dict
