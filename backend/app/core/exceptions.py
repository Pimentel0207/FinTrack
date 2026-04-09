from fastapi import HTTPException, status


def unauthorized(message: str = "Token inválido ou expirado."):
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"code": "ERR_UNAUTHORIZED", "message": message})


def forbidden(message: str = "Acesso negado."):
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"code": "ERR_FORBIDDEN", "message": message})


def not_found(message: str = "Recurso não encontrado."):
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"code": "ERR_NOT_FOUND", "message": message})


def conflict(message: str = "Registro duplicado."):
    raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"code": "ERR_CONFLICT", "message": message})


def unprocessable(message: str = "Operação inválida."):
    raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail={"code": "ERR_UNPROCESSABLE", "message": message})
