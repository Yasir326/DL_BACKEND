import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { isPositiveInteger } from '../common';

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const getContractsById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const profileId = req.header('profile_id');
    if (!profileId) return res.status(401).json('Access Denied');

    const { id } = req.params;
    if (!isPositiveInteger(id)) {
      return res
        .status(400)
        .json(
          'request header and request parameter id needs to be a positive integer'
        );
    }

    const { Contract } = req.app.get('models');
    const contract = await Contract.findOne({ where: { id } });
    if (!contract) return res.status(404).json('Contract not found');
    if (contract.ClientId != profileId && contract.ContractorId != profileId) {
      return res.status(403).json('Forbidden');
    }
    return res.status(200).json(contract);
  } catch (err: any) {
    return res.status(500).json('Internal Server Error');
  }
};

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const getAllContracts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const profileId = req.header('profile_id');

    if (!profileId) return res.status(401).json('Access Denied');

    const { Contract } = req.app.get('models');
    const contracts = await Contract.findAll({
      where: {
        status: ['in_progress', 'new'],
        [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }]
      }
    });
    if (!contracts) return res.status(200).json('No contracts found');
    return res.status(200).json(contracts);
  } catch (err: any) {
    return res.status(500).json('Internal Server Error');
  }
};
