import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { hash } from "bcryptjs";

interface IUserRequest {
  name: string;
  email: string;
  admin?: boolean;
  password: string;
}

class CreateUserService {
  async execute({ name, email, admin = false, password }: IUserRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);

    // Verificar se o email está preenchido, caso não esteja, emitir erro
    if (!email) {
      throw new Error("Incorrect email");
    }

    // Verificar se o usuário existe
    const userAlreadyExists = await usersRepositories.findOne({
      email,
    });
    // Se o usuário existir, emitir mensagem de erro
    if (userAlreadyExists) {
      throw new Error("User already exists");
    }
    
    const passwordHash = await hash(password, 8);

    // Se não houver problemas, criar novo usuário
    const user = usersRepositories.create({
      name,
      email,
      admin,
      password: passwordHash,
    });
    // Salvar novo usuário
    await usersRepositories.save(user);

    return user;
  }
}

export { CreateUserService };
