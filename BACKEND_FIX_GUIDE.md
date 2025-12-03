# Guía para Arreglar el Error de SQLAlchemy en el Backend

## Problema Identificado

**Error:** `MissingGreenlet: greenlet_spawn has not been called`

**Causa:** El endpoint `GET /accounting/cuentas` está intentando serializar objetos `CuentaContable` con relaciones lazy (`cuentas_hijas`) fuera del contexto de la sesión de base de datos.

---

## Solución 1: Usar Eager Loading (Recomendado)

### Archivo a modificar: `app/routers/accounting.py` o similar

**Antes:**
```python
@router.get("/cuentas")
async def get_cuentas(db: Session = Depends(get_db)):
    cuentas = db.query(CuentaContable).all()
    return cuentas
```

**Después:**
```python
from sqlalchemy.orm import selectinload

@router.get("/cuentas")
async def get_cuentas(db: Session = Depends(get_db)):
    cuentas = db.query(CuentaContable).options(
        selectinload(CuentaContable.cuentas_hijas)
    ).all()
    return cuentas
```

---

## Solución 2: Modificar el Schema Pydantic

### Archivo a modificar: `app/schemas/accounting.py` o similar

**Opción A: Hacer el campo opcional y manejarlo manualmente**
```python
from typing import Optional, List
from pydantic import BaseModel, Field

class CuentaContableBase(BaseModel):
    id: int
    codigo: str
    nombre: str
    # ... otros campos

class CuentaContableResponse(CuentaContableBase):
    cuentas_hijas: Optional[List['CuentaContableResponse']] = Field(default_factory=list)
    
    class Config:
        from_attributes = True
        
    @classmethod
    def from_orm(cls, obj):
        # Cargar explícitamente las relaciones
        data = {
            'id': obj.id,
            'codigo': obj.codigo,
            'nombre': obj.nombre,
            # ... otros campos
            'cuentas_hijas': []
        }
        
        # Intentar cargar cuentas_hijas si está disponible
        try:
            if hasattr(obj, 'cuentas_hijas') and obj.cuentas_hijas:
                data['cuentas_hijas'] = [cls.from_orm(hija) for hija in obj.cuentas_hijas]
        except:
            data['cuentas_hijas'] = []
            
        return cls(**data)
```

**Opción B: Usar defer para evitar cargar la relación**
```python
from sqlalchemy.orm import defer

@router.get("/cuentas")
async def get_cuentas(db: Session = Depends(get_db)):
    cuentas = db.query(CuentaContable).options(
        defer(CuentaContable.cuentas_hijas)
    ).all()
    return cuentas
```

---

## Solución 3: Modificar el Modelo SQLAlchemy

### Archivo a modificar: `app/models/accounting.py` o similar

**Cambiar la estrategia de carga de la relación:**

**Antes:**
```python
class CuentaContable(Base):
    __tablename__ = "cuentas_contables"
    
    id = Column(Integer, primary_key=True)
    # ... otros campos
    
    # Relación lazy (problemática)
    cuentas_hijas = relationship("CuentaContable", backref="cuenta_padre")
```

**Después:**
```python
class CuentaContable(Base):
    __tablename__ = "cuentas_contables"
    
    id = Column(Integer, primary_key=True)
    # ... otros campos
    
    # Relación con eager loading
    cuentas_hijas = relationship(
        "CuentaContable", 
        backref="cuenta_padre",
        lazy="selectin"  # Cambiado a selectin para cargar automáticamente
    )
```

---

## Solución 4: Usar un Endpoint Específico con Serialización Manual

```python
from typing import List, Dict, Any

def serialize_cuenta(cuenta: CuentaContable, include_children: bool = True) -> Dict[str, Any]:
    """Serializa una cuenta manualmente para evitar problemas de lazy loading"""
    data = {
        "id": cuenta.id,
        "codigo": cuenta.codigo,
        "nombre": cuenta.nombre,
        "tipo": cuenta.tipo,
        # ... otros campos básicos
    }
    
    if include_children:
        try:
            # Intentar cargar hijas si existen
            data["cuentas_hijas"] = [
                serialize_cuenta(hija, include_children=False) 
                for hija in cuenta.cuentas_hijas
            ]
        except:
            data["cuentas_hijas"] = []
    
    return data

@router.get("/cuentas")
async def get_cuentas(db: Session = Depends(get_db)):
    cuentas = db.query(CuentaContable).all()
    return [serialize_cuenta(cuenta) for cuenta in cuentas]
```

---

## Recomendación Final

**La mejor solución es combinar:**

1. **Solución 1** (Eager Loading) en el endpoint
2. **Solución 3** (Modificar el modelo) para cambiar `lazy="selectin"`

Esto asegura que las relaciones se carguen correctamente sin problemas de contexto.

---

## Verificación

Después de aplicar los cambios:

1. Reinicia el servidor del backend
2. Prueba el endpoint: `GET http://localhost:8000/accounting/cuentas`
3. Verifica que no aparezcan errores de `MissingGreenlet`
4. El frontend debería recibir los datos correctamente

---

## Archivos Probables a Modificar

Busca estos archivos en tu backend:
- `app/routers/accounting.py` o `app/api/endpoints/accounting.py`
- `app/models/accounting.py` o `app/models/cuenta_contable.py`
- `app/schemas/accounting.py` o `app/schemas/cuenta.py`
