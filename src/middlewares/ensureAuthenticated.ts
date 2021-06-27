import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // Receber o token
  const authToken = request.headers.authorization;

  // Verificar se o token está preenchido
  if (!authToken) {
    return response.status(401).end();
  }

  const [, token] = authToken.split(" ");
  // Verificar se o token é válido
  try {
    const { sub } = verify(
      token,
      "58b6836d3584d7acbe00131243070d10"
    ) as IPayload;

    // Recuperar informações do usuário
    request.user_id = sub;

    return next();
    // Se o token não for válido, emitir erro
  } catch (err) {
    return response.status(401).end();
  }
}
