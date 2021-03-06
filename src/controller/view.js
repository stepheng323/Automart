/* eslint-disable class-methods-use-this */
import Joi from 'joi';
import pool from '../config';
import {
  checkCar,
  checkUser,
  checkCarStatus,
  checkCarStatus2,
  checkPriceRange,
  checkAdmin,
  deleteCar,
} from '../helpers/query';
import priceRangeSchema from '../model/priceRange';

class View {
  specific(req, res, next) {
    (async () => {
      const { rows } = await pool.query(checkCar, [req.params.id]);
      const data = rows[0];
      if (!data) {
        res.status(404).json({
          status: 404,
          error: 'car with the specified id not found',
        });
        return;
      }
      res.status(200).json({
        status: 200,
        data,
      });
      next();
    })().catch(() => {
      res.status(500).json({
        status: 500,
        error: 'Internal Server Error',
      });
    });
  }

  soldOrAvailable(req, res, next) {
    const decoded = req.userData;
    (async () => {
      const { rows } = await pool.query(checkUser, [decoded.id]);
      const user = rows[0];
      if (!user.is_admin) {
        next();
        return;
      }
      if (req.query.status === 'available') {
        next();
        return;
      }
      if (req.query.min_price && req.query.max_price) {
        next();
        return;
      }
      const results2 = await pool.query(checkCarStatus2, ['available', 'sold']);
      const availableOrSold = results2.rows;
      if (!availableOrSold) {
        res.status(404).json({
          status: 404,
          erorr: 'no car found',
        });
        return;
      }
      res.status(200).json({
        status: 200,
        data: availableOrSold,
      });
    })().catch(() => {
      res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    });
  }

  unsold(req, res, next) {
    (async () => {
      if (req.query.min_price && req.query.max_price) {
        next();
        return;
      }
      const { rows: available } = await pool.query(checkCarStatus, [req.query.status]);
      if (!available) {
        res.status(404).json({
          status: 404,
          error: 'no cars found',
        });
        return;
      }
      res.status(200).json({
        status: 200,
        data: available,
      });
    })().catch(() => {
      res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    });
  }

  priceRange(req, res) {
    const result = Joi.validate(req.query, priceRangeSchema);
    if (result.error) {
      res.status(400).json({
        status: 400,
        error: result.error.details[0].message,
      });
      return;
    }

    (async () => {
      const value4 = [
        req.query.status,
        req.query.min_price,
        req.query.max_price,
        req.query.start_year,
        req.query.stop_year,
        req.query.state,
        req.query.manufacturer,
        req.query.model,
      ];
      const { rows } = await pool.query(checkPriceRange, value4);
      const filtered = rows;
      if (filtered.length < 1) {
        res.status(404).json({
          status: 404,
          error: 'no cars found',
        });
        return;
      }
      res.status(200).json({
        status: 200,
        data: filtered,
      });
    })().catch(() => {
      res.status(500).json({
        status: 500,
        error: 'internal server error',
      });
    });
  }

  deleteCar(req, res) {
    (async () => {
      const decoded = req.userData;
      const { rows } = await pool.query(checkAdmin, [decoded.id]);
      const user = rows[0];
      if (user.is_admin) {
        const results = await pool.query(deleteCar, [req.params.car_id]);

        if (!results.rows[0]) {
          res.status(404).json({
            status: 404,
            error: 'No Car Found',
          });
          return;
        }
        res.status(200).json({
          status: 200,
          data: 'car ad successfully deleted',
        });
      } else {
        res.status(403).json({
          status: 403,
          error: 'Only admin can delete a car',
        });
      }
    })().catch(() => {
      res.status(500).json({
        status: 500,
        error: 'Internal Server Error',
      });
    });
  }
}
const view = new View();
export default view;
