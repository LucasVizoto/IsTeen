import type { GamesRepository } from '@/repositories/games-repository.js';
import { NotFoundError } from './errors/not-found-error.js';

interface DeleteGameUseCaseRequest {
    gameId: string
}
interface DeleteGameUseCaseResponse {}

export class DeleteGameUseCase{
  constructor(private gameRepository: GamesRepository) {}

  async execute({
   gameId
  }: DeleteGameUseCaseRequest): Promise<DeleteGameUseCaseResponse> {

    const game = await this.gameRepository.findById(gameId)

    if(!game){
        throw new NotFoundError()
    }

    await this.gameRepository.delete(game)

    return {}

  }
}
