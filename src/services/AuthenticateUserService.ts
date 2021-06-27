import { getCustomRepository } from "typeorm";

import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { UsersRepositories } from "../repositories/UsersRepositories";

interface IAuthenticateRequest {
  email: string;
  password: string;
}

class AuthenticateUserService {
  async execute({ email, password }: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    // Verificar se o email é válido
    const user = await usersRepositories.findOne({
      email,
    });

    // Se o email não for válido, emitir mensagem de erro
    if (!user) {
      throw new Error("Incorrect email/password");
    }

    // Se o email for válido, verificar se a senha está correta
    const passwordMatch = await compare(password, user.password);

    // Se a senha não estiver correta, emitir mensagem de erro
    if (!passwordMatch) {
      throw new Error("Incorrect email/password");
    }

    // Se a senha estiver correta, gerar token
    const token = sign(
      {
        email: user.email,
      },
      "58b6836d3584d7acbe00131243070d10",
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );

    return token;
  }
}

export { AuthenticateUserService };
