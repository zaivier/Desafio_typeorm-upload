import { getRepository } from 'typeorm';
import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  try {
    const transactionRepository = getRepository(Transaction);
    // const categoryRepository = getRepository(Category);

    const transactions = await transactionRepository
      .createQueryBuilder('transactions')
      .innerJoinAndSelect('transactions.category', 'category')
      .getMany();

    const balance = await new TransactionsRepository().getBalance();

    return response.status(200).json({
      transactions,
      balance,
    });
  } catch (error) {
    console.log(error);
    return response.status(400).json(error);
  }
});

transactionsRouter.post('/', async (request, response) => {
  try {
    const { title, value, type, category } = request.body;

    const createTransactionService = new CreateTransactionService();

    const transactionCreated = await createTransactionService.execute({
      title,
      value,
      type,
      category,
    });

    return response.status(200).json(transactionCreated);
  } catch (error) {
    return response
      .status(error.statusCode)
      .json({ message: error.message, status: 'error' });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  try {
    const [, id] = request.path.split('/');

    const deleteTransactionService = new DeleteTransactionService();
    await deleteTransactionService.execute(id);

    return response.status(204);
  } catch (error) {
    return response
      .status(error.statusCode)
      .json({ message: error.message, status: 'error' });
  }
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
