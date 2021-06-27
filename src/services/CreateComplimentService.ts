import { getCustomRepository } from "typeorm";
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories";
import { UsersRepositories } from "../repositories/UsersRepositories";

interface IComplimentRequest {
  tag_id: string;
  user_sender;
  user_receiver: string;
  message: string;
}

class CreateComplimentService {
  async execute({
    tag_id,
    user_sender,
    user_receiver,
    message,
  }: IComplimentRequest) {
    const complimentsRepositories = getCustomRepository(
      ComplimentsRepositories
    );
    const usersRepositories = getCustomRepository(UsersRepositories);

    // Verificar se o usuário está enviando o elogio para ele mesmo, se estiver, emitir erro
    if (user_sender === user_receiver) {
      throw new Error("Incorrect User Receiver");
    }

    // Verificar se o usuário existe
    const userReceiverExists = await usersRepositories.findOne(user_receiver);
    // Se o usuário não existir, emitir mensagem de erro
    if (!userReceiverExists) {
      throw new Error("User Receiver does not exist");
    }

    const compliment = complimentsRepositories.create({
      tag_id,
      user_receiver,
      user_sender,
      message,
    });

    await complimentsRepositories.save(compliment);

    return compliment;
  }
}

export { CreateComplimentService };
