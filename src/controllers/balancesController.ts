import { Request, Response } from 'express';
import { JobType, ProfileType } from '../types/types';
import { isPositiveInteger, percentage } from '../common';
import Sequelize, { Op } from 'sequelize';
import { sequelize } from '../entities/model';

export const deposit = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const profileId = req.header('profile_id');
    const clientId = req.params.userId;

    if (!profileId) return res.status(401).json('Access Denied');
    if (!clientId) return res.status(400).json('Please specifiy clientId');

    if (!req.body || !req.body.amount) {
      return res.status(400).json('Please specifiy amount to deposit');
    }

    if (!isPositiveInteger(req.body.amount)) {
      return res.status(400).json('Please enter a positive numerical value');
    }

    const depositAmount = parseFloat(req.body.amount);

    /**
     * not 100% sure about the below check, what if a client
     * has multiple profiles linked to a company which is a client or
     * a contractor is also a client so could have multiple clientID.
     * went with assumption that client and authenticated client must always be the same.
     */
    if (profileId !== clientId) return res.status(403).send('Forbidden');

    if (depositAmount <= 0) return res.status(400).json('Invalid amount');

    const unpaidAmount = await getUnpaidAmount(req, clientId);
    const limit = unpaidAmount * parseFloat(percentage);

    if (depositAmount > limit) {
      return res
        .status(400)
        .json(
          `Amount $${depositAmount} is to high, max amount that can be deposited is $${limit}`
        );
    }

    const updatedBalance = await updateClientBalance(
      req,
      res,
      depositAmount,
      clientId
    );

    return res
      .status(201)
      .json(
        `Successfully deposited $${depositAmount} for client ${updatedBalance}`
      ); //messaging here can definitely be improved
  } catch (err: any) {
    return res.status(500).json('Internal Server Error');
  }
};

async function updateClientBalance(
  req: Request,
  res: Response,
  depositAmount: number,
  clientId: string
) {
  try {
    const { Profile } = req.app.get('models');
    const client: ProfileType = await Profile.findOne({
      where: { id: clientId }
    });
    const result = sequelize.transaction(async (t: Sequelize.Transaction) => {
      return await Profile.update(
        { balance: client.balance + depositAmount },
        { where: { id: clientId } },
        { transaction: t }
      );
    });
    return result;
  } catch (err: any) {
    return res.status(400).json('Unable to update client balance');
  }
}

async function getUnpaidAmount(req: Request, clientId: string) {
  const { Job } = req.app.get('models');
  const { Contract } = req.app.get('models');

  const jobs = await Job.findAll({
    where: {
      paid: true
    },
    include: {
      model: Contract,
      where: {
        status: ['in_progress', 'new', 'terminated'],
        [Op.and]: { ClientId: clientId }
      }
    }
  });

  const jobPrices = jobs.map((job: JobType) => job.price);
  return jobPrices.reduce(
    (previous: number, current: number) => previous + current,
    0
  );
}
