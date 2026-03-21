import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Path configurável via variável de ambiente
const UPLOADS_PATH = process.env.UPLOADS_PATH || path.join(process.cwd(), 'uploads');

// Garantir que o diretório existe
if (!fs.existsSync(UPLOADS_PATH)) {
  fs.mkdirSync(UPLOADS_PATH, { recursive: true });
  console.log(`✅ Diretório de uploads criado: ${UPLOADS_PATH}`);
}

// Configuração de upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_PATH);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF são permitidos!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});
