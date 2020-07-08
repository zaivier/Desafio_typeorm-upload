import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);

    const allIncomes = await transactionsRepository.find({
      where: { type: 'income' },
    });
    const allOutcomes = await transactionsRepository.find({
      where: { type: 'outcome' },
    });

    const totalIncomes: number = allIncomes
      .map(m => m.value)
      .reduce((a, b) => Number(a) + Number(b), 0);
    const totalOutcomes: number = allOutcomes
      .map(m => m.value)
      .reduce((a, b) => Number(a) + Number(b), 0);

    return {
      income: totalIncomes,
      outcome: totalOutcomes,
      total: totalIncomes - totalOutcomes,
    };
  }
}

export default TransactionsRepository;
