import express, { Request, Response } from 'express';
import binsService from './services/bins';
import requestsService from './services/requests';
import cors from 'cors';
import * as asyncErrors from 'express-async-errors';

const app = express();

app.use(express.json());
app.use(cors());
app.use(asyncErrors());

async function storeRequest(req: Request, binId: string) {
  const { request } = await requestsService.addRequest(binId, req);

  console.log('request added:', request);
  return request;
}

function emitRequest(request: any, binId: string) {
  const socket = app.get('io');

  // Emit the request data to any clients on the active bin Id
  const newRequestEventName = `new_request_to_${binId}`;
  
  console.log(newRequestEventName);
  
  socket.emit(newRequestEventName, { request });
}

// Retrieve bin
app.get('/bins/:id', async (req: Request, res: Response) => {
  const binId = req.params.id;
  
  const binWithRequests = await binsService.getBinWithRequests(binId);

  return res.status(200).json(binWithRequests);
});

// Create bin
app.post('/bins', async (_: Request, res: Response) => {
  const binId = await binsService.createBin();
  
  return res.status(200).json({ binId });
});

// Update bin name
app.put('/bins/:id', async (req: Request, res: Response) => {
  const binId = req.params.id;
  const updatedName = req.body['new_name'];
  
  await binsService.updateBinName(binId, updatedName);
  
  return res.status(200).json({ newName: updatedName });
});

// Post a webhook
app.post(['/webhooks/:binId', '/webhooks/:binId/*'], async (req: Request, res: Response) => {
  const { binId } = req.params;
  const request = await storeRequest(req, binId);
  emitRequest(request, binId);
  
  return res.status(200).send();
});

// Get a webhook
app.get(['/webhooks/:binId', '/webhooks/:binId/*'], async (req: Request, res: Response) => {
  const { binId } = req.params;
  const request = await storeRequest(req, binId);
  
  emitRequest(request, binId);

  return res.status(200).send();
});

// Clear requests
// TODO: Make this a seperate process, or disallow route
app.post('/cleanup', async (_: Request, res: Response) => {
  await requestsService.clearRequests();

  return res.status(200).send();
});

// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err);
  
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;