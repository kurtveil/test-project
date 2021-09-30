import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const URL_BASE = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios' ,
    id: string
  ){

    try {

      const URL = `${URL_BASE}/uploads/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('imagen', archivo);

      const resp = await fetch(URL, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json();
      if (data.ok) {
        return data.nombreArchivo;
      } else {
        return false;

      }


    } catch (error) {
      console.log(error);
      return false;

    }
  }
}
