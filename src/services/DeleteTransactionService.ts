import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    try {
      const repositoryTransactions = getRepository(Transaction);

      await repositoryTransactions.delete(id);
    } catch (error) {
      throw new AppError(error.message);
    }
  }
}

export default DeleteTransactionService;
