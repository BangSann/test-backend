import path from "path";
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

// new version
// isian column
// title:varchar, pdfURL:varchar, cover:varchar, filename:varchar

export const createDongeng = async (req, res) => {
  // request POST title, pdfURL, cover
  const {title, pdfURL} = req.body

  // file
  const {cover} = req.files
  const ext = path.extname(cover.name)

  if (cover === null) {
    return res.status(400).json({ message: "Tidak ada file yang di upload" });
  }

  const alowedTypes = [".png", ".jpeg", ".jpg", ".webp", ".svg"];

  if (!alowedTypes.includes(ext.toLowerCase())) {
    return res.status(422).json({ message: "File Tidak Valid" });
  }

  // new filename
  let newFilename = new Date().toISOString().replace(/[-:.]/g, "");
  const newFilenameWExt = `${newFilename}${ext}`

  console.log(newFilenameWExt);

  cover.mv(`./public/img/${newFilename}`, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    const path = `${req.protocol}://${req.get("host")}/public/img/${newFilenameWExt}`; // Ganti dengan path ke file PDF Anda
    try{
      await Dongeng.create({title:title, pdfURL:pdfURL, cover:path, filename:newFilenameWExt})
      return res.status(200).json({message: "berhasil menambah dongeng!"})
    }catch(error){
      return res.status(500).json({error: error.message})
    }
  })
}

// export const deleteDongeng = async (req, res) => {
//   const item = await Dongeng.findOne({
//     where: {
//       id: req.params.id,
//     },
//   });
//   // console.log(item);
//   if (!item)
//     return res.status(404).json({ message: "Dongeng tidak ditemukan!" });
//   try {
//     const {filename} = item;
//     fs.unlinkSync(`./public/img/${filename}`);
//     await item.destroy({
//       where: req.params.id,
//     });
//     res.status(200).json({ message: "Dongeng berhasil dihapus!" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };


// // title:varchar, pdfURL:varchar, cover:varchar, filename:varchar
// export const updateDongeng = async (req, res) => {
//   const {title, pdfURL} = req.body
//   const item = await Dongeng.findOne({
//     where: {
//       id: req.params.id,
//     },
//   });

//   if (!item) {
//     return res.status(404).json({ message: "Dongeng tidak ditemukan" });
//   }
  

//   if (!req.files.cover) {
//     try{
//       await item.update({
//         title,
//         pdfURL
//       });
//       res.status(200).json({ message: "Dongeng Berhasil diperbarui" });
//     }catch(error){
//       res.status(500).json({error: error.message})
//     }
    
//   } else {
//     const cover = req.files.cover;
//     const ext = path.extname(cover.name);

//     const alowedTypes = [".png", ".jpeg", ".jpg", ".webp", ".svg"];

//     if (!alowedTypes.includes(ext.toLowerCase())) {
//       return res.status(422).json({ message: "File Tidak Valid" });
//     }

//     try {
//       const newFilename = new Date().toISOString().replace(/[-:.]/g, "");
//       const newFilenameWExt = `${newFilename}.${ext}`

//       file.mv(`./public/img/${newFilenameWExt}`, async (err) => {
//         if (err) {
//           return res.status(500).json({ message: err.message });
//         }

        
//         fs.unlinkSync(`./public/img/${item.filename}`);

//         await item.update({
//           title: req.body.title,
//           pdfURL,
//           cover: `${req.protocol}://${req.get("host")}/img/${item.filename}`,
//           fileName: newFilenameWExt,
//         });

//         res.status(200).json({ message: "Dongeng berhasil di perbarui!" });
//       });
//     } catch (err) {
//       return res.json(500).json({ message: err.message });
//     }
//   }
// };

