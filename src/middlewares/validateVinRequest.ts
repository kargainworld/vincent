import { Request, Response, NextFunction } from 'express';
import VinDecoder from '../services/VinDecoder';

function validateVinRequest(req: Request, res: Response, next: NextFunction): Response | void {
  if (!req.params.vin) {
    return res.json({ success: false, error: 101 });
  }

  const { vin } = req.params;

  if (vin.length > 17) {
    return res.json({ success: false, error: 102 });
  }
  if (vin.length < 17) {
    return res.json({ success: false, error: 103 });
  }
  if (!VinDecoder.isVinValid(vin)) {
    return res.json({ success: false, error: 104 });
  }

  return next();
}

export default validateVinRequest;
