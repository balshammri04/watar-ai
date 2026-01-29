// controllers/clinicConfigController.js

const ClinicConfig = require("../models/ClinicConfig");

//  Create new clinic config
exports.createClinicConfig = async (req, res) => {
  try {
    const config = await ClinicConfig.create(req.body);

    return res.status(201).json({
      message: "Clinic configuration created successfully",
      data: config,
    });
  } catch (err) {
    console.error("❌ Error creating clinic config:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

//  Get all clinic configs
exports.getAllClinicConfigs = async (req, res) => {
  try {
    const configs = await ClinicConfig.findAll();

    return res.json({
      message: "All clinic configurations fetched successfully",
      data: configs,
    });
  } catch (err) {
    console.error("❌ Error fetching clinic configs:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

//  Update clinic config by id
exports.updateClinicConfig = async (req, res) => {
  try {
    const { id } = req.params;

    const config = await ClinicConfig.findByPk(id);

    if (!config) {
      return res.status(404).json({
        message: "Clinic configuration not found",
      });
    }

    await config.update(req.body);

    return res.json({
      message: "Clinic configuration updated successfully",
      data: config,
    });
  } catch (err) {
    console.error("❌ Error updating clinic config:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
