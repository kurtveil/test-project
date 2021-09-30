import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { Usuario } from '../models/usuario.model';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';

const urlBase = environment.base_url;

declare const gapi: any;
@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  public menu = [];
  public auth2: any;
  public usuario!: Usuario;
  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone,

  ) {
    this.googleInit();
  }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get uid(): string{
    return this.usuario.uid || '';
  }

  get headers(){
    return {
        headers: {
        'x-token': this.token
      }
    };
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE'{
    return this.usuario.role!;
  }

  googleInit() {
    return new Promise<void>((resolve) => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '986753093743-mkaql0umilaheh4uvk0lgvmdht4iakuj.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    });
  }

  logout(): void {

    // localStorage.removeItem('menu');
    localStorage.removeItem('token');

    this.auth2.signOut().then( () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${urlBase}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((res: any) => {
        const {email, google, img = '', nombre, role, uid} = res.usuario;
        this.usuario = new Usuario( nombre, email, '', role, google, img, uid     );
        this.guardarLocalStorage(res.token, res.menu);
        return true;
      }),

      catchError(() => of(false))
    );
  }

  crearUsuario(formData: RegisterForm): any {

    return this.http.post(`${urlBase}/usuarios`, formData)
      .pipe(
        tap((res: any) => {
          this.guardarLocalStorage(res.token, res.menu);
        }),
      );
  }

  actualizarUsuario(data: {email: string, nombre: string, role: string}){
    data = {
      ...data,
      role: this.usuario.role!
    };
    return this.http.put(`${urlBase}/usuarios/${this.uid}`, data, this.headers);
  }

  login(formData: LoginForm): any {
    return this.http.post(`${urlBase}/login`, formData)
      .pipe(
        tap(
          (res: any) => {
            this.guardarLocalStorage(res.token, res.menu);
          })
      );
  }
  loginGoogle(token: any): any {
    return this.http.post(`${urlBase}/login/google`, { token })
      .pipe(
        tap(
          (res: any) => {
            this.guardarLocalStorage(res.token, res.menu);
          })
      );
  }

  cargarUsuarios(){
    const url = `${ urlBase }/usuarios`;
    return this.http.get<Usuario>(url, this.headers)
    .pipe(
      map((res: any) => {
       
        return res;
      })
    );
  }


  eliminarUsuario(usuario: Usuario){
    const url = `${ urlBase }/usuarios/${ usuario.uid }`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(usuario: Usuario){
    console.log(usuario);
    return this.http.put(`${urlBase}/usuarios/${usuario.uid}`, usuario, this.headers);
  }

  guardarLocalStorage(token: string, menu: any){
    localStorage.setItem('token', token);
  }


  saveData(usuario: Usuario){
    this.usuario = usuario;
  }

}
