export interface UploadResult {
  sucesso: boolean;
  url: string;
  filename: string;
  tamanho: string;
  tamanhoBytes: number;
  tipo: 'pdf' | 'video';
  salvoEm: string;
}

export function uploadArquivo(
  file: File,
  tipo: 'pdf' | 'video',
  onProgress?: (porcentagem: number) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `/api/upload/stream?nome=${encodeURIComponent(file.name)}&tipo=${encodeURIComponent(tipo)}`;

    if (xhr.upload && onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve(res);
        } catch {
          reject(new Error('Resposta inválida do servidor ao processar o arquivo.'));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.mensagem || 'Falha ao fazer upload do arquivo.'));
        } catch {
          reject(new Error(`Erro ${xhr.status} no upload do arquivo.`));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Falha de conexão com o servidor durante o upload.'));
    });

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', file.type || (tipo === 'pdf' ? 'application/pdf' : 'video/mp4'));
    xhr.setRequestHeader('X-Filename', encodeURIComponent(file.name));
    xhr.send(file);
  });
}
