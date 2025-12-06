import { Request, Response, NextFunction } from 'express';
import { verifyChecksum } from '../utils/checksum';
import { ENV } from '../config/environments';

/**
 * Middleware to verify request checksum
 * Expects checksum in 'x-checksum' header
 * Checksum format: SHA256({secretKey}:{JSON.stringify(body)})
 */
export function verifyChecksumMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Check if secret key is configured
    if (!ENV.RANKING_SECRET_KEY) {
      console.error('❌ RANKING_SECRET_KEY is not configured in environment variables');
      res.status(500).json({
        message: 'Server configuration error',
        code: 'SECRET_KEY_NOT_CONFIGURED'
      });
      return;
    }

    // Get checksum from header
    const checksum = req.headers['x-checksum'] as string;

    if (!checksum) {
      res.status(401).json({
        message: 'Checksum required. Please include x-checksum header.',
        code: 'CHECKSUM_MISSING'
      });
      return;
    }

    // Verify checksum
    const isValid = verifyChecksum(checksum, ENV.RANKING_SECRET_KEY, req.body);

    if (!isValid) {
      res.status(401).json({
        message: 'Invalid request',
      });
      return;
    }

    // Checksum is valid, proceed to next middleware/controller
    next();
  } catch (error) {
    console.error('Error in checksum verification middleware:', error);
    res.status(500).json({
      message: 'Internal server error during checksum verification',
      code: 'CHECKSUM_VERIFICATION_ERROR'
    });
  }
}
