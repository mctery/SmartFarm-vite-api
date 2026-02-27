const express = require('express');
const {
  getSensorWidget,
  createSensorWidget,
  updateSensorWidget,
  deleteSensorWidget,
} = require('../controllers/sensorWidgetController');
const { verifyToken } = require('../middleware/authorization');
const { checkPermission } = require('../middleware/checkPermission');
const validate = require('../middleware/validate');
const {
  createSensorWidgetSchema,
} = require('../validations/sensorWidgetValidation');

const router = express.Router();

router.use(verifyToken);

router
  .route('/:device_id')
  .get(checkPermission('widgets:read'), getSensorWidget)
  .put(checkPermission('widgets:write'), updateSensorWidget)
  .delete(checkPermission('widgets:delete'), deleteSensorWidget);

router.post('/', checkPermission('widgets:write'), validate(createSensorWidgetSchema), createSensorWidget);

module.exports = router;
