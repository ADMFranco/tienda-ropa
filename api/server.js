import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Configurar rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos del frontend
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// Ruta raíz → index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Rutas adicionales por si el usuario entra directo a /productos.html, etc.
app.get("/:page", (req, res) => {
  const page = req.params.page;
  const filePath = path.join(frontendPath, page);
  res.sendFile(filePath, (err) => {
    if (err) res.sendFile(path.join(frontendPath, "index.html"));
  });
});

// Puerto dinámico para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor funcionando en puerto ${PORT}`));
