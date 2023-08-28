import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function createBin() {
  try {
    const response = await axios.post(`${API_URL}/bins`);

    return response.data;
  } catch(error) {
    console.error(error);
  }
}

async function getBin(binId: string) {
  try {
    const response = await axios.get(`${API_URL}/bins/${binId}`);

    return response.data;
  } catch(error) {
    console.error(error);
  }
}

async function renameBin(binId: string, newName: string) {
  try {
    await axios.put(`${API_URL}/bins/${binId}`, { newName })
  } catch(error) {
    console.error(error);
  }
}

export default { createBin, getBin, renameBin };