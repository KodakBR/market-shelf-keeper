const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`;

export const fetchProductsFromAPI = async () => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchBackupFromAPI = async () => {
  const response = await fetch(`${API_URL}/backup`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const createBackup = async (products: any[]) => {
  await fetch(`${API_URL}/backup`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(products)
  });
};

export const addProduct = async (product: any) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const updateProduct = async (product: any) => {
  const response = await fetch(`${API_URL}/products/${product.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const deleteProduct = async (id: string) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};