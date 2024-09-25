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

export const countDongeng = async (req, res) => {
  try {
    const response = (await Dongeng.findAll()).length;
    return res.status(200).json({ row: response });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

export const countAllView = async (req, res) => {
  try {
    const views = await Dongeng.findAll({ attributes: ["view"] });
    let viewAll = 0;
    views.map((view) => {
      // console.log(view.view)
      viewAll += view.view;
    });
    return res.status(200).json({ views: viewAll });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

export const popularView = async (req, res) => {
  try {
    const result = await Dongeng.findAll({
      limit: 4,
      order: [["view", "DESC"]],
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const sumView = async (req, res) => {
  const { id } = req.params;
  try {
    const raw = await Dongeng.findOne({
      where: { id },
    });

    raw.update({ view: raw.view + 1 });
    return res.status(200).json({ message: "Berhasil menambah view" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
