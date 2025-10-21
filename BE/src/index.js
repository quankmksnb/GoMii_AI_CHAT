import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat.js';
const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: false }));
app.use(express.json());
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/chat', chatRouter);
const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map