import { getRepository, TransactionRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransacationRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    try {
      const transacationRepository = getRepository(Transaction);
      const categoryRepository = getRepository(Category);

      const transactionLocalRepository = new TransacationRepository();

      if (type === 'outcome') {
        const balance = await transactionLocalRepository.getBalance();

        if (balance.total - value < 0) {
          throw new AppError("You don't have income enough", 400);
        }
      }

      const existsCategory = await categoryRepository.findOne({
        where: { title: category },
      });

      console.log(existsCategory);
      let category_id;
      if (existsCategory) {
        category_id = existsCategory.id;
      } else {
        const categoryAdd = categoryRepository.create({
          title: category,
        });

        await categoryRepository.save(categoryAdd);
        category_id = categoryAdd.id;
      }

      const transactionAdded = transacationRepository.create({
        title,
        value,
        type,
        category_id,
      });

      await transacationRepository.save(transactionAdded);

      return transactionAdded;
    } catch (error) {
      throw new AppError(error.message, 400);
    }
  }
}

export default CreateTransactionService;
