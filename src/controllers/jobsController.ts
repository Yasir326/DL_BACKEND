import { Request, Response } from 'express';
import { isPositiveInteger } from '../common';
import Sequelize, { Op } from 'sequelize';
import { ProfileType, JobType } from '../types/types';
import { sequelize } from '../entities/model';

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const getUnpaidJobs = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const profileId = req.header('profile_id');

    if (!profileId) return res.status(401).json('Access Denied');

    const { Job } = req.app.get('models');
    const { Contract } = req.app.get('models');
    /** https://sebhastian.com/sequelize-include/ */
    const jobs = await Job.findAll({
      where: {
        paid: null
      },
      include: {
        model: Contract,
        where: {
          status: 'in_progress',
          [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }]
        }
      }
    });
    if (!jobs) return res.status(404).json('No contracts found');
    return res.status(200).json(jobs);
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
export const payForJob = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const profileId = req.header('profile_id');
    if (!profileId) return res.status(401).json('Access Denied');

    const jobId = req.params.job_id;
    console.log(jobId);
    if (!isPositiveInteger(jobId)) {
      return res
        .status(400)
        .json('jobId in request parameter needs to be a positive integer');
    }

    const { Job } = req.app.get('models');
    const { Contract } = req.app.get('models');
    /** https://sebhastian.com/sequelize-include/ */
    const job = await Job.findOne({
      where: {
        id: jobId
      },
      include: {
        model: Contract,
        where: { ClientId: profileId }
      }
    });
    if (!job) return res.status(404).json('No contracts found');

    const { client, contractor } = await getProfile(req, job);
    if (!client || !contractor) {
      return res.status(404).send('Could not find profile');
    }
    if (client.balance < job.price) {
      return res.status(400).json('insufficient funds!');
    }

    const result = updateBalances(req, res, client, job, contractor);
    if (!result) {
      return res.status(400).json('Could not process payment');
    }

    /**
     * Could add better error handling here
     * maybe put inside a transaction
     */
    const updateJobPaid = await Job.update(
      { paid: true },
      { where: { id: jobId } }
    );

    return res.status(201).send(`successfully paid for ${updateJobPaid}`);
  } catch (err: any) {
    return res.status(500).json('Internal Server Error');
  }
};

/**
 * https://sequelize.org/docs/v6/other-topics/transactions/
 * @param req
 * @param client
 * @param job
 * @param contractor
 * @returns
 * would also be good to update this so you can pay a certain amount
 */
function updateBalances(
  req: Request,
  res: Response,
  client: ProfileType,
  job: JobType,
  contractor: ProfileType
) {
  const { Profile } = req.app.get('models');
  try {
    const result = sequelize.transaction(async (t: Sequelize.Transaction) => {
      await Profile.update(
        { balance: client.balance - job.price },
        { where: { id: job.Contract.ClientId } },
        { transaction: t }
      );
      await Profile.update(
        { balance: contractor.balance + job.price },
        { where: { id: job.Contract.ContractorId } },
        { transaction: t }
      );
    });
    return result;
  } catch (err: any) {
    return res.status(400).json('Unable to update client balance');
  }
}

/**
 * Can make this function more generic
 */
async function getProfile(req: Request, job: JobType) {
  const { Profile } = req.app.get('models');
  const clientId = job.Contract.ClientId;
  const contractorId = job.Contract.ContractorId;

  const client: ProfileType = await Profile.findOne({
    where: { id: clientId }
  });
  const contractor: ProfileType = await Profile.findOne({
    where: { id: contractorId }
  });

  return { client, contractor };
}
