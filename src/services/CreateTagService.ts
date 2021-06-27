import { getCustomRepository } from "typeorm";
import { TagsRepositories } from "../repositories/TagsRepositories";

class CreateTagService {
  async execute(name: string) {
    const tagsRepositories = getCustomRepository(TagsRepositories);

    // Verificar se o nome da tag está preenchido, caso não esteja, emitir erro
    if (!name) {
      throw new Error("Incorrect tag name");
    }

    // Verificar se a tag já existe
    const tagAlreadyExists = await tagsRepositories.findOne({
      name,
    });
    // Se a tag já existir, emitir mensagem de erro
    if (tagAlreadyExists) {
      throw new Error("Tag already exists");
    }

    // Se não houver problemas, criar nova tag
    const tag = tagsRepositories.create({
      name,
    });
    // Salvar nova tag
    await tagsRepositories.save(tag);

    return tag;
  }
}

export { CreateTagService };
