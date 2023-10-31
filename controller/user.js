import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { PDFDocument } from "pdf-lib";
import userModel from "../model/userSchema.js";
import { generateToken } from "../middleware/auth.js";


export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      let user = await userModel.findOne({ email: email});
  
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(202).json({ message: "Incorrect Password " });
      }
      else{
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      email,
      password: hashedPassword,
    });
          user =await newUser.save();
      }
  
      const { _id} = user;
  
      const token = generateToken(_id,"user");
      res.status(200).json({ token: token});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  export const pdfUpload = async (req, res, next) => {
    try {
        const originalFileData = req.file?.buffer
        const originalFileName = req.file?.originalname
        const {id}=req.user
        const response = await userModel.findOneAndUpdate({_id:id},{$push: { "files": {originalFileName,originalFileData} }},{new:true}).select('files')
        res.status(201).json({ status: true, response, message: "successfully uploaded" });
      } catch (error) {
        res.sendStatus(500);
         console.log(error.message);
      }
    }
  export const getSinglePdf = async (req, res, next) => {
    try {
        const {fileId} = req.query;
        const {id}=req.user
      const data = await userModel.findOne({ _id: new mongoose.Types.ObjectId(id), 'files._id': new mongoose.Types.ObjectId(fileId) }, 
      { 'files.$': 1 });
     
      if (data) {
        const fileData= data.files[0].originalFileData
        res.send(fileData);
      } else {
        res.json({ status: false, message: "PDF not found" });
      }
    } 
       catch (error) {
        res.sendStatus(500);
         console.log(error.message);
      }
    }

    export const editPdf = async (req, res, next) => {
      try {
        console.log(req.body)
        const  {pages,fileId}= req.body
        const {id}=req.user
        const pagesToExtract = pages.reduce((acc,curr)=>{
          if(curr.selected){
            acc.push(curr.value)
          }
          return acc
        },[])
        if(pagesToExtract.length!==0){
        const data = await userModel.findOne({ _id: new mongoose.Types.ObjectId(id), 'files._id': new mongoose.Types.ObjectId(fileId) }, 
        { 'files.$': 1 });
        const PDFBuffer= data.files[0].originalFileData
        if (PDFBuffer) {
          const pdfDoc = await PDFDocument.load(PDFBuffer);
          const extractedPdfDoc = await PDFDocument.create();
          for (const pageIndex of pagesToExtract) {
            const [copiedPage] = await extractedPdfDoc.copyPages(pdfDoc, [pageIndex-1]);
            extractedPdfDoc.addPage(copiedPage);
          }
          const extractedPdfBytes = await extractedPdfDoc.save()
          const modifiedFileName=`modified_${data.files[0].originalFileName}`
          const response = await userModel.findOneAndUpdate({_id: new mongoose.Types.ObjectId(id), 'files._id': new mongoose.Types.ObjectId(fileId)},{$set: { "files.$.modifiedFileName": modifiedFileName,"files.$.modifiedFileData":Buffer.from(extractedPdfBytes) }},{new:true}).select('files')
          if(response)
          res.status(201).json({ status: true, fileId, message: "successfully uploaded" });
        }
      }
      else{
        res.status(400).json({ status: false, message: "no pages selected" });
      }
        } catch (error) {
          res.sendStatus(500);
           console.log(error.message);
        }
      }

      export const downloadPdf = async (req, res, next) => {
        try {
            const {fileId} = req.query;
            const {id}=req.user
          const data = await userModel.findOne({ _id: new mongoose.Types.ObjectId(id), 'files._id': new mongoose.Types.ObjectId(fileId) }, 
          { 'files.$': 1 });
          if (data) {
            const fileData= data.files[0].modifiedFileData
            const fileName= data.files[0].modifiedFileName
            res.send({fileData,fileName});
          } else {
            res.json({ status: false, message: "PDF not found" });
          }
        
        } 
           catch (error) {
            res.sendStatus(500);
             console.log(error.message);
          }
        }

        export const getAllPdf = async (req, res, next) => {
          try {
              const {id}=req.user
            const data = await userModel.find({ _id: new mongoose.Types.ObjectId(id), 'files.modifiedFileData': { $exists: true } }, 
            { 'files.$': 1 });
           console.log(data)
            if (data) {
              res.send(data);
            } else {
              res.json({ status: false, message: "PDF not found" });
            }
          } 
             catch (error) {
              res.sendStatus(500);
               console.log(error.message);
            }
          }

          export const deletePdf = async (req, res, next) => {
            try {
                const {fileId} = req.query;
                const {id}=req.user
              const data = await userModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id), 'files._id': new mongoose.Types.ObjectId(fileId) }, 
              { $pull: { 'files': { _id: new mongoose.Types.ObjectId(fileId) } } });
             
              if (data) {
                const fileData= data.files[0].originalFileData
                res.send(fileData);
              } else {
                res.json({ status: false, message: "PDF not found" });
              }
            } 
               catch (error) {
                res.sendStatus(500);
                 console.log(error.message);
              }
            }