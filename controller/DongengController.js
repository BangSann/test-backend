import Dongeng from "../Models/DongengModel.js";

export const getDongeng = async (req, res) => {
  try {
    const response = await Dongeng.findAll();
    return res.status(200).json(response);
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

export const getDongengById = async (req, res) => {
  try {
    const response = await Dongeng.findOne({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).json(response);
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};
