import express from "express";
const router = express.Router();
;
import { verifyTokenUser} from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import { login,pdfUpload,getSinglePdf,editPdf,downloadPdf,getAllPdf,deletePdf } from "../controller/user.js";


router.post("/login", login);
router.post("/pdf",upload.single("file"),verifyTokenUser, pdfUpload);
router.get("/pdf",verifyTokenUser, getSinglePdf);
router.put("/pdf",verifyTokenUser, editPdf);
router.delete("/pdf",verifyTokenUser, deletePdf);
router.get("/allpdf",verifyTokenUser, getAllPdf)
router.get("/download-PDF",verifyTokenUser, downloadPdf)

export default router;