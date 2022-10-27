import { Request, Response } from 'express';
import { sequelize } from '../entities/model';
import { Op } from 'sequelize';
import { defaultLimit } from '../common';

export const bestProfession = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const profileId = req.header('profile_id');
    if (!profileId) return res.status(401).json('Access Denied');

    if (!req.query.start || !req.query.end)
      return res.status(400).json('Please add start and end date to query');

    const { start, end } = req.query;

    const { Job } = req.app.get('models');
    const { Profile } = req.app.get('models');
    const { Contract } = req.app.get('models');

    const [result] = await Job.findAll({
      where: {
        paymentDate: { [Op.gte]: start, [Op.lte]: end }
      },
      include: {
        model: Contract,
        attributes: ['ContractorId'],
        include: {
          model: Profile,
          attributes: ['profession'],
          as: 'Contractor'
        }
      },
      attributes: [
        [sequelize.fn('sum', sequelize.col('price')), 'total_earned']
      ],
      group: 'Contract.ContractorId',
      order: [['paid', 'DESC']],
      limit: 1
    });

    return res.status(200).json(result?.Contract?.Contractor);
  } catch (err: any) {
    return res.status(500).json('Internal Server Error');
  }
};

export const bestClient = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const profileId = req.header('profile_id');
    if (!profileId) return res.status(401).json('Access Denied');

    if (!req.query.start || !req.query.end)
      return res.status(400).json('Please add start and end date to query');

    const { start, end } = req.query;
    const limit = req.query.limit ?? parseInt(defaultLimit);

    const { Job } = req.app.get('models');
    const { Profile } = req.app.get('models');
    const { Contract } = req.app.get('models');

    const result = await Job.findAll({
      where: {
        paymentDate: { [Op.gte]: start, [Op.lte]: end }
      },
      include: {
        model: Contract,
        attributes: ['ClientId'],
        include: {
          model: Profile,
          attributes: ['profession'],
          as: 'Client'
        }
      },
      attributes: [[sequelize.fn('sum', sequelize.col('price')), 'total_paid']],
      group: 'Contract.ClientId',
      order: [['paid', 'DESC']],
      limit
    });

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json('Internal Server Error');
  }
};
